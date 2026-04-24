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
      "Welcome to Tuscany. Today is yours — settle into your villa, breathe the warm evening air, and let the anticipation build. The ancient walled city of Lucca is steps away, perfect for an evening stroll and your first Italian dinner.",
    activities: [
      { title: "Check in",          note: "Villas available from 3:00 PM · come find us when you arrive" },
      { title: "Piazza Anfiteatro",  note: "The old Roman amphitheatre — perfect for an aperitivo as the evening begins" },
      { title: "Dinner in Lucca",     note: "We recommend Osteria Da Rosolo or Giglio — both within the walls, both unforgettable" },
    ],
  },
  20: {
    heading: "Welcome Party",
    time: "7:00 PM · L'Arancera",
    attire: "Cocktail attire",
    description:
      "This evening we gather for the first time as a group — cocktails, laughter, and the Tuscan night. Join us at L'Arancera for a welcome party that sets the tone for the week ahead. Please don't be late.",
    activities: [
      { title: "Free daytime",   note: "A perfect morning for Lucca's markets or a day trip to Pisa" },
      { title: "Welcome Party",  note: "7:00 PM at L'Arancera · cocktail attire · we can't wait to see you" },
      { title: "Torre Guinigi",  note: "Climb the medieval tower with oak trees growing from the top — breathtaking views" },
    ],
  },
  21: {
    heading: "Rehearsal Dinner",
    time: "7:30 PM · Invitation Only",
    attire: "Smart casual",
    description:
      "The rehearsal dinner is for invited guests only — separate details will be shared with those attending. For all other guests, today is a free day to explore Tuscany at your leisure. Lucca and the surrounding countryside have endless things to offer.",
    activities: [
      { title: "Day trip to Pisa",    note: "Just 30 minutes away — the Leaning Tower and the stunning Piazza dei Miracoli" },
      { title: "Lucca cycling",       note: "Rent bikes and ride the tree-lined ramparts atop the ancient city walls" },
      { title: "Terme di Saturnia",   note: "Natural hot springs, about 1.5 hours south — a perfect day of relaxation" },
    ],
  },
  22: {
    heading: "The Wedding",
    time: "Ceremony at 4:00 PM · Villa Grabau",
    attire: "Garden Party Formal",
    description:
      "The day we have been looking forward to. Please arrive by 3:45 PM to be seated before the ceremony begins. Dinner and dancing follow late into the Tuscan evening — dress as though the setting deserves it.",
    activities: [
      { title: "Arrive by 3:45 PM",  note: "Guests seated from 3:30 PM · ceremony begins at 4:00 PM sharp" },
      { title: "Cocktail hour",      note: "Garden Terrace · 6:15 PM" },
      { title: "Dinner & Dancing",   note: "Grand Hall · from 7:30 PM · last dance at midnight" },
    ],
  },
  23: {
    heading: "Free Day",
    description:
      "A beautiful, unscheduled day in Tuscany. Explore wherever the morning takes you — whether that means sleeping in at the villa, heading to Cinque Terre, or wandering the streets of Florence.",
    activities: [
      { title: "Florence",      note: "1.5 hours east — the Uffizi, the Duomo, the Ponte Vecchio, world-class food" },
      { title: "Cinque Terre",  note: "1.5 hours northwest — five cliffside villages and the most beautiful coastline in Italy" },
      { title: "Lucca markets", note: "The city's antique market fills Piazza Anfiteatro on the third weekend of each month" },
    ],
  },
  24: {
    heading: "Depart or Linger",
    description:
      "Some of you head home today; others may choose to stay a little longer. If this is your last morning, take a slow breakfast at the villa and savour every last moment of Tuscany.",
    activities: [
      { title: "Last Lucca morning",  note: "Pastries and espresso in the city before heading to the airport" },
      { title: "Pisa Airport",        note: "PSA is 45 minutes from the villa · allow extra time" },
      { title: "Extend your trip",    note: "Florence and the Amalfi Coast are perfect next stops — ask us for tips" },
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
