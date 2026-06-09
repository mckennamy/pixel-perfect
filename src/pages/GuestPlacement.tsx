import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ACCOMMODATIONS, AccommodationDef, BedSlot, BedType, ExtraType, RoomDef } from "@/lib/accommodations";
import { loadEdit, saveEdit } from "@/lib/siteEdits";
import { toast } from "sonner";

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
    try { await saveEdit(STORAGE_ID, JSON.stringify(next)); }
    catch { toast.error("Could not save placement"); }
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

