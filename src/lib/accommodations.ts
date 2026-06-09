// Static accommodation/room structure for the Guest Placement tool.
// Only "real" beds are listed as assignable slots. Sofa beds and folding/
// additional beds live in `sidebarOptions` and can be added per-room.

export type BedType = "double" | "twin" | "queen" | "single";
export type ExtraType = "folding" | "sofa-single" | "sofa-queen" | "extra-single";

export interface BedSlot {
  id: string;
  /** Display label, e.g. "Double bed" or "Two single beds" */
  label: string;
  type: BedType;
}

export interface RoomDef {
  id: string;
  name: string;
  note?: string;
  beds: BedSlot[];
  /** Sidebar add-ons this room supports (folding bed, sofa bed, etc.) */
  allowedExtras?: { id: string; label: string; type: ExtraType }[];
}

export interface AccommodationDef {
  id: string;
  name: string;
  subtitle?: string;
  /** % position on the estate map (0-100) */
  map: { top: number; left: number };
  rooms: RoomDef[];
  /** Max number of *added* extra beds across the property (e.g. farmhouse = 8) */
  extraBedCap?: number;
}

const FOLDING = { id: "folding", label: "Folding bed", type: "folding" as ExtraType };
const SOFA_SINGLE = { id: "sofa-single", label: "Sofa bed (single)", type: "sofa-single" as ExtraType };
const SOFA_QUEEN = { id: "sofa-queen", label: "Sofa bed (queen)", type: "sofa-queen" as ExtraType };
const EXTRA_SINGLE = { id: "extra-single", label: "Additional single bed", type: "extra-single" as ExtraType };

