import { useEffect, useRef } from "react";

const dressCodes = [
  {
    label: "Women",
    icon: "👗",
    guidance:
      "Floor-length gowns, elegant midi dresses, or dressy jumpsuits in rich jewel tones, earth tones, or white/ivory. Think Tuscan sunset — romantic, textured, and sophisticated.",
  },
  {
    label: "Men",
    icon: "🤵",
    guidance:
      "Suits or sport coats with dress trousers. A tie is encouraged but not required. Linen is welcomed given the warm Italian May evenings.",
  },
  {
    label: "Dress Code",
    icon: "✨",
    guidance: "Garden Party Formal — elevated and romantic. Leave the casual attire at home and embrace the occasion.",
  },
];

const colorsToAvoid = [
  { color: "White", hex: "#FFFFFF", reason: "Reserved for the bride" },
  { color: "Ivory / Cream", hex: "#FFFFF0", reason: "Reserved for the bride" },
  { color: "All Black", hex: "#1a1a1a", reason: "Please incorporate some colour" },
];

const weddingColors = [
  { name: "Deep Burgundy", hex: "#6B1D2E", desc: "Primary — rich, romantic plum-red" },
  { name: "Chartreuse", hex: "#B5CC18", desc: "Accent — vibrant yellow-green" },
  { name: "Olive Green", hex: "#6B7234", desc: "Secondary green tone" },
  { name: "Moss Green", hex: "#3D4A30", desc: "Deep forest green" },
  { name: "White", hex: "#FAF7F2", desc: "Warm white for linens & accents" },
];

const flowers = [
  { name: "Anthuriums", icon: "🌺", desc: "Bold, waxy blooms in deep burgundy and oxblood" },
  { name: "Calla Lilies", icon: "🌷", desc: "Sculptural elegance in white and cream" },
  { name: "Moss", icon: "🌿", desc: "Lush, organic texture throughout all arrangements" },
];

const weddingTimeline = [
  { time: "4:00 PM", event: "Guests Arrive & Cocktail Hour", location: "Villa Grabau Gardens" },
  { time: "5:30 PM", event: "Ceremony Begins", location: "Garden Lawn, Villa Grabau" },
  { time: "6:15 PM", event: "Cocktail Reception", location: "Terrace & Gardens" },
  { time: "7:30 PM", event: "Dinner Service Opens", location: "Grand Ballroom" },
  { time: "9:00 PM", event: "First Dance & Toasts", location: "Grand Ballroom" },
  { time: "9:30 PM", event: "Dancing Begins", location: "Grand Ballroom" },
  { time: "12:00 AM", event: "Last Dance", location: "Grand Ballroom" },
  { time: "12:30 AM", event: "Late Night Bites & Send-Off", location: "Courtyard" },
];

const weekEvents = [
  { date: "May 20 · Tuesday", event: "Welcome Party", time: "7:00 PM", location: "La Rancera", notes: "Casual cocktail attire — this is a celebration!" },
  { date: "May 21 · Wednesday", event: "Rehearsal Dinner", time: "7:30 PM", location: "Invitation Only", notes: "Invited guests will receive a separate communication." },
  { date: "May 22 · Thursday", event: "WEDDING CEREMONY & RECEPTION", time: "4:00 PM", location: "Villa Grabau", notes: "Garden Party Formal attire" },
];

