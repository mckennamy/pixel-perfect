import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import EditableText from "@/components/wedding/EditableText";

const CALENDAR_H = 68;

type DayType = "travel" | "event" | "private" | "wedding" | "free";

interface DayInfo {
  date: number;
  day: string;
  event: string;
  type: DayType;
}

interface DayDetail {
  heading: string;
  time?: string;
  attire?: string;
  description: string;
  activities: { title: string; note: string }[];
}

const days: DayInfo[] = [
  { date: 19, day: "Wed", event: "Arrive",           type: "travel"  },
  { date: 20, day: "Thu", event: "Welcome Party",    type: "event"   },
  { date: 21, day: "Fri", event: "Rehearsal Dinner", type: "private" },
  { date: 22, day: "Sat", event: "Ceremony · 4 PM",  type: "wedding" },
  { date: 23, day: "Sun", event: "Free Day",         type: "free"    },
  { date: 24, day: "Mon", event: "Depart",           type: "travel"  },
];

const details: Record<number, DayDetail> = {
  19: {
    heading: "Arrive in Lucca",
    description:
      "Welcome to Tuscany. Check in begins at 3:00 PM — come find us when you arrive, settle in, and let the week begin.",
    activities: [
      { title: "Breakfast", note: "On your own — travel day" },
      { title: "Lunch",     note: "On your own en route — check in opens at 3:00 PM" },
      { title: "Dinner",    note: "On your own · aperitivo at Piazza dell'Anfiteatro, then Osteria Da Rosolo or Giglio in Lucca" },
    ],
  },
  20: {
    heading: "Welcome Party",
    time: "6:00 PM · L'Arancera",
    attire: "Cocktail attire",
    description:
      "Spend the day exploring Lucca, heading into the countryside, or relaxing on the property. In the evening we gather as a group for the first time at our welcome party at L'Arancera.",
    activities: [
      { title: "Breakfast", note: "Served at L'Arancera · 90-minute buffet with sweet and savoury options · plant-based milk available" },
      { title: "Lunch",     note: "On your own · relax at the property, try a massage, a wine tasting, or a cooking class — see the Excursions page" },
      { title: "Dinner",    note: "Welcome Party at L'Arancera · guests arrive 6:00 PM · food service from 6:30 PM · sunset 8:40 PM · ends 9:00–9:30 PM" },
    ],
  },
  21: {
    heading: "Free Day",
    time: "Rehearsal dinner — invitation only",
    attire: "",
    description:
      "Today is yours. Explore Pisa, the Tuscan coast, the surrounding hills, or simply relax by one of our two pools at Villa Grabau or L'Arancera. Guests invited to the rehearsal dinner will find full details on their private invitation page.",
    activities: [
      { title: "Breakfast", note: "On your own" },
      { title: "Lunch",     note: "On your own · explore Pisa, the coast, or stay by the pool" },
      { title: "Dinner",    note: "On your own · rehearsal dinner guests — see your private invitation page" },
    ],
  },
  22: {
    heading: "The Wedding",
    time: "Ceremony at 4:00 PM · Villa Grabau",
    attire: "Garden Party Formal",
    description:
      "The day we have been looking forward to. We gather for the ceremony at 4:00 PM, followed by reception and dancing late into the Tuscan evening.",
    activities: [
      { title: "Breakfast", note: "On your own" },
      { title: "Lunch",     note: "Provided for all guests at the property before the ceremony — details to come" },
      { title: "Dinner",    note: "Reception dinner at Villa Grabau · cocktails, dinner, and dancing into the night" },
    ],
  },
  23: {
    heading: "Brunch & Departures",
    description:
      "Some of you head off to your next adventure today; for those staying, it's the last night — spend the afternoon exploring or join us at L'Arancera for a relaxed pool party.",
    activities: [
      { title: "Brunch",  note: "Late brunch served at L'Arancera for all guests — same beloved buffet as the welcome breakfast" },
      { title: "Lunch",   note: "On your own · pool party at L'Arancera, or wander Lucca, Florence, or the coast" },
      { title: "Dinner",  note: "On your own for those staying — a quiet last night in Tuscany" },
    ],
  },
  24: {
    heading: "Arrivederci",
    description:
      "Departure day for all. Thank you, from the bottom of our hearts, for making the journey to share this week with us — we hope it's a trip you'll never forget. If you're extending your time in Italy, we have a few favourite next stops to recommend.",
    activities: [
      { title: "Florence",           note: "An easy 1.5 hours east — Uffizi, Duomo, Ponte Vecchio, perfect for a few extra days" },
      { title: "Cinque Terre",       note: "1.5 hours northwest — five cliffside villages and the most beautiful coastline in Italy" },
      { title: "Rome or the Amalfi Coast", note: "A few hours south by train — the perfect grand finale to your Italian trip" },
    ],
  },
  25: {
    heading: "Final Departures",
    description:
      "The last goodbyes. Safe travels to everyone heading home today — and thank you, from the bottom of our hearts, for sharing this week with us.",
    activities: [
      { title: "Final breakfast",   note: "Coffee and pastries ready for early departures from the villa" },
      { title: "Pisa Airport",      note: "PSA · 45 minutes from the villa" },
      { title: "Florence Airport",  note: "FLR · 90 minutes for those with later international flights" },
    ],
  },
};

