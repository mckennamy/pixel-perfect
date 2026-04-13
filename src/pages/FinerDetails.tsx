import { useEffect, useRef } from "react";
import EditableText from "@/components/wedding/EditableText";
import PhotoPlaceholder from "@/components/wedding/PhotoPlaceholder";

const weddingColors = [
  { name: "Deep Burgundy",  hex: "#3D0D14", textColor: "rgba(250,248,242,0.8)", note: "Primary — our richest tone"        },
  { name: "Moss Green",     hex: "#1A2A1E", textColor: "rgba(250,248,242,0.8)", note: "Deep and verdant"                  },
  { name: "Chartreuse",     hex: "#8A9E14", textColor: "rgba(10,14,10,0.7)",    note: "Sparingly as an accent"            },
  { name: "Warm Cream",     hex: "#FAF8F2", textColor: "rgba(60,40,30,0.55)",   note: "Linens, stationery, soft tones"    },
  { name: "Antique Gold",   hex: "#B89A6A", textColor: "rgba(10,8,5,0.65)",     note: "Ornamental details throughout"     },
];

const flowers = [
  { name: "Anthuriums",   note: "Bold, sculptural blooms in deep burgundy and oxblood" },
  { name: "Calla Lilies", note: "Elegant and architectural in ivory and cream" },
  { name: "Moss",         note: "Lush texture throughout every arrangement and tablescape" },
];

const weddingTimeline = [
  { time: "4:00 PM",  event: "Guests Arrive",            location: "Villa Grabau Gardens" },
  { time: "4:30 PM",  event: "Cocktail Hour Begins",      location: "Garden Terrace"       },
  { time: "5:30 PM",  event: "Ceremony",                  location: "Garden Lawn"          },
  { time: "6:15 PM",  event: "Champagne & Passed Bites", location: "Terrace"              },
  { time: "7:30 PM",  event: "Dinner",                    location: "Grand Hall"           },
  { time: "9:00 PM",  event: "First Dance & Toasts",      location: "Grand Hall"           },
  { time: "9:30 PM",  event: "Dancing",                   location: "Grand Hall"           },
  { time: "12:00 AM", event: "Last Dance",                location: "Grand Hall"           },
  { time: "12:30 AM", event: "Late Bites & Send-Off",     location: "Courtyard"            },
];

const weekEvents = [
  { date: "May 20 · Tuesday",    event: "Welcome Party",               time: "7:00 PM",  location: "L'Arancera",    note: "Cocktail attire. An evening to gather and celebrate." },
  { date: "May 21 · Wednesday",  event: "Rehearsal Dinner",            time: "7:30 PM",  location: "Invitation Only",note: "Invited guests will receive a separate communication." },
  { date: "May 22 · Thursday",   event: "Wedding Ceremony & Reception",time: "4:00 PM",  location: "Villa Grabau",  note: "Garden Party Formal attire." },
];

