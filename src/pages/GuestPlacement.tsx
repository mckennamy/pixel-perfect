import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ACCOMMODATIONS, AccommodationDef, BedSlot, RoomDef } from "@/lib/accommodations";
import { loadEdit, saveEdit } from "@/lib/siteEdits";
import { toast } from "sonner";

interface Guest { id: string; full_name: string; invite_tier: string; }

interface Placement { guestId: string; guestName: string; }
interface ExtraBed { id: string; label: string; placement: Placement | null; }

interface PlacementState {
  // beds (defined in ACCOMMODATIONS) → who sleeps there
  beds: Record<string, Placement | null>;
  // dynamic extras added by admin to specific rooms
  extras: Record<string, ExtraBed[]>; // roomId → list
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
  const [pickerFor, setPickerFor] = useState<{ kind: "bed" | "extra"; id: string; roomId?: string } | null>(null);
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
          setState({ beds: parsed.beds ?? {}, extras: parsed.extras ?? {} });
        } catch { /* ignore */ }
      }
      setLoading(false);
    })();
  }, [authorized]);

  const persist = async (next: PlacementState) => {
    setState(next);
    try { await saveEdit(STORAGE_ID, JSON.stringify(next)); }
    catch { toast.error("Could not save placement"); }
  };

  // All placed guest ids (for "available" filter)
  const placedGuestIds = useMemo(() => {
    const ids = new Set<string>();
    Object.values(state.beds).forEach((p) => p && ids.add(p.guestId));
    Object.values(state.extras).forEach((arr) => arr.forEach((e) => e.placement && ids.add(e.placement.guestId)));
    return ids;
  }, [state]);

  const filteredGuests = useMemo(() => {
    const q = guestSearch.trim().toLowerCase();
    return guests.filter((g) => !q || g.full_name.toLowerCase().includes(q));
  }, [guests, guestSearch]);

  const assignToBed = (bedId: string, guest: Guest | null) => {
    const next: PlacementState = { ...state, beds: { ...state.beds } };
    if (!guest) delete next.beds[bedId];
    else next.beds[bedId] = { guestId: guest.id, guestName: guest.full_name };
    persist(next);
  };

  const assignToExtra = (roomId: string, extraId: string, guest: Guest | null) => {
    const next: PlacementState = { ...state, extras: { ...state.extras } };
    const list = (next.extras[roomId] ?? []).map((e) =>
      e.id === extraId ? { ...e, placement: guest ? { guestId: guest.id, guestName: guest.full_name } : null } : e,
    );
    next.extras[roomId] = list;
    persist(next);
  };

  const addExtraBed = (acc: AccommodationDef, room: RoomDef, optId: string, optLabel: string) => {
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
    list.push({ id: `${optId}-${Date.now()}`, label: optLabel, placement: null });
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

  // Counts on map cards
  const propertyCount = (acc: AccommodationDef) => {
    const total = acc.rooms.reduce((sum, r) => sum + r.beds.length, 0);
    const filled = acc.rooms.reduce(
      (sum, r) => sum + r.beds.filter((b) => state.beds[b.id]).length, 0,
    );
    return { filled, total };
  };

  return (
    <div className="page-wrapper px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <p className="kicker mb-3">Guest Placement</p>
          <h1 className="font-display italic text-burg" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}>
            The Estate
          </h1>
          <p className="font-body italic text-stone text-sm mt-2 max-w-2xl mx-auto">
            Click any villa to view its bedrooms. Assign guests from your list to specific beds. Sofa beds and additional beds are sidebar options — add them only when needed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* ─── Estate Map ─── */}
          <div
            style={{
              position: "relative",
              background: "linear-gradient(180deg, hsl(120 15% 92%), hsl(90 18% 88%))",
              border: "1px solid hsl(var(--border))",
              minHeight: 560,
              overflow: "hidden",
            }}
          >
            {/* Estate label */}
            <p
              className="kicker"
              style={{ position: "absolute", top: 16, left: 20, color: "hsl(var(--burg) / 0.6)" }}
            >
              Villa Grabau Estate
            </p>

            {/* Property markers */}
            {ACCOMMODATIONS.map((acc) => {
              const { filled, total } = propertyCount(acc);
              const pct = total ? Math.round((filled / total) * 100) : 0;
              const isOpen = openAccId === acc.id;
              if (acc.venueOnly) {
                return (
                  <div
                    key={acc.id}
                    style={{
                      position: "absolute",
                      top: `${acc.map.top}%`,
                      left: `${acc.map.left}%`,
                      transform: "translate(-50%, -50%)",
                      background: "hsl(var(--gold) / 0.15)",
                      border: "1.5px dashed hsl(var(--gold))",
                      padding: "0.6rem 0.85rem",
                      minWidth: 140,
                      textAlign: "center",
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
                  onClick={() => setOpenAccId(acc.id)}
                  style={{
                    position: "absolute",
                    top: `${acc.map.top}%`,
                    left: `${acc.map.left}%`,
                    transform: "translate(-50%, -50%)",
                    background: isOpen ? "hsl(var(--burg))" : "#FAF8F2",
                    color: isOpen ? "hsl(var(--cream))" : "hsl(var(--burg))",
                    border: "1px solid hsl(var(--burg) / 0.4)",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                    padding: "0.6rem 0.85rem",
                    minWidth: 140,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <p
                    className="font-display italic"
                    style={{ fontSize: "0.95rem", lineHeight: 1.1, fontWeight: 500 }}
                  >
                    {acc.name}
                  </p>
                  <p className="kicker" style={{ fontSize: "0.5rem", marginTop: 4, color: isOpen ? "hsl(var(--cream) / 0.8)" : "hsl(var(--gold))" }}>
                    {filled}/{total} beds · {pct}%
                  </p>
                </button>
              );
            })}

            {/* Simple path / compass */}
            <p
              className="kicker"
              style={{
                position: "absolute", bottom: 14, right: 18, fontSize: "0.45rem",
                color: "hsl(var(--stone))", opacity: 0.7,
              }}
            >
              N ↑
            </p>
          </div>

          {/* ─── Guest sidebar ─── */}
          <aside
            style={{
              border: "1px solid hsl(var(--border))",
              background: "#FAF8F2",
              padding: "1rem",
              maxHeight: 560,
              display: "flex",
              flexDirection: "column",
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
                      padding: "0.5rem 0.6rem",
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

        {/* ─── Accommodation detail modal ─── */}
        {openAcc && (
          <div
            onClick={() => { setOpenAccId(null); setPickerFor(null); }}
            style={{
              position: "fixed", inset: 0, zIndex: 70,
              background: "rgba(0,0,0,0.55)",
              display: "flex", alignItems: "flex-start", justifyContent: "center",
              overflowY: "auto", padding: "2rem 1rem",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#FAF8F2", maxWidth: 720, width: "100%",
                border: "1px solid hsl(var(--burg) / 0.3)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.3)",
                padding: "2rem 1.75rem",
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="kicker" style={{ color: "hsl(var(--gold))" }}>{openAcc.subtitle}</p>
                  <p className="font-display italic text-burg" style={{ fontSize: "1.8rem", fontWeight: 300, lineHeight: 1.1 }}>
                    {openAcc.name}
                  </p>
                </div>
                <button onClick={() => setOpenAccId(null)} className="kicker" style={{ color: "hsl(var(--stone))", cursor: "pointer", background: "none", border: "none" }}>
                  Close ✕
                </button>
              </div>
              {openAcc.extraBedCap != null && (
                <p className="font-body text-xs italic text-stone mb-4">
                  Up to {openAcc.extraBedCap} additional beds may be added across this property
                  ({openAcc.rooms.reduce((s, r) => s + (state.extras[r.id]?.length ?? 0), 0)} used).
                </p>
              )}
              <span className="rule mb-5 block" />

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {openAcc.rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    state={state}
                    onPickBed={(bedId) => { setPickerFor({ kind: "bed", id: bedId }); setPickerSearch(""); }}
                    onUnassignBed={(bedId) => assignToBed(bedId, null)}
                    onPickExtra={(extraId) => { setPickerFor({ kind: "extra", id: extraId, roomId: room.id }); setPickerSearch(""); }}
                    onUnassignExtra={(extraId) => assignToExtra(room.id, extraId, null)}
                    onAddExtra={(optId, optLabel) => addExtraBed(openAcc, room, optId, optLabel)}
                    onRemoveExtra={(extraId) => removeExtraBed(room.id, extraId)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Guest picker ─── */}
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
              <p className="kicker mb-3">Assign a guest</p>
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
                          if (pickerFor.kind === "bed") assignToBed(pickerFor.id, g);
                          else if (pickerFor.roomId) assignToExtra(pickerFor.roomId, pickerFor.id, g);
                          setPickerFor(null);
                        }}
                        style={{
                          display: "block", width: "100%", textAlign: "left",
                          padding: "0.6rem 0.75rem", background: "white",
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

/* ──────────── Room card ──────────── */
function RoomCard({
  room, state,
  onPickBed, onUnassignBed,
  onPickExtra, onUnassignExtra,
  onAddExtra, onRemoveExtra,
}: {
  room: RoomDef;
  state: PlacementState;
  onPickBed: (bedId: string) => void;
  onUnassignBed: (bedId: string) => void;
  onPickExtra: (extraId: string) => void;
  onUnassignExtra: (extraId: string) => void;
  onAddExtra: (optId: string, optLabel: string) => void;
  onRemoveExtra: (extraId: string) => void;
}) {
  // Group same-type adjacent beds into descriptive label ("Two single beds" / "Double bed")
  const bedSummary = summarizeBeds(room.beds);
  const extras = state.extras[room.id] ?? [];

  return (
    <div style={{ border: "1px solid hsl(var(--border))", background: "white", padding: "1rem" }}>
      <div className="flex justify-between items-start gap-2 mb-1">
        <p className="font-display italic text-burg" style={{ fontSize: "1.05rem", fontWeight: 500 }}>
          {room.name}
        </p>
        <p className="kicker" style={{ color: "hsl(var(--gold))", fontSize: "0.45rem" }}>
          {bedSummary}
        </p>
      </div>
      {room.note && (
        <p className="font-body italic text-xs text-stone mb-3">{room.note}</p>
      )}

      {/* Bed slots */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {room.beds.map((bed) => {
          const placement = state.beds[bed.id];
          return (
            <BedRow
              key={bed.id}
              label={bed.label}
              placement={placement}
              onPick={() => onPickBed(bed.id)}
              onUnassign={() => onUnassignBed(bed.id)}
            />
          );
        })}

        {extras.map((extra) => (
          <BedRow
            key={extra.id}
            label={`+ ${extra.label}`}
            placement={extra.placement}
            onPick={() => onPickExtra(extra.id)}
            onUnassign={() => onUnassignExtra(extra.id)}
            onRemoveSlot={() => onRemoveExtra(extra.id)}
            isExtra
          />
        ))}
      </div>

      {/* Sidebar add-extra options */}
      {room.allowedExtras && room.allowedExtras.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {room.allowedExtras.map((opt, idx) => (
            <button
              key={`${opt.id}-${idx}`}
              onClick={() => onAddExtra(opt.id, opt.label)}
              className="kicker"
              style={{
                padding: "0.35rem 0.65rem",
                border: "1px dashed hsl(var(--burg) / 0.4)",
                background: "transparent",
                color: "hsl(var(--burg))", cursor: "pointer",
                fontSize: "0.5rem",
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
  label, placement, onPick, onUnassign, onRemoveSlot, isExtra,
}: {
  label: string;
  placement: Placement | null | undefined;
  onPick: () => void;
  onUnassign: () => void;
  onRemoveSlot?: () => void;
  isExtra?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
        padding: "0.5rem 0.65rem",
        background: placement ? "hsl(var(--burg-pale))" : (isExtra ? "hsl(42 30% 96%)" : "hsl(42 25% 95%)"),
        border: `1px ${isExtra ? "dashed" : "solid"} hsl(var(--border))`,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span className="font-body text-sm" style={{ color: "hsl(var(--ink))" }}>{label}</span>
        {placement ? (
          <span className="font-display italic" style={{ fontSize: "0.95rem", color: "hsl(var(--burg))" }}>
            {placement.guestName}
          </span>
        ) : (
          <span className="font-body italic text-xs text-stone">Unassigned</span>
        )}
      </div>
      <div className="flex gap-2">
        {placement && (
          <button onClick={onUnassign} className="kicker" style={{ background: "none", border: "none", color: "hsl(var(--stone))", cursor: "pointer", fontSize: "0.5rem" }}>
            Remove
          </button>
        )}
        <button
          onClick={onPick}
          className="kicker"
          style={{
            padding: "0.35rem 0.7rem", cursor: "pointer", fontSize: "0.5rem",
            background: placement ? "transparent" : "hsl(var(--burg))",
            color: placement ? "hsl(var(--burg))" : "hsl(var(--cream))",
            border: "1px solid hsl(var(--burg))",
          }}
        >
          {placement ? "Change" : "Assign"}
        </button>
        {isExtra && onRemoveSlot && (
          <button onClick={onRemoveSlot} className="kicker" title="Remove this extra bed" style={{ background: "none", border: "none", color: "hsl(0 50% 45%)", cursor: "pointer", fontSize: "0.5rem" }}>
            ✕
          </button>
        )}
      </div>
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
  if (doubles >= 1) parts.push(doubles === 1 ? "Double bed" : `${doubles} double beds`);
  if (queens >= 1) parts.push(queens === 1 ? "Queen bed" : `${queens} queen beds`);
  return parts.join(" · ");
}