// Colour scheme matching the Travel page calendar
const typeStyles: Record<DayType, { bg: string; text: string; accent: string; border: string; overlayBg: string }> = {
  travel:  {
    bg: "hsl(var(--border))",
    text: "hsl(var(--ink))",
    accent: "hsl(var(--stone))",
    border: "rgba(0,0,0,0.15)",
    overlayBg: "hsl(var(--cream))",
  },
  event:   {
    bg: "hsl(var(--moss))",
    text: "hsl(var(--cream))",
    accent: "hsl(var(--chart-mid))",
    border: "hsl(var(--chart))",
    overlayBg: "hsl(var(--moss))",
  },
  private: {
    bg: "hsl(var(--burg-pale))",
    text: "hsl(var(--burg))",
    accent: "hsl(var(--burg-mid))",
    border: "hsl(var(--burg-light))",
    overlayBg: "hsl(var(--burg-pale))",
  },
  wedding: {
    bg: "hsl(var(--burg))",
    text: "hsl(var(--cream))",
    accent: "hsl(var(--gold-light))",
    border: "hsl(var(--gold))",
    overlayBg: "hsl(var(--burg))",
  },
  free:    {
    bg: "hsl(var(--chart-pale))",
    text: "hsl(var(--ink))",
    accent: "hsl(var(--chart))",
    border: "hsl(var(--chart-mid))",
    overlayBg: "hsl(var(--chart-pale))",
  },
};

const EXCLUDED = new Set(["/"]);

