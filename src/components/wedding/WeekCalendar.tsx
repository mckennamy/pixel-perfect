import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const CALENDAR_H = 60; // px — sync with CSS below

const days = [
  { date: 19, day: "Mon", event: "Arrive",           type: "travel"   },
  { date: 20, day: "Tue", event: "Welcome Party",    type: "event"    },
  { date: 21, day: "Wed", event: "Rehearsal Dinner", type: "private"  },
  { date: 22, day: "Thu", event: "Ceremony · 4 PM",  type: "wedding"  },
  { date: 23, day: "Fri", event: "Free Day",          type: "free"     },
  { date: 24, day: "Sat", event: "Depart",            type: "travel"   },
  { date: 25, day: "Sun", event: "Depart",            type: "travel"   },
];

// Routes that should NOT show the calendar
const EXCLUDED = new Set(["/", "/our-story"]);

export default function WeekCalendar() {
  const { pathname } = useLocation();
  const show = !EXCLUDED.has(pathname);

  // Adjust page-wrapper padding-top so content isn't hidden behind calendar
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--calendar-height", show ? `${CALENDAR_H}px` : "0px");
    return () => root.style.setProperty("--calendar-height", "0px");
  }, [show]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 64, // below navbar (h-16 = 64px)
        left: 0,
        right: 0,
        height: CALENDAR_H,
        zIndex: 45,
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        background: "hsl(350, 78%, 10%)",
        borderBottom: "1px solid rgba(184,154,106,0.12)",
      }}
    >
      {days.map((d) => {
        const isWedding = d.type === "wedding";
        const isEvent   = d.type === "event";

        return (
          <div
            key={d.date}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              borderRight: "1px solid rgba(255,255,255,0.05)",
              borderTop: isWedding
                ? "2px solid hsl(var(--chart-mid))"
                : isEvent
                ? "2px solid rgba(184,154,106,0.5)"
                : "2px solid transparent",
              padding: "6px 2px",
            }}
          >
            <span
              style={{
                fontFamily: "Cinzel, serif",
                fontSize: "0.42rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: isWedding ? "hsl(var(--chart-mid))" : "rgba(250,248,242,0.28)",
              }}
            >
              {d.day}
            </span>
            <span
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(0.9rem, 2vw, 1.15rem)",
                fontWeight: 300,
                lineHeight: 1,
                color: isWedding ? "hsl(var(--chart-mid))" : "rgba(250,248,242,0.75)",
              }}
            >
              {d.date}
            </span>
            <span
              style={{
                fontFamily: "Cinzel, serif",
                fontSize: "clamp(0.35rem, 0.8vw, 0.48rem)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                textAlign: "center",
                color: isWedding
                  ? "rgba(138,158,20,0.9)"
                  : isEvent
                  ? "rgba(184,154,106,0.7)"
                  : "rgba(250,248,242,0.28)",
                lineHeight: 1.2,
              }}
            >
              {d.event}
            </span>
          </div>
        );
      })}
    </div>
  );
}
