import { useEffect, useRef } from "react";
import { Plane, Train, Car, ExternalLink } from "lucide-react";
import AIChat from "@/components/wedding/AIChat";

const flightRoutes = [
  {
    from: "Indianapolis (IND)",
    to: "Pisa (PSA)",
    via: "Amsterdam (AMS) or London (LHR)",
    airlines: "KLM, Delta, United",
    duration: "~14–17 hrs total",
    price: "$900 – $1,400 round trip",
    tip: "Book KLM via Amsterdam for the most reliable connection to Pisa. Aim for a 2+ hr layover.",
    steps: [
      { label: "IND → AMS", sub: "9–10 hrs, KLM / Delta" },
      { label: "AMS → PSA", sub: "2 hrs, KLM" },
    ],
  },
  {
    from: "Chicago (ORD)",
    to: "Pisa (PSA) or Florence (FLR)",
    via: "Paris CDG or Amsterdam AMS",
    airlines: "Air France, United, KLM",
    duration: "~13–16 hrs total",
    price: "$850 – $1,300 round trip",
    tip: "Air France via CDG offers great value. Florence (FLR) is a solid alternative if Pisa flights are limited.",
    steps: [
      { label: "ORD → CDG", sub: "8–9 hrs, Air France" },
      { label: "CDG → PSA", sub: "2 hrs, Air France" },
    ],
  },
];

const groundOptions = [
  {
    icon: Car,
    title: "Private Taxi",
    from: "Pisa Airport → Lucca",
    duration: "~30–40 min",
    cost: "€40–60",
    notes: "Book in advance via your hotel or arrival transfers. Uber is not widely available.",
    recommended: false,
  },
  {
    icon: Car,
    title: "Pre-Booked Transfer",
    from: "Pisa Airport → Villa Grabau",
    duration: "~45 min",
    cost: "€55–80",
    notes: "Welcome Pickups and MyDriver offer door-to-door service directly to the villa — the easiest option.",
    recommended: true,
  },
  {
    icon: Train,
    title: "Train",
    from: "Pisa Centrale → Lucca",
    duration: "~30 min",
    cost: "€3.60",
    notes: "Cheapest option. Trenitalia runs every 30–60 min. You'll need a taxi from Lucca station to the villa.",
    recommended: false,
  },
];

const bookingLinks = [
  { label: "Google Flights", url: "https://flights.google.com", icon: "✈️" },
  { label: "KAYAK", url: "https://www.kayak.com", icon: "🔍" },
  { label: "Expedia", url: "https://www.expedia.com", icon: "🌐" },
  { label: "Welcome Pickups", url: "https://www.welcomepickups.com", icon: "🚗" },
  { label: "Trenitalia", url: "https://www.trenitalia.com", icon: "🚆" },
];