export default function WeekCalendar() {
  const { pathname } = useLocation();
  const show = !EXCLUDED.has(pathname);
  const [selected, setSelected] = useState<number | null>(null);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const on  = () => setNavOpen(true);
    const off = () => setNavOpen(false);
    document.addEventListener("bb:nav:open",  on  as EventListener);
    document.addEventListener("bb:nav:close", off as EventListener);
    return () => {
      document.removeEventListener("bb:nav:open",  on  as EventListener);
      document.removeEventListener("bb:nav:close", off as EventListener);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--calendar-height", show ? `${CALENDAR_H}px` : "0px");
    return () => root.style.setProperty("--calendar-height", "0px");
  }, [show]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  if (!show || navOpen) return null;

  const selDay    = selected != null ? days.find(d => d.date === selected) ?? null : null;
  const selDetail = selected != null ? details[selected] ?? null : null;
  const selStyle  = selDay ? typeStyles[selDay.type] : null;

  return (
    <>
      {/* ── Sticky calendar bar ── */}
      <div
        style={{
          position: "fixed",
          top: 64,
          left: 0,
          right: 0,
          height: CALENDAR_H,
          zIndex: 45,
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}
      >
        {days.map((d) => {
          const s = typeStyles[d.type];
          return (
            <button
              key={d.date}
              onClick={() => setSelected(d.date)}
              title={`May ${d.date} — ${d.event}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                background: s.bg,
                color: s.text,
                border: "none",
                borderRight: "1px solid rgba(0,0,0,0.06)",
                borderBottom: `2px solid ${s.border}`,
                padding: "4px 2px",
                cursor: "pointer",
                transition: "filter 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.filter = "brightness(0.9)"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.filter = "none"}
            >
              <span
                style={{
                  fontFamily: "Cinzel, serif",
                  fontSize: "0.5rem",
                  letterSpacing: "0.28em",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  opacity: 0.95,
                }}
              >
                {d.day}
              </span>
              <span
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "clamp(0.95rem, 2vw, 1.25rem)",
                  fontWeight: 300,
                  lineHeight: 1,
                }}
              >
                {d.date}
              </span>
              <span
                style={{
                  fontFamily: "Cinzel, serif",
                  fontSize: "clamp(0.42rem, 0.85vw, 0.56rem)",
                  letterSpacing: "0.14em",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  textAlign: "center",
                  lineHeight: 1.2,
                  opacity: 1,
                }}
              >
                {d.event}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Day detail overlay ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 60,
          transform: selected != null ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.65s cubic-bezier(0.16,1,0.3,1)",
          pointerEvents: selected != null ? "auto" : "none",
          background: selStyle?.overlayBg ?? "hsl(var(--cream))",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {selDay && selDetail && selStyle && (
          <>
            {/* Top bar: back + prev/next */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.25rem 2rem",
                borderBottom: `1px solid ${selStyle.accent}22`,
              }}
            >
              <button
                onClick={() => setSelected(null)}
                style={{
                  fontFamily: "Cinzel, serif",
                  fontSize: "0.52rem",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: selStyle.accent,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
              <div style={{ display: "flex", gap: "1.5rem" }}>
                {selDay.date > 19 && (
                  <button
                    onClick={() => setSelected(selDay.date - 1)}
                    style={{ fontFamily: "Cinzel, serif", fontSize: "0.48rem", letterSpacing: "0.2em", color: selStyle.text, background: "transparent", border: "none", cursor: "pointer", opacity: 0.5 }}
                  >
                    ← Prev
                  </button>
                )}
                {selDay.date < 24 && (
                  <button
                    onClick={() => setSelected(selDay.date + 1)}
                    style={{ fontFamily: "Cinzel, serif", fontSize: "0.48rem", letterSpacing: "0.2em", color: selStyle.text, background: "transparent", border: "none", cursor: "pointer", opacity: 0.5 }}
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>

            {/* Main content */}
            <div
              style={{
                flex: 1,
                maxWidth: 640,
                margin: "0 auto",
                width: "100%",
                padding: "2.5rem clamp(1.5rem, 6vw, 4rem)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {/* Day label */}
              <p
                style={{
                  fontFamily: "Cinzel, serif",
                  fontSize: "0.52rem",
                  letterSpacing: "0.42em",
                  textTransform: "uppercase",
                  color: selStyle.accent,
                  marginBottom: "0.5rem",
                  opacity: 0.85,
                }}
              >
                {selDay.day} · May 2027
              </p>

              {/* Giant date number */}
              <p
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "clamp(5rem, 18vw, 9rem)",
                  fontWeight: 300,
                  lineHeight: 0.9,
                  color: selStyle.text,
                  marginBottom: "0.75rem",
                }}
              >
                {selDay.date}
              </p>

              {/* Heading */}
              <EditableText
                id={`cal-${selDay.date}-heading`}
                tag="p"
                defaultContent={selDetail.heading}
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
                  fontWeight: 300,
                  color: selStyle.text,
                  opacity: 0.85,
                  marginBottom: selDetail.time ? "0.5rem" : "1.25rem",
                }}
              />

              {/* Time + attire */}
              {selDetail.time && (
                <EditableText
                  id={`cal-${selDay.date}-time`}
                  tag="p"
                  defaultContent={selDetail.time}
                  style={{
                    fontFamily: "Cinzel, serif",
                    fontSize: "0.55rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: selStyle.accent,
                    marginBottom: "0.2rem",
                  }}
                />
              )}
              {selDetail.attire && (
                <EditableText
                  id={`cal-${selDay.date}-attire`}
                  tag="p"
                  defaultContent={`Attire: ${selDetail.attire}`}
                  style={{
                    fontFamily: "EB Garamond, serif",
                    fontStyle: "italic",
                    fontSize: "0.875rem",
                    color: selStyle.text,
                    opacity: 0.55,
                    marginBottom: "1.25rem",
                  }}
                />
              )}

              {/* Rule */}
              <div style={{ width: 36, height: 1, background: selStyle.accent, opacity: 0.45, marginBottom: "1.25rem" }} />

              {/* Description */}
              <EditableText
                id={`cal-${selDay.date}-desc`}
                tag="p"
                defaultContent={selDetail.description}
                style={{
                  fontFamily: "EB Garamond, serif",
                  fontSize: "1.05rem",
                  lineHeight: 1.85,
                  color: selStyle.text,
                  opacity: 0.8,
                  marginBottom: "2rem",
                }}
              />

              {/* Activities */}
              <div>
                {selDetail.activities.map((a, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1.6fr",
                      gap: "1rem",
                      borderTop: `1px solid ${selStyle.accent}28`,
                      paddingTop: "0.9rem",
                      paddingBottom: "0.9rem",
                    }}
                  >
                    <EditableText
                      id={`cal-${selDay.date}-act-${i}-title`}
                      tag="p"
                      defaultContent={a.title}
                      style={{
                        fontFamily: "Cinzel, serif",
                        fontSize: "0.5rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: selStyle.accent,
                        lineHeight: 1.5,
                      }}
                    />
                    <EditableText
                      id={`cal-${selDay.date}-act-${i}-note`}
                      tag="p"
                      defaultContent={a.note}
                      style={{
                        fontFamily: "EB Garamond, serif",
                        fontStyle: "italic",
                        fontSize: "0.875rem",
                        color: selStyle.text,
                        opacity: 0.65,
                        lineHeight: 1.6,
                      }}
                    />
                  </div>
                ))}
                <div style={{ borderTop: `1px solid ${selStyle.accent}28` }} />
              </div>
            </div>

            {/* Bottom mini-calendar navigator */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                borderTop: `1px solid ${selStyle.accent}22`,
              }}
            >
              {days.map((d) => {
                const isActive = d.date === selDay.date;
                return (
                  <button
                    key={d.date}
                    onClick={() => setSelected(d.date)}
                    style={{
                      padding: "0.85rem 0.25rem",
                      background: isActive ? `${selStyle.accent}22` : "transparent",
                      border: "none",
                      borderRight: `1px solid ${selStyle.accent}18`,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 3,
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={e => {
                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = `${selStyle.accent}12`;
                    }}
                    onMouseLeave={e => {
                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Cinzel, serif",
                        fontSize: "0.38rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: selStyle.text,
                        opacity: 0.4,
                      }}
                    >
                      {d.day}
                    </span>
                    <span
                      style={{
                        fontFamily: "Cormorant Garamond, Georgia, serif",
                        fontStyle: "italic",
                        fontSize: "1.1rem",
                        fontWeight: 300,
                        color: isActive ? selStyle.accent : selStyle.text,
                        opacity: isActive ? 1 : 0.45,
                        lineHeight: 1,
                      }}
                    >
                      {d.date}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