export default function FinerDetails() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    sectionRef.current?.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-wrapper" ref={sectionRef}>
      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center text-center py-24 px-6"
        style={{
          background: "linear-gradient(160deg, hsl(68,65%,20%) 0%, hsl(120,18%,14%) 100%)",
        }}
      >
        <p className="section-kicker mb-4">Everything You Need to Know</p>
        <h1 className="font-display text-5xl sm:text-6xl italic text-white mb-4">
          Finer Details
        </h1>
        <div className="ornament-divider my-4">
          <span className="text-gold text-xs">◆</span>
        </div>
        <p className="font-body text-base italic text-white/65 max-w-lg mt-4">
          Dress code, colours, flowers &amp; wedding timeline
        </p>
      </section>

      {/* Dress Code */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12 fade-up">
          <p className="section-kicker mb-2">What to Wear</p>
          <h2 className="font-display text-3xl italic text-burg">
            Dress Code
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {dressCodes.map((item, i) => (
            <div
              key={i}
              className="fade-up bg-white border border-parchment-d p-7 rounded-sm shadow-sm text-center"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="font-kicker text-sm tracking-widest uppercase text-burg mb-3">
                {item.label}
              </h3>
              <p className="font-body text-sm text-ink-mid leading-relaxed">{item.guidance}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Colors to avoid */}
      <section className="py-12 px-6" style={{ background: "hsl(var(--parchment))" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 fade-up">
            <p className="section-kicker mb-2">Please Avoid</p>
            <h2 className="font-display text-2xl italic text-burg">
              Colours to Skip
            </h2>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {colorsToAvoid.map((c, i) => (
              <div
                key={i}
                className="fade-up flex items-center gap-3 bg-white border border-parchment-d px-4 py-3 rounded-sm"
              >
                <div
                  className="w-6 h-6 rounded-sm border border-parchment-d flex-shrink-0"
                  style={{ background: c.hex }}
                />
                <div>
                  <p className="font-body text-sm text-ink font-medium">{c.color}</p>
                  <p className="font-body text-xs text-ink-light italic">{c.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding colours */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12 fade-up">
          <p className="section-kicker mb-2">Our Palette</p>
          <h2 className="font-display text-3xl italic text-burg">
            Wedding Colours
          </h2>
          <p className="font-body text-sm italic text-ink-light mt-2">
            Feel free to incorporate these into your outfit — we'd love it!
          </p>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          {weddingColors.map((c, i) => (
            <div key={i} className="fade-up flex flex-col items-center gap-2 w-28 sm:w-32">
              <div
                className="w-20 h-20 rounded-full border-4 border-white shadow-md"
                style={{ background: c.hex }}
              />
              <p className="font-kicker text-[0.55rem] tracking-widest uppercase text-ink-mid text-center">
                {c.name}
              </p>
              <p className="font-body text-[0.65rem] text-ink-light text-center leading-tight">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Florals */}
      <section className="py-14 px-6" style={{ background: "hsl(var(--chartreuse-pale))" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 fade-up">
            <p className="section-kicker mb-2">Our Flowers</p>
            <h2 className="font-display text-3xl italic text-burg">
              Floral Design
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {flowers.map((f, i) => (
              <div
                key={i}
                className="fade-up bg-white border border-parchment-d p-6 rounded-sm text-center shadow-sm"
              >
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-kicker text-sm tracking-widest uppercase text-chartreuse-dark mb-2">
                  {f.name}
                </h3>
                <p className="font-body text-sm text-ink-mid leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Week events */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12 fade-up">
          <p className="section-kicker mb-2">The Week's Events</p>
          <h2 className="font-display text-3xl italic text-burg">
            Event Schedule
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          {weekEvents.map((ev, i) => (
            <div
              key={i}
              className={`fade-up border-l-4 pl-6 py-4 pr-4 bg-white border border-parchment-d rounded-sm ${
                ev.event.includes("WEDDING") ? "border-l-burg" : "border-l-olive"
              }`}
              style={{
                borderLeftColor: ev.event.includes("WEDDING")
                  ? "hsl(var(--burg))"
                  : "hsl(var(--olive))",
              }}
            >
              <p className="section-kicker mb-1">{ev.date}</p>
              <p className="font-display text-xl italic text-burg mb-1">{ev.event}</p>
              <div className="flex gap-4 flex-wrap">
                <span className="font-body text-xs text-ink-light">⏰ {ev.time}</span>
                <span className="font-body text-xs text-ink-light">📍 {ev.location}</span>
              </div>
              {ev.notes && (
                <p className="font-body text-xs italic text-ink-light mt-1">{ev.notes}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Day-of timeline */}
      <section className="py-16 px-6" style={{ background: "hsl(var(--parchment))" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 fade-up">
            <p className="section-kicker mb-2">May 22, 2027</p>
            <h2 className="font-display text-3xl italic text-burg">
              Wedding Day Timeline
            </h2>
          </div>
          <div className="relative">
            <div
              className="absolute left-[4.5rem] top-0 bottom-0 w-px"
              style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--burg-light)) 10%, hsl(var(--burg-light)) 90%, transparent)" }}
            />
            <div className="flex flex-col gap-6">
              {weddingTimeline.map((item, i) => (
                <div key={i} className="fade-up flex items-start gap-6">
                  <div className="w-16 flex-shrink-0 text-right">
                    <span className="font-kicker text-[0.6rem] tracking-wide text-ink-light">
                      {item.time}
                    </span>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5 relative z-10"
                    style={{ background: i === 2 ? "hsl(var(--chartreuse))" : "hsl(var(--burg-light))" }}
                  />
                  <div>
                    <p className="font-body text-base text-ink font-medium">{item.event}</p>
                    <p className="font-body text-xs text-ink-light italic">{item.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Theme note */}
      <section
        className="py-16 px-6 text-center"
        style={{ background: "hsl(var(--burg))" }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="ornament-divider mb-8 mx-auto" style={{ maxWidth: 280 }}>
            <span className="text-gold/60 text-xs">◆</span>
          </div>
          <p className="font-kicker text-[0.6rem] tracking-[0.3em] uppercase text-chartreuse mb-3">
            Our Wedding Theme
          </p>
          <p className="font-display text-3xl sm:text-4xl italic text-white mb-4">
            Old World Romance meets Modern Love
          </p>
          <p className="font-body text-sm text-white/70 leading-relaxed max-w-xl mx-auto">
            Think ancient stone walls draped in greenery, candlelit tables heavy with anthuriums and moss,
            and golden Tuscan light pouring over it all. Timeless, lush, and deeply personal.
          </p>
          <div className="mt-8">
            <p className="font-kicker text-[0.6rem] tracking-[0.3em] uppercase text-chartreuse">
              — Becoming Bradley —
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
