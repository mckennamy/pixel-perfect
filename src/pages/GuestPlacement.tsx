import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ACCOMMODATIONS, AccommodationDef, BedSlot, BedType, ExtraType, RoomDef } from "@/lib/accommodations";
import { loadEdit, saveEdit } from "@/lib/siteEdits";
import { toast } from "sonner";
import estateMapAsset from "@/assets/estate-map.jpg.asset.json";

interface Guest { id: string; full_name: string; invite_tier: string; }

interface Placement { guestId: string; guestName: string; }
interface ExtraBed { id: string; label: string; type: ExtraType; placements: Placement[]; }

interface PlacementState {
  // beds (defined in ACCOMMODATIONS) → list of guests sleeping there
  beds: Record<string, Placement[]>;
  // dynamic extras added by admin to specific rooms
  extras: Record<string, ExtraBed[]>; // roomId → list
}

function bedCapacity(type: BedType): number {
  return type === "double" || type === "queen" ? 2 : 1;
}
function extraCapacity(type: ExtraType): number {
  return type === "sofa-queen" ? 2 : 1;
}

const STORAGE_ID = "guest_placements";

function emptyState(): PlacementState {
  return { beds: {}, extras: {} };
}

export default function GuestPlacement() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [state, setState] = useState<PlacementState>(emptyState());
  const [openAccId, setOpenAccId] = useState<string | null>(null);
  const [pickerFor, setPickerFor] = useState<{ kind: "bed" | "extra"; id: string; roomId?: string; capacity: number; label: string } | null>(null);
  const [guestSearch, setGuestSearch] = useState("");
  const [pickerSearch, setPickerSearch] = useState("");

  // Authorize: either guest-mode "mckenna myers" OR admin role
  useEffect(() => {
    const stored = sessionStorage.getItem("wedding_guest");
    let allowed = false;
    if (stored) {
      try { const g = JSON.parse(stored); if (g?.name?.toLowerCase?.() === "mckenna myers") allowed = true; } catch { /* ignore */ }
    }
    if (allowed) { setAuthorized(true); return; }
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) { setAuthorized(false); return; }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle();
      setAuthorized(!!data);
    });
  }, []);

  // Load guests + saved state
  useEffect(() => {
    if (!authorized) return;
    (async () => {
      const [g, edit] = await Promise.all([
        supabase.from("guests").select("id, full_name, invite_tier").order("full_name"),
        loadEdit(STORAGE_ID),
      ]);
      if (g.data) setGuests(g.data as Guest[]);
      if (edit) {
        try {
          const parsed = JSON.parse(edit);
          // Migrate old shape (Placement | null) → Placement[]
          const beds: Record<string, Placement[]> = {};
          Object.entries(parsed.beds ?? {}).forEach(([k, v]: [string, any]) => {
            if (!v) return;
            if (Array.isArray(v)) beds[k] = v;
            else beds[k] = [v];
          });
          const extras: Record<string, ExtraBed[]> = {};
          Object.entries(parsed.extras ?? {}).forEach(([k, arr]: [string, any]) => {
            extras[k] = (arr ?? []).map((e: any) => ({
              id: e.id,
              label: e.label,
              type: e.type ?? "extra-single",
              placements: Array.isArray(e.placements) ? e.placements : (e.placement ? [e.placement] : []),
            }));
          });
          setState({ beds, extras });
        } catch { /* ignore */ }
      }
      setLoading(false);
    })();
  }, [authorized]);

  const persist = async (next: PlacementState) => {
    setState(next);
    try {
      const content = JSON.stringify(next);
      try { localStorage.setItem(STORAGE_ID, content); } catch { /* ignore */ }
      const { error } = await supabase.from("site_edits").upsert(
        { id: STORAGE_ID, content, updated_at: new Date().toISOString() },
        { onConflict: "id" },
      );
      if (error) throw error;
    } catch (err) {
      console.error("Failed to save placement:", err);
      toast.error("Could not save placement");
    }
  };

  // All placed guest ids (for "available" filter)
  const placedGuestIds = useMemo(() => {
    const ids = new Set<string>();
    Object.values(state.beds).forEach((arr) => arr?.forEach((p) => ids.add(p.guestId)));
    Object.values(state.extras).forEach((arr) => arr.forEach((e) => e.placements.forEach((p) => ids.add(p.guestId))));
    return ids;
  }, [state]);

  const filteredGuests = useMemo(() => {
    const q = guestSearch.trim().toLowerCase();
    return guests.filter((g) => !q || g.full_name.toLowerCase().includes(q));
  }, [guests, guestSearch]);

  const addGuestToBed = (bedId: string, guest: Guest, capacity: number) => {
    const cur = state.beds[bedId] ?? [];
    if (cur.some((p) => p.guestId === guest.id)) return;
    if (cur.length >= capacity) { toast.error("That bed is full."); return; }
    const next: PlacementState = { ...state, beds: { ...state.beds, [bedId]: [...cur, { guestId: guest.id, guestName: guest.full_name }] } };
    persist(next);
  };
  const removeGuestFromBed = (bedId: string, guestId: string) => {
    const cur = state.beds[bedId] ?? [];
    const remaining = cur.filter((p) => p.guestId !== guestId);
    const next: PlacementState = { ...state, beds: { ...state.beds } };
    if (remaining.length) next.beds[bedId] = remaining; else delete next.beds[bedId];
    persist(next);
  };

  const addGuestToExtra = (roomId: string, extraId: string, guest: Guest, capacity: number) => {
    const next: PlacementState = { ...state, extras: { ...state.extras } };
    const list = (next.extras[roomId] ?? []).map((e) => {
      if (e.id !== extraId) return e;
      if (e.placements.some((p) => p.guestId === guest.id)) return e;
      if (e.placements.length >= capacity) { toast.error("That bed is full."); return e; }
      return { ...e, placements: [...e.placements, { guestId: guest.id, guestName: guest.full_name }] };
    });
    next.extras[roomId] = list;
    persist(next);
  };
  const removeGuestFromExtra = (roomId: string, extraId: string, guestId: string) => {
    const next: PlacementState = { ...state, extras: { ...state.extras } };
    next.extras[roomId] = (next.extras[roomId] ?? []).map((e) =>
      e.id === extraId ? { ...e, placements: e.placements.filter((p) => p.guestId !== guestId) } : e,
    );
    persist(next);
  };

  const addExtraBed = (acc: AccommodationDef, room: RoomDef, optId: string, optLabel: string, optType: ExtraType) => {
    // Enforce extraBedCap per-property
    if (acc.extraBedCap != null) {
      const used = acc.rooms.reduce((sum, r) => sum + (state.extras[r.id]?.length ?? 0), 0);
      if (used >= acc.extraBedCap) {
        toast.error(`${acc.name} allows max ${acc.extraBedCap} additional beds`);
        return;
      }
    }
    const next: PlacementState = { ...state, extras: { ...state.extras } };
    const list = next.extras[room.id] ? [...next.extras[room.id]] : [];
    list.push({ id: `${optId}-${Date.now()}`, label: optLabel, type: optType, placements: [] });
    next.extras[room.id] = list;
    persist(next);
  };

  const removeExtraBed = (roomId: string, extraId: string) => {
    const next: PlacementState = { ...state, extras: { ...state.extras } };
    next.extras[roomId] = (next.extras[roomId] ?? []).filter((e) => e.id !== extraId);
    if (!next.extras[roomId].length) delete next.extras[roomId];
    persist(next);
  };

  if (!authorized) {
    return (
      <div className="page-wrapper flex items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-sm">
          <p className="kicker mb-3" style={{ color: "#dc2626" }}>Private</p>
          <p className="font-display italic text-burg" style={{ fontSize: "1.6rem" }}>This planning area is private.</p>
        </div>
      </div>
    );
  }
  if (loading) {
    return <div className="page-wrapper flex items-center justify-center min-h-screen"><p className="font-body italic text-stone">Loading…</p></div>;
  }

  const openAcc = openAccId ? ACCOMMODATIONS.find((a) => a.id === openAccId) : null;

  // Capacity on map cards = total head-count
  const propertyCount = (acc: AccommodationDef) => {
    const total = acc.rooms.reduce((sum, r) => sum + r.beds.reduce((s, b) => s + bedCapacity(b.type), 0), 0);
    const filled = acc.rooms.reduce(
      (sum, r) => sum + r.beds.reduce((s, b) => s + (state.beds[b.id]?.length ?? 0), 0), 0,
    );
    return { filled, total };
  };


  return (
    <div className="page-wrapper px-4 sm:px-6 py-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-6 text-center">
          <p className="kicker mb-2">Guest Placement</p>
          <h1 className="font-display italic text-burg" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 300 }}>
            The Estate
          </h1>
          <p className="font-body italic text-stone text-sm mt-2 max-w-2xl mx-auto">
            Click any villa to manage its bedrooms. Double & queen beds hold up to two guests. Sofa and folding beds appear only when you add them.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
          {/* ─── Left column: map OR villa detail ─── */}
          <div>
            {!openAcc && (
              <EstateMap
                accommodations={ACCOMMODATIONS}
                propertyCount={propertyCount}
                onSelect={(id) => setOpenAccId(id)}
              />
            )}

            {openAcc && (
              <div
                style={{
                  border: "1px solid hsl(var(--burg) / 0.25)",
                  background: "#FAF8F2",
                  padding: "1.25rem 1.25rem 1.5rem",
                }}
              >
                <div className="flex justify-between items-start mb-3 gap-3">
                  <div>
                    <button
                      onClick={() => setOpenAccId(null)}
                      className="kicker mb-2"
                      style={{ background: "none", border: "none", color: "hsl(var(--stone))", cursor: "pointer", padding: 0 }}
                    >
                      ← Back to estate map
                    </button>
                    <p className="kicker" style={{ color: "hsl(var(--gold))" }}>{openAcc.subtitle}</p>
                    <p className="font-display italic text-burg" style={{ fontSize: "1.6rem", fontWeight: 300, lineHeight: 1.1 }}>
                      {openAcc.name}
                    </p>
                  </div>
                  {(() => {
                    const { filled, total } = propertyCount(openAcc);
                    return (
                      <div className="text-right">
                        <p className="kicker" style={{ color: "hsl(var(--gold))", fontSize: "0.5rem" }}>Occupancy</p>
                        <p className="font-display italic text-burg" style={{ fontSize: "1.2rem" }}>{filled}/{total}</p>
                      </div>
                    );
                  })()}
                </div>
                {openAcc.extraBedCap != null && (
                  <p className="font-body text-xs italic text-stone mb-3">
                    Up to {openAcc.extraBedCap} additional beds across this property
                    ({openAcc.rooms.reduce((s, r) => s + (state.extras[r.id]?.length ?? 0), 0)} used).
                  </p>
                )}
                <span className="rule mb-4 block" />
                <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem", maxHeight: "calc(100vh - 240px)", overflowY: "auto", paddingRight: 4 }}>
                  {openAcc.rooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      state={state}
                      onPickBed={(bed) => setPickerFor({ kind: "bed", id: bed.id, capacity: bedCapacity(bed.type), label: bed.label })}
                      onRemoveGuestFromBed={(bedId, guestId) => removeGuestFromBed(bedId, guestId)}
                      onPickExtra={(extra) => setPickerFor({ kind: "extra", id: extra.id, roomId: room.id, capacity: extraCapacity(extra.type), label: extra.label })}
                      onRemoveGuestFromExtra={(extraId, guestId) => removeGuestFromExtra(room.id, extraId, guestId)}
                      onAddExtra={(optId, optLabel, optType) => addExtraBed(openAcc, room, optId, optLabel, optType)}
                      onRemoveExtraSlot={(extraId) => removeExtraBed(room.id, extraId)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ─── Right column: guest list (always visible) ─── */}
          <aside
            style={{
              border: "1px solid hsl(var(--border))",
              background: "#FAF8F2",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              position: "sticky",
              top: 16,
              maxHeight: "calc(100vh - 32px)",
            }}
          >
            <p className="kicker mb-2">Guest List</p>
            <p className="font-body text-xs italic text-stone mb-3">
              {guests.length - placedGuestIds.size} unplaced · {placedGuestIds.size} placed
            </p>
            <input
              type="text"
              value={guestSearch}
              onChange={(e) => setGuestSearch(e.target.value)}
              placeholder="Search guests…"
              className="w-full text-sm mb-3"
              style={{ background: "white", border: "1px solid hsl(var(--border))", padding: "0.5rem 0.65rem", outline: "none" }}
            />
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filteredGuests.map((g) => {
                const placed = placedGuestIds.has(g.id);
                return (
                  <div
                    key={g.id}
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "0.45rem 0.6rem",
                      borderBottom: "1px solid hsl(var(--border))",
                      opacity: placed ? 0.55 : 1,
                    }}
                  >
                    <span className="font-body text-sm" style={{ color: "hsl(var(--ink))" }}>
                      {g.full_name}
                    </span>
                    {placed && (
                      <span className="kicker" style={{ fontSize: "0.45rem", color: "hsl(var(--moss))" }}>
                        ✓ placed
                      </span>
                    )}
                  </div>
                );
              })}
              {filteredGuests.length === 0 && (
                <p className="font-body italic text-sm text-stone text-center py-4">No guests found.</p>
              )}
            </div>
          </aside>
        </div>

        {/* ─── Guest picker modal ─── */}
        {pickerFor && (
          <div
            onClick={() => setPickerFor(null)}
            style={{
              position: "fixed", inset: 0, zIndex: 80,
              background: "rgba(0,0,0,0.5)", display: "flex",
              alignItems: "center", justifyContent: "center", padding: "1rem",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#FAF8F2", maxWidth: 380, width: "100%",
                border: "1px solid hsl(var(--burg) / 0.3)",
                padding: "1.5rem", maxHeight: "75vh", display: "flex", flexDirection: "column",
              }}
            >
              <p className="kicker mb-1">Assign a guest</p>
              <p className="font-body italic text-xs text-stone mb-3">
                {pickerFor.label} · capacity {pickerFor.capacity}
              </p>
              <input
                autoFocus
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                placeholder="Search…"
                style={{ background: "white", border: "1px solid hsl(var(--border))", padding: "0.5rem 0.65rem", outline: "none", marginBottom: 12 }}
              />
              <div style={{ overflowY: "auto", flex: 1 }}>
                {guests
                  .filter((g) => !pickerSearch.trim() || g.full_name.toLowerCase().includes(pickerSearch.trim().toLowerCase()))
                  .map((g) => {
                    const isPlaced = placedGuestIds.has(g.id);
                    return (
                      <button
                        key={g.id}
                        onClick={() => {
                          if (pickerFor.kind === "bed") addGuestToBed(pickerFor.id, g, pickerFor.capacity);
                          else if (pickerFor.roomId) addGuestToExtra(pickerFor.roomId, pickerFor.id, g, pickerFor.capacity);
                          setPickerFor(null);
                        }}
                        style={{
                          display: "block", width: "100%", textAlign: "left",
                          padding: "0.55rem 0.75rem", background: "white",
                          border: "1px solid hsl(var(--border))", marginBottom: 4, cursor: "pointer",
                          fontFamily: "EB Garamond, serif", fontSize: "0.95rem",
                          color: "hsl(var(--ink))",
                        }}
                      >
                        {g.full_name}
                        {isPlaced && <span className="kicker" style={{ marginLeft: 8, color: "hsl(var(--moss))", fontSize: "0.45rem" }}>already placed</span>}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────── Estate map ──────────── */
function EstateMap({
  accommodations, propertyCount, onSelect,
}: {
  accommodations: AccommodationDef[];
  propertyCount: (a: AccommodationDef) => { filled: number; total: number };
  onSelect: (id: string) => void;
}) {
  return (
    <div
      style={{
        position: "relative",
        background: "linear-gradient(180deg, hsl(95 28% 88%), hsl(80 22% 82%))",
        border: "1px solid hsl(var(--border))",
        minHeight: 600,
        overflow: "hidden",
      }}
    >
      {/* Decorative grounds — paths, gardens, pool */}
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, opacity: 0.55 }}>
        {/* Main winding driveway from Pinino (top-left) down to L'Arancera (bottom) */}
        <path d="M 10 12 C 30 30, 30 55, 50 70 S 55 92, 50 95" stroke="hsl(45 30% 70%)" strokeWidth="1.1" fill="none" strokeDasharray="0.6 0.6" />
        {/* Path to east cluster (Grabau / Annadora / Orazio / Stalletta) */}
        <path d="M 50 70 C 65 60, 75 50, 88 35" stroke="hsl(45 30% 70%)" strokeWidth="1.1" fill="none" strokeDasharray="0.6 0.6" />
        {/* Garden patches */}
        <ellipse cx="35" cy="80" rx="14" ry="5" fill="hsl(95 35% 70%)" opacity="0.4" />
        <ellipse cx="70" cy="55" rx="10" ry="4" fill="hsl(95 35% 70%)" opacity="0.4" />
        <ellipse cx="22" cy="40" rx="9" ry="4" fill="hsl(95 35% 70%)" opacity="0.4" />
        {/* Pool near farmhouse */}
        <rect x="58" y="83" width="8" height="4" rx="0.5" fill="hsl(195 50% 70%)" opacity="0.85" />
      </svg>

      {/* Tree dots */}
      {[
        [18, 25],[28, 18],[42, 22],[60, 18],[78, 22],[88, 60],[80, 78],[20, 60],[15, 75],[45, 50],
      ].map(([l, t], i) => (
        <div key={i} style={{
          position: "absolute", left: `${l}%`, top: `${t}%`, width: 10, height: 10,
          borderRadius: "50%", background: "hsl(110 35% 38%)", opacity: 0.45,
          transform: "translate(-50%, -50%)",
        }} />
      ))}

      <p className="kicker" style={{ position: "absolute", top: 14, left: 18, color: "hsl(var(--burg) / 0.6)" }}>
        Villa Grabau Estate
      </p>
      <p className="kicker" style={{ position: "absolute", bottom: 12, right: 16, fontSize: "0.45rem", color: "hsl(var(--stone))", opacity: 0.7 }}>
        N ↑
      </p>

      {accommodations.map((acc) => {
        const { filled, total } = propertyCount(acc);
        const pct = total ? Math.round((filled / total) * 100) : 0;
        if (acc.venueOnly) {
          return (
            <div
              key={acc.id}
              style={{
                position: "absolute", top: `${acc.map.top}%`, left: `${acc.map.left}%`,
                transform: "translate(-50%, -50%)",
                background: "hsl(var(--gold) / 0.18)",
                border: "1.5px dashed hsl(var(--gold))",
                padding: "0.55rem 0.8rem", minWidth: 130, textAlign: "center",
                pointerEvents: "none",
              }}
            >
              <p className="font-display italic" style={{ fontSize: "0.95rem", lineHeight: 1.1, fontWeight: 500, color: "hsl(var(--burg))" }}>
                {acc.name}
              </p>
              <p className="kicker" style={{ fontSize: "0.45rem", marginTop: 4, color: "hsl(var(--burg) / 0.7)" }}>
                Wedding Venue
              </p>
            </div>
          );
        }
        return (
          <button
            key={acc.id}
            onClick={() => onSelect(acc.id)}
            style={{
              position: "absolute", top: `${acc.map.top}%`, left: `${acc.map.left}%`,
              transform: "translate(-50%, -50%)",
              background: "#FAF8F2",
              color: "hsl(var(--burg))",
              border: "1px solid hsl(var(--burg) / 0.4)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              padding: "0.55rem 0.8rem", minWidth: 130, textAlign: "center",
              cursor: "pointer", transition: "transform 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translate(-50%, -50%)")}
          >
            <p className="font-display italic" style={{ fontSize: "0.95rem", lineHeight: 1.1, fontWeight: 500 }}>
              {acc.name}
            </p>
            <p className="kicker" style={{ fontSize: "0.5rem", marginTop: 4, color: "hsl(var(--gold))" }}>
              {filled}/{total} guests · {pct}%
            </p>
          </button>
        );
      })}
    </div>
  );
}

/* ──────────── Room card ──────────── */
function RoomCard({
  room, state,
  onPickBed, onRemoveGuestFromBed,
  onPickExtra, onRemoveGuestFromExtra,
  onAddExtra, onRemoveExtraSlot,
}: {
  room: RoomDef;
  state: PlacementState;
  onPickBed: (bed: BedSlot) => void;
  onRemoveGuestFromBed: (bedId: string, guestId: string) => void;
  onPickExtra: (extra: ExtraBed) => void;
  onRemoveGuestFromExtra: (extraId: string, guestId: string) => void;
  onAddExtra: (optId: string, optLabel: string, optType: ExtraType) => void;
  onRemoveExtraSlot: (extraId: string) => void;
}) {
  const bedSummary = summarizeBeds(room.beds);
  const extras = state.extras[room.id] ?? [];

  return (
    <div style={{ border: "1px solid hsl(var(--border))", background: "white", padding: "0.9rem" }}>
      <div className="flex justify-between items-start gap-2 mb-1">
        <p className="font-display italic text-burg" style={{ fontSize: "1.02rem", fontWeight: 500 }}>
          {room.name}
        </p>
        <p className="kicker" style={{ color: "hsl(var(--gold))", fontSize: "0.45rem" }}>
          {bedSummary}
        </p>
      </div>
      {room.note && (
        <p className="font-body italic text-xs text-stone mb-2">{room.note}</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {room.beds.map((bed) => {
          const placements = state.beds[bed.id] ?? [];
          const cap = bedCapacity(bed.type);
          return (
            <BedRow
              key={bed.id}
              label={bed.label}
              capacity={cap}
              placements={placements}
              onAdd={() => onPickBed(bed)}
              onRemoveGuest={(gid) => onRemoveGuestFromBed(bed.id, gid)}
            />
          );
        })}

        {extras.map((extra) => {
          const cap = extraCapacity(extra.type);
          return (
            <BedRow
              key={extra.id}
              label={`+ ${extra.label}`}
              capacity={cap}
              placements={extra.placements}
              onAdd={() => onPickExtra(extra)}
              onRemoveGuest={(gid) => onRemoveGuestFromExtra(extra.id, gid)}
              onRemoveSlot={() => onRemoveExtraSlot(extra.id)}
              isExtra
            />
          );
        })}
      </div>

      {room.allowedExtras && room.allowedExtras.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {room.allowedExtras.map((opt, idx) => (
            <button
              key={`${opt.id}-${idx}`}
              onClick={() => onAddExtra(opt.id, opt.label, opt.type)}
              className="kicker"
              style={{
                padding: "0.3rem 0.6rem", border: "1px dashed hsl(var(--burg) / 0.4)",
                background: "transparent", color: "hsl(var(--burg))", cursor: "pointer", fontSize: "0.5rem",
              }}
            >
              + Add {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function BedRow({
  label, capacity, placements, onAdd, onRemoveGuest, onRemoveSlot, isExtra,
}: {
  label: string;
  capacity: number;
  placements: Placement[];
  onAdd: () => void;
  onRemoveGuest: (guestId: string) => void;
  onRemoveSlot?: () => void;
  isExtra?: boolean;
}) {
  const full = placements.length >= capacity;
  return (
    <div
      style={{
        padding: "0.5rem 0.65rem",
        background: placements.length ? "hsl(var(--burg-pale))" : (isExtra ? "hsl(42 30% 96%)" : "hsl(42 25% 95%)"),
        border: `1px ${isExtra ? "dashed" : "solid"} hsl(var(--border))`,
      }}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="font-body text-sm" style={{ color: "hsl(var(--ink))" }}>
          {label} <span className="kicker" style={{ fontSize: "0.45rem", color: "hsl(var(--stone))", marginLeft: 4 }}>· holds {capacity}</span>
        </span>
        <div className="flex gap-2">
          <button
            onClick={onAdd}
            disabled={full}
            className="kicker"
            style={{
              padding: "0.3rem 0.6rem", cursor: full ? "not-allowed" : "pointer", fontSize: "0.5rem",
              background: full ? "transparent" : "hsl(var(--burg))",
              color: full ? "hsl(var(--stone))" : "hsl(var(--cream))",
              border: "1px solid hsl(var(--burg))",
              opacity: full ? 0.5 : 1,
            }}
          >
            {full ? "Full" : (placements.length ? "+ Add" : "Assign")}
          </button>
          {isExtra && onRemoveSlot && (
            <button onClick={onRemoveSlot} title="Remove this extra bed" className="kicker"
              style={{ background: "none", border: "none", color: "hsl(0 50% 45%)", cursor: "pointer", fontSize: "0.5rem" }}>
              ✕
            </button>
          )}
        </div>
      </div>
      {placements.length === 0 ? (
        <p className="font-body italic text-xs text-stone">Unassigned</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {placements.map((p) => (
            <span
              key={p.guestId}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "white", border: "1px solid hsl(var(--burg) / 0.3)",
                padding: "0.2rem 0.5rem",
                fontFamily: "EB Garamond, serif", fontSize: "0.85rem", color: "hsl(var(--burg))",
              }}
            >
              {p.guestName}
              <button
                onClick={() => onRemoveGuest(p.guestId)}
                style={{ background: "none", border: "none", color: "hsl(var(--stone))", cursor: "pointer", padding: 0, lineHeight: 1, fontSize: "0.85rem" }}
                title="Remove"
              >×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function summarizeBeds(beds: BedSlot[]): string {
  if (beds.length === 0) return "Living space";
  const singles = beds.filter((b) => b.type === "single").length;
  const doubles = beds.filter((b) => b.type === "double").length;
  const queens = beds.filter((b) => b.type === "queen").length;
  const parts: string[] = [];
  if (singles === 2) parts.push("Two single beds");
  else if (singles === 1) parts.push("Single bed");
  if (doubles >= 1) parts.push(doubles === 1 ? "Double bed (sleeps 2)" : `${doubles} double beds`);
  if (queens >= 1) parts.push(queens === 1 ? "Queen bed (sleeps 2)" : `${queens} queen beds`);
  return parts.join(" · ");
}