export default function Travel() {
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
          background: "linear-gradient(160deg, hsl(346,56%,18%) 0%, hsl(72,38%,20%) 100%)",
        }}
      >
        <p className="section-kicker mb-4">Getting There</p>
        <h1 className="font-display text-5xl sm:text-6xl italic text-white mb-4">
          Travel
        </h1>
        <div className="ornament-divider my-4">
          <span className="text-gold text-xs">◆</span>
        </div>
        <p className="font-body text-base italic text-white/65 max-w-lg mt-4">
          Your journey to Lucca, Italy — May 19–25, 2027
        </p>
      </section>

      {/* Timeline */}
      <section className="py-16 px-6" style={{ background: "hsl(var(--parchment))" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 fade-up">
            <p className="section-kicker mb-2">Week at a Glance</p>
            <h2 className="font-display text-3xl italic text-burg">
              May 19–25, 2027
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {[
              { date: "19", label: "Mon", type: "travel", desc: "Arrive in Lucca" },
              { date: "20", label: "Tue", type: "event", desc: "Welcome Party at La Rancera" },
              { date: "21", label: "Wed", type: "free", desc: "Free Day / Excursions" },
              { date: "22", label: "Thu", type: "wedding", desc: "WEDDING DAY ✦" },
              { date: "23", label: "Fri", type: "free", desc: "Free Day / Excursions" },
              { date: "24", label: "Sat", type: "travel", desc: "Depart / Free Day" },
              { date: "25", label: "Sun", type: "travel", desc: "Depart" },
            ].map((day) => (
              <div
                key={day.date}
                className="fade-up rounded-sm p-3 text-center border"
                style={{
                  background:
                    day.type === "wedding"
                      ? "hsl(var(--burg))"
                      : day.type === "event"
                      ? "hsl(var(--moss))"
                      : day.type === "free"
                      ? "hsl(var(--chartreuse-pale))"
                      : "hsl(var(--parchment-d))",
                  borderColor:
                    day.type === "wedding"
                      ? "hsl(var(--burg-light))"
                      : "hsl(var(--parchment-d))",
                  color:
                    day.type === "wedding" || day.type === "event"
                      ? "white"
                      : "hsl(var(--ink))",
                }}
              >
                <p className="font-kicker text-[0.5rem] tracking-widest uppercase opacity-70 mb-0.5">
                  {day.label}
                </p>
                <p className="font-display text-2xl">{day.date}</p>
                <p
                  className="font-body text-[0.65rem] leading-tight mt-1"
                  style={{
                    color:
                      day.type === "wedding" || day.type === "event"
                        ? "rgba(255,255,255,0.8)"
                        : "hsl(var(--ink-light))",
                  }}
                >
                  {day.desc}
                </p>
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 justify-center mt-6 fade-up">
            {[
              { color: "hsl(var(--parchment-d))", label: "Travel Days" },
              { color: "hsl(var(--moss))", label: "Welcome Party" },
              { color: "hsl(var(--chartreuse-pale))", label: "Free Days" },
              { color: "hsl(var(--burg))", label: "Wedding Day" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm border border-parchment-d"
                  style={{ background: item.color }}
                />
                <span className="font-body text-xs text-ink-light">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flights */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12 fade-up">
          <p className="section-kicker mb-2">Getting Here</p>
          <h2 className="font-display text-3xl italic text-burg">
            Recommended Flights
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {flightRoutes.map((route, i) => (
            <div
              key={i}
              className="fade-up bg-white border border-parchment-d p-6 rounded-sm shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <Plane size={14} className="text-chartreuse-dark" />
                <span className="font-kicker text-xs tracking-widest uppercase text-chartreuse-dark">
                  {route.from}
                </span>
                <span className="text-ink-light text-xs">→</span>
                <span className="font-kicker text-xs tracking-widest uppercase text-chartreuse-dark">
                  {route.to}
                </span>
              </div>

              {/* Steps */}
              <div className="flex flex-col gap-2 mb-4">
                {route.steps.map((step, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-burg flex-shrink-0" />
                    <div>
                      <span className="font-body text-sm text-ink font-medium">
                        {step.label}
                      </span>
                      <span className="font-body text-xs text-ink-light ml-2">
                        {step.sub}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div>
                  <p className="font-kicker text-[0.5rem] tracking-widest uppercase text-ink-light mb-0.5">Duration</p>
                  <p className="font-body text-ink">{route.duration}</p>
                </div>
                <div>
                  <p className="font-kicker text-[0.5rem] tracking-widest uppercase text-ink-light mb-0.5">Est. Cost</p>
                  <p className="font-body text-ink">{route.price}</p>
                </div>
              </div>

              <div
                className="p-3 rounded-sm border-l-2 border-chartreuse"
                style={{ background: "hsl(var(--chartreuse-pale))" }}
              >
                <p className="font-body text-xs italic text-ink-mid">
                  💡 {route.tip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ground transport */}
      <section className="py-16 px-6" style={{ background: "hsl(var(--parchment))" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 fade-up">
            <p className="section-kicker mb-2">Pisa → Lucca</p>
            <h2 className="font-display text-3xl italic text-burg">
              Ground Transport
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {groundOptions.map((opt, i) => (
              <div
                key={i}
                className={`fade-up relative bg-white border p-6 rounded-sm shadow-sm ${opt.recommended ? "border-chartreuse" : "border-parchment-d"}`}
              >
                {opt.recommended && (
                  <div
                    className="absolute -top-3 left-4 font-kicker text-[0.5rem] tracking-widest uppercase px-3 py-1"
                    style={{ background: "hsl(var(--chartreuse))", color: "hsl(var(--moss-dark))" }}
                  >
                    Recommended
                  </div>
                )}
                <opt.icon size={18} className="text-burg mb-3" />
                <h3 className="font-kicker text-sm tracking-wide text-burg mb-1">
                  {opt.title}
                </h3>
                <p className="font-body text-xs text-ink-light mb-3">{opt.from}</p>
                <div className="flex gap-4 text-xs mb-3">
                  <span className="font-body text-ink">⏱ {opt.duration}</span>
                  <span className="font-body text-ink">💶 {opt.cost}</span>
                </div>
                <p className="font-body text-xs text-ink-mid leading-relaxed">
                  {opt.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Travel Assistant */}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-8 fade-up">
          <p className="section-kicker mb-2">Need Help Planning?</p>
          <h2 className="font-display text-3xl italic text-burg mb-3">
            Travel Assistant
          </h2>
          <p className="font-body text-sm text-ink-light italic">
            Ask me anything about flights, transfers, train schedules, or getting to Lucca.
          </p>
        </div>
        <div className="fade-up">
          <AIChat
            title="Travel Assistant"
            subtitle="Flights, transfers & getting to Lucca"
            systemContext="You are a helpful wedding travel assistant for McKenna and Jordan's wedding in Lucca, Italy on May 22, 2027. Guests are traveling primarily from Indianapolis (IND) and Chicago (ORD). Help them with flight options, layovers, ground transportation from Pisa Airport to Lucca (Villa Grabau), train options (Trenitalia), and any other travel logistics. Be concise, friendly, and practical. Recommend Welcome Pickups for pre-booked transfers. Note that the wedding week is May 19-25, 2027."
            placeholder="e.g. What's the best flight from Chicago to Pisa?"
            suggestions={[
              "Best flights from Indianapolis?",
              "How do I get from the airport to Lucca?",
              "Should I fly into Pisa or Florence?",
              "How early should I arrive?",
            ]}
          />
        </div>
      </section>

      {/* Booking links */}
      <section
        className="py-12 px-6"
        style={{ background: "hsl(var(--burg))" }}
      >
        <div className="max-w-4xl mx-auto">
          <p className="font-kicker text-[0.6rem] tracking-[0.3em] uppercase text-chartreuse text-center mb-6">
            Helpful Links
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {bookingLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-body text-sm text-white/80 border border-white/20 px-4 py-2 rounded-sm hover:bg-white/10 transition-colors"
              >
                <span>{link.icon}</span>
                {link.label}
                <ExternalLink size={10} className="opacity-50" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