export default function FinerDetails() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (e) => e.forEach((en) => en.isIntersecting && en.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="page-wrapper" ref={ref}>
      {/* Hero */}
      <header className="pt-28 pb-20 text-center px-6">
        <p className="kicker mb-5">Everything You Need to Know</p>
        <h1
          className="font-display italic text-burg leading-none mb-8"
          style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 300 }}
        >
          Finer Details
        </h1>
        <span className="rule" />
      </header>

      {/* Hero photo */}
      <div className="px-6 md:px-16 mb-24 reveal">
        <PhotoPlaceholder id="finer-details-hero" aspect="wide" caption="Villa Grabau" />
      </div>

      {/* Dress Code */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 mb-24">
        <div className="reveal mb-10">
          <p className="kicker mb-4">What to Wear</p>
          <h2 className="font-display italic text-burg" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}>
            Dress Code
          </h2>
        </div>

        <div className="space-y-6 reveal">
          <div className="rule-full" />
          <div className="grid md:grid-cols-3 gap-1">
            <p className="kicker text-stone pb-2 md:pb-0">The Occasion</p>
            <div className="md:col-span-2">
              <p className="font-display italic text-burg text-2xl mb-2">Garden Party Formal</p>
              <EditableText
                id="dress-occasion-body"
                tag="p"
                className="font-body text-sm text-ink-mid leading-relaxed"
                defaultContent="Elevated and romantic. We are celebrating in one of the most beautiful places on earth — dress as though the setting deserves it."
              />
            </div>
          </div>
          <div className="rule-full" />
          <div className="grid md:grid-cols-3 gap-1">
            <p className="kicker text-stone pb-2 md:pb-0">For Her</p>
            <EditableText
              id="dress-her"
              tag="p"
              className="font-body text-sm text-ink-mid leading-relaxed md:col-span-2"
              defaultContent="Floor-length gowns, elegant midi dresses, or dressy jumpsuits. Rich jewel tones, earth tones, and neutrals are all beautiful. Please avoid white and ivory, which are reserved for the bride."
            />
          </div>
          <div className="rule-full" />
          <div className="grid md:grid-cols-3 gap-1">
            <p className="kicker text-stone pb-2 md:pb-0">For Him</p>
            <EditableText
              id="dress-him"
              tag="p"
              className="font-body text-sm text-ink-mid leading-relaxed md:col-span-2"
              defaultContent="Suits or sport coats with dress trousers. A tie is encouraged but not required. Given the warm Italian May evenings, linen is entirely welcome."
            />
          </div>
          <div className="rule-full" />
        </div>
      </section>

      {/* ── Colour palette — elevated swatch card ── */}
      <section className="py-20 px-6 md:px-10" style={{ background: "hsl(var(--parchment))" }}>
        <div className="max-w-3xl mx-auto">
          <div className="reveal mb-14">
            <p className="kicker mb-4">Our Palette</p>
            <h2 className="font-display italic text-burg" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}>
              Wedding Colours
            </h2>
            <p className="font-body text-sm italic text-stone mt-2">
              We'd love to see you incorporate these into your look.
            </p>
          </div>

          {/* Swatch strips — flush, tall, designer-card aesthetic */}
          <div className="reveal overflow-hidden" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.12), 0 1px 0 rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", height: "clamp(220px, 30vw, 320px)" }}>
              {weddingColors.map((c, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: c.hex,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "clamp(0.75rem, 2vw, 1.25rem)",
                    position: "relative",
                    overflow: "hidden",
                    borderRight: i < weddingColors.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  {/* subtle inner vignette on each swatch */}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.18) 100%)", pointerEvents: "none" }} />
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <p
                      style={{
                        fontFamily: "Cinzel, serif",
                        fontSize: "clamp(0.38rem, 0.9vw, 0.52rem)",
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                        color: c.textColor,
                        lineHeight: 1.4,
                        marginBottom: "0.2rem",
                      }}
                    >
                      {c.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "EB Garamond, serif",
                        fontStyle: "italic",
                        fontSize: "clamp(0.55rem, 1.1vw, 0.72rem)",
                        color: c.textColor,
                        opacity: 0.7,
                        lineHeight: 1.3,
                        display: "none",
                      }}
                      className="md:block"
                    >
                      {c.note}
                    </p>
                    <p
                      style={{
                        fontFamily: "Cinzel, serif",
                        fontSize: "clamp(0.35rem, 0.7vw, 0.46rem)",
                        letterSpacing: "0.15em",
                        color: c.textColor,
                        opacity: 0.45,
                        marginTop: "0.35rem",
                      }}
                    >
                      {c.hex}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Florals */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-20">
        <div className="reveal mb-10">
          <p className="kicker mb-4">Our Flowers</p>
          <h2 className="font-display italic text-burg" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}>
            Floral Design
          </h2>
        </div>
        <div className="space-y-6 reveal">
          {flowers.map((f, i) => (
            <div key={i}>
              <div className="rule-full mb-4" />
              <div className="grid md:grid-cols-3 gap-1">
                <p className="kicker text-stone pb-2 md:pb-0">{f.name}</p>
                <p className="font-body text-sm text-ink-mid leading-relaxed md:col-span-2">{f.note}</p>
              </div>
            </div>
          ))}
          <div className="rule-full" />
        </div>
        <div className="mt-12 reveal">
          <PhotoPlaceholder id="finer-details-florals" aspect="video" caption="Floral design inspiration" />
        </div>
      </section>

      {/* Theme */}
      <section className="py-20 px-6 text-center" style={{ background: "hsl(var(--moss))" }}>
        <div className="max-w-2xl mx-auto reveal">
          <span className="rule mb-10 block" style={{ background: "hsl(var(--gold) / 0.4)" }} />
          <p className="kicker mb-6" style={{ color: "hsl(var(--chart-mid) / 0.7)" }}>Our Theme</p>
          <p
            className="font-display italic text-white leading-snug mb-6"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 300 }}
          >
            Old World Romance.<br />Modern Love.
          </p>
          <EditableText
            id="theme-body"
            tag="p"
            className="font-body text-sm leading-relaxed"
            style={{ color: "rgba(250,248,242,0.6)" }}
            defaultContent="Ancient stone walls draped in moss, candlelit tables heavy with anthuriums, and golden Tuscan light pouring over everything. Timeless, lush, and deeply personal."
          />
        </div>
      </section>

      {/* Week events */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-20">
        <div className="reveal mb-10">
          <p className="kicker mb-4">The Week</p>
          <h2 className="font-display italic text-burg" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}>
            Event Schedule
          </h2>
        </div>
        <div className="space-y-6 reveal">
          {weekEvents.map((ev, i) => (
            <div key={i}>
              <div className="rule-full mb-4" />
              <div className="grid md:grid-cols-3 gap-2">
                <div>
                  <p className="kicker text-stone mb-1">{ev.date}</p>
                  <p className="font-body text-xs text-stone">{ev.time} · {ev.location}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="font-display italic text-burg text-xl mb-1">{ev.event}</p>
                  <p className="font-body text-sm italic text-stone">{ev.note}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="rule-full" />
        </div>
      </section>

      {/* Day-of timeline */}
      <section className="py-20 px-6 md:px-10" style={{ background: "hsl(var(--parchment))" }}>
        <div className="max-w-3xl mx-auto">
          <div className="reveal mb-10">
            <p className="kicker mb-4">May 22, 2027</p>
            <h2 className="font-display italic text-burg" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}>
              Wedding Day
            </h2>
          </div>
          <div className="space-y-5 reveal">
            {weddingTimeline.map((item, i) => (
              <div key={i} className="grid grid-cols-[5rem_1fr] gap-6 items-start">
                <p className="kicker text-stone text-right">{item.time}</p>
                <div className="border-t border-stone/20 pt-3">
                  <p className="font-body text-base text-ink">{item.event}</p>
                  <p className="font-body text-xs italic text-stone">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