export const ACCOMMODATIONS: AccommodationDef[] = [
  {
    id: "larancera",
    name: "L'Arancera",
    subtitle: "The Farmhouse",
    map: { top: 92, left: 50 },
    extraBedCap: 8,
    rooms: [
      // Apartment 1
      { id: "la-11", name: "Apt 1 · Room 11", note: "14 sqm · garden view", beds: [{ id: "la-11-a", label: "Double bed", type: "double" }] },
      { id: "la-12", name: "Apt 1 · Room 12", note: "15.5 sqm · garden view (twins can join into a double)", beds: [{ id: "la-12-a", label: "Single bed", type: "single" }, { id: "la-12-b", label: "Single bed", type: "single" }], allowedExtras: [FOLDING] },
      { id: "la-14", name: "Apt 1 · Room 14", note: "16.5 sqm · pool view", beds: [{ id: "la-14-a", label: "Double bed", type: "double" }], allowedExtras: [FOLDING] },
      // Apartment 2
      { id: "la-21", name: "Apt 2 · Room 21", note: "15 sqm · ground floor, garden access", beds: [{ id: "la-21-a", label: "Double bed", type: "double" }] },
      { id: "la-22", name: "Apt 2 · Room 22", note: "15.5 sqm · pool view", beds: [{ id: "la-22-a", label: "Double bed", type: "double" }], allowedExtras: [FOLDING] },
      // Apartment 3
      { id: "la-31", name: "Apt 3 · Room 31", note: "14 sqm · queen, pool view", beds: [{ id: "la-31-a", label: "Queen bed", type: "queen" }] },
      { id: "la-32", name: "Apt 3 · Room 32", note: "17 sqm · pool view (twins can join into a double)", beds: [{ id: "la-32-a", label: "Single bed", type: "single" }, { id: "la-32-b", label: "Single bed", type: "single" }], allowedExtras: [FOLDING] },
      // Apartment 4
      { id: "la-41", name: "Apt 4 · Room 41", note: "15.5 sqm · pool view", beds: [{ id: "la-41-a", label: "Double bed", type: "double" }] },
      { id: "la-42", name: "Apt 4 · Room 42", note: "16.5 sqm · pool view (twins can join into a double)", beds: [{ id: "la-42-a", label: "Single bed", type: "single" }, { id: "la-42-b", label: "Single bed", type: "single" }], allowedExtras: [FOLDING] },
      // Apartment 6
      { id: "la-62", name: "Apt 6 · Room 62", note: "14 sqm · ground floor (twins can join into a double)", beds: [{ id: "la-62-a", label: "Single bed", type: "single" }, { id: "la-62-b", label: "Single bed", type: "single" }] },
      { id: "la-63", name: "Apt 6 · Room 63", note: "15.5 sqm · garden view", beds: [{ id: "la-63-a", label: "Double bed", type: "double" }], allowedExtras: [FOLDING] },
      { id: "la-64", name: "Apt 6 · Room 64 (Bridal Suite)", note: "22 sqm suite · sofa converts to queen", beds: [{ id: "la-64-a", label: "Double bed", type: "double" }], allowedExtras: [SOFA_QUEEN] },
    ],
  },
  {
    id: "villa-marlia",
    name: "Villa Marlia",
    subtitle: "Villa Grabau · Main Villa",
    map: { top: 42, left: 62 },
    rooms: [
      { id: "vm-gf-1", name: "Ground · Independent Apt (Double)", note: "Accessible apartment", beds: [{ id: "vm-gf-1-a", label: "Double bed", type: "double" }] },
      { id: "vm-gf-2", name: "Ground · Independent Apt (Twin)", beds: [{ id: "vm-gf-2-a", label: "Single bed", type: "single" }, { id: "vm-gf-2-b", label: "Single bed", type: "single" }] },
      { id: "vm-1-1", name: "1st Floor · Double + Ensuite (bathtub)", beds: [{ id: "vm-1-1-a", label: "Double bed", type: "double" }] },
      { id: "vm-1-2", name: "1st Floor · Twin + Ensuite (shower)", beds: [{ id: "vm-1-2-a", label: "Single bed", type: "single" }, { id: "vm-1-2-b", label: "Single bed", type: "single" }] },
      { id: "vm-1-3", name: "1st Floor · Twin + Ensuite (bathtub)", beds: [{ id: "vm-1-3-a", label: "Single bed", type: "single" }, { id: "vm-1-3-b", label: "Single bed", type: "single" }] },
      { id: "vm-1-4", name: "1st Floor · Double w/ Private Terrace", beds: [{ id: "vm-1-4-a", label: "Double bed", type: "double" }] },
      { id: "vm-1-5", name: "1st Floor · Twin (shared bath)", beds: [{ id: "vm-1-5-a", label: "Single bed", type: "single" }, { id: "vm-1-5-b", label: "Single bed", type: "single" }] },
      { id: "vm-2-1", name: "2nd Floor · Master Suite", note: "Bathroom with hot tub & shower; dressing room", beds: [{ id: "vm-2-1-a", label: "Double bed", type: "double" }] },
    ],
  },
  {
    id: "annadora",
    name: "Casa di Annadora",
    subtitle: "Villa Grabau",
    map: { top: 65, left: 80 },
    rooms: [
      { id: "an-1", name: "Bedroom 1 (double bed)", beds: [{ id: "an-1-a", label: "Double bed", type: "double" }], allowedExtras: [SOFA_SINGLE] },
      { id: "an-2", name: "Bedroom 2 (twin)", beds: [{ id: "an-2-a", label: "Single bed", type: "single" }, { id: "an-2-b", label: "Single bed", type: "single" }] },
      { id: "an-3", name: "Bedroom 3 (twin)", beds: [{ id: "an-3-a", label: "Single bed", type: "single" }, { id: "an-3-b", label: "Single bed", type: "single" }] },
      { id: "an-4", name: "Bedroom 4 (twin)", beds: [{ id: "an-4-a", label: "Single bed", type: "single" }, { id: "an-4-b", label: "Single bed", type: "single" }] },
    ],
  },
  {
    id: "orazio",
    name: "Casa di Orazio",
    subtitle: "Villa Grabau",
    map: { top: 22, left: 90 },
    rooms: [
      { id: "or-1", name: "Bedroom 1 · Four-poster double", beds: [{ id: "or-1-a", label: "Double bed", type: "double" }] },
      { id: "or-2", name: "Bedroom 2 · Double", beds: [{ id: "or-2-a", label: "Double bed", type: "double" }] },
      { id: "or-3", name: "Bedroom 3 · Twin (connects to Bedroom 2)", beds: [{ id: "or-3-a", label: "Single bed", type: "single" }, { id: "or-3-b", label: "Single bed", type: "single" }] },
      { id: "or-4", name: "Bedroom 4 · Twin", beds: [{ id: "or-4-a", label: "Single bed", type: "single" }, { id: "or-4-b", label: "Single bed", type: "single" }] },
      { id: "or-5", name: "Bedroom 5 · Twin", beds: [{ id: "or-5-a", label: "Single bed", type: "single" }, { id: "or-5-b", label: "Single bed", type: "single" }] },
    ],
  },
  {
    id: "stalletta",
    name: "La Stalletta",
    subtitle: "Villa Grabau",
    map: { top: 38, left: 92 },
    rooms: [
      { id: "st-1", name: "Bedroom 1 · Double", beds: [{ id: "st-1-a", label: "Double bed", type: "double" }], allowedExtras: [EXTRA_SINGLE] },
      { id: "st-2", name: "Bedroom 2 · Twin", beds: [{ id: "st-2-a", label: "Single bed", type: "single" }, { id: "st-2-b", label: "Single bed", type: "single" }] },
      { id: "st-living", name: "Living Room (sofa bed)", note: "Up to 2 extra sleeping places on sofa bed", beds: [], allowedExtras: [SOFA_SINGLE, SOFA_SINGLE] },
    ],
  },
  {
    id: "pinino",
    name: "Villa Pinino",
    subtitle: "New addition · across from L'Arancera",
    map: { top: 8, left: 10 },
    rooms: [
      // Placeholder — update once room layout is provided
      { id: "pn-1", name: "Bedroom 1 (TBD)", note: "Room layout to be confirmed", beds: [{ id: "pn-1-a", label: "Double bed", type: "double" }] },
      { id: "pn-2", name: "Bedroom 2 (TBD)", note: "Room layout to be confirmed", beds: [{ id: "pn-2-a", label: "Double bed", type: "double" }] },
      { id: "pn-3", name: "Bedroom 3 (TBD)", note: "Room layout to be confirmed", beds: [{ id: "pn-3-a", label: "Single bed", type: "single" }, { id: "pn-3-b", label: "Single bed", type: "single" }] },
    ],
  },
];

export function getAccommodation(id: string): AccommodationDef | undefined {
  return ACCOMMODATIONS.find((a) => a.id === id);
}