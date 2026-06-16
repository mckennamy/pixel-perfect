import { days, details, typeStyles } from "@/components/wedding/WeekCalendar";
import EditableText from "@/components/wedding/EditableText";

export default function MasterCalendar() {
  return (
    <main
      style={{
        paddingTop: "calc(var(--calendar-height, 0px) + 2rem)",
        paddingBottom: "5rem",
        background: "hsl(var(--cream))",
        minHeight: "100vh",
      }}
    >
      {/* Page header */}
      <header
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "2rem clamp(1.5rem, 6vw, 4rem) 3rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: "0.55rem",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "hsl(var(--burg) / 0.65)",
            marginBottom: "1rem",
          }}
        >
          Il Calendario
        </p>
        <h1
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(2.4rem, 6vw, 3.6rem)",
            fontWeight: 300,
            color: "hsl(var(--burg))",
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Master Calendar
        </h1>
        <div style={{ width: 36, height: 1, background: "hsl(var(--gold))", opacity: 0.6, margin: "1.5rem auto" }} />
        <p
          style={{
            fontFamily: "EB Garamond, serif",
            fontStyle: "italic",
            fontSize: "1rem",
            color: "hsl(var(--ink))",
            opacity: 0.7,
            lineHeight: 1.7,
          }}
        >
          The full week, day by day. Scroll through from arrival to arrivederci.
        </p>
      </header>

      {/* Day sections */}
      {days.map((d) => {
        const detail = details[d.date];
        const s = typeStyles[d.type];
        if (!detail) return null;
        return (
          <section
            key={d.date}
            style={{
              background: s.overlayBg,
              color: s.text,
              padding: "3.5rem clamp(1.5rem, 6vw, 4rem)",
              borderTop: `1px solid ${s.accent}33`,
            }}
          >
            <div style={{ maxWidth: 640, margin: "0 auto" }}>
              {/* Day label */}
              <p
                style={{
                  fontFamily: "Cinzel, serif",
                  fontSize: "0.52rem",
                  letterSpacing: "0.42em",
                  textTransform: "uppercase",
                  color: s.accent,
                  marginBottom: "0.5rem",
                  opacity: 0.85,
                }}
              >
                {d.day} · May 2027
              </p>

              {/* Giant date */}
              <p
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "clamp(4.5rem, 14vw, 8rem)",
                  fontWeight: 300,
                  lineHeight: 0.9,
                  color: s.text,
                  marginBottom: "0.75rem",
                }}
              >
                {d.date}
              </p>

              {/* Heading */}
              <EditableText
                id={`cal-${d.date}-heading`}
                tag="p"
                defaultContent={detail.heading}
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
                  fontWeight: 300,
                  color: s.text,
                  opacity: 0.85,
                  marginBottom: detail.time ? "0.5rem" : "1.25rem",
                }}
              />

              {detail.time && (
                <EditableText
                  id={`cal-${d.date}-time`}
                  tag="p"
                  defaultContent={detail.time}
                  style={{
                    fontFamily: "Cinzel, serif",
                    fontSize: "0.55rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: s.accent,
                    marginBottom: "0.2rem",
                  }}
                />
              )}
              {detail.attire && (
                <EditableText
                  id={`cal-${d.date}-attire`}
                  tag="p"
                  defaultContent={`Attire: ${detail.attire}`}
                  style={{
                    fontFamily: "EB Garamond, serif",
                    fontStyle: "italic",
                    fontSize: "0.875rem",
                    color: s.text,
                    opacity: 0.55,
                    marginBottom: "1.25rem",
                  }}
                />
              )}

              <div style={{ width: 36, height: 1, background: s.accent, opacity: 0.45, marginBottom: "1.25rem" }} />

              <EditableText
                id={`cal-${d.date}-desc`}
                tag="p"
                defaultContent={detail.description}
                style={{
                  fontFamily: "EB Garamond, serif",
                  fontSize: "1.05rem",
                  lineHeight: 1.85,
                  color: s.text,
                  opacity: 0.8,
                  marginBottom: "2rem",
                }}
              />

              <div>
                {detail.activities.map((a, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1.6fr",
                      gap: "1rem",
                      borderTop: `1px solid ${s.accent}28`,
                      paddingTop: "0.9rem",
                      paddingBottom: "0.9rem",
                    }}
                  >
                    <EditableText
                      id={`cal-${d.date}-act-${i}-title`}
                      tag="p"
                      defaultContent={a.title}
                      allowFontResize={false}
                      style={{
                        fontFamily: "Cinzel, serif",
                        fontSize: "0.5rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: s.accent,
                        lineHeight: 1.5,
                      }}
                    />
                    <EditableText
                      id={`cal-${d.date}-act-${i}-note`}
                      tag="p"
                      defaultContent={a.note}
                      allowFontResize={false}
                      style={{
                        fontFamily: "EB Garamond, serif",
                        fontStyle: "italic",
                        fontSize: "0.875rem",
                        color: s.text,
                        opacity: 0.65,
                        lineHeight: 1.6,
                      }}
                    />
                  </div>
                ))}
                <div style={{ borderTop: `1px solid ${s.accent}28` }} />
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}