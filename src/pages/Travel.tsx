import { useEffect, useRef } from "react";
import AIChat from "@/components/wedding/AIChat";
import PhotoPlaceholder from "@/components/wedding/PhotoPlaceholder";
import EditableText from "@/components/wedding/EditableText";

const calendarDays = [
  { date: "19", day: "Mon", desc: "Arrive in Lucca",           type: "travel" },
  { date: "20", day: "Tue", desc: "Welcome Party",             type: "event" },
  { date: "21", day: "Wed", desc: "Free Day",                  type: "free" },
  { date: "22", day: "Thu", desc: "Wedding Day",               type: "wedding" },
  { date: "23", day: "Fri", desc: "Free Day",                  type: "free" },
  { date: "24", day: "Sat", desc: "Depart / Free",             type: "travel" },
  { date: "25", day: "Sun", desc: "Depart",                    type: "travel" },
];

const flights = [
  {
    from: "Indianapolis · IND",
    to: "Pisa · PSA",
    via: "Amsterdam (AMS)",
    airlines: "KLM / Delta",
    duration: "14–17 hours",
    price: "$900 – $1,400 round trip",
    tip: "KLM via Amsterdam offers the most reliable connection to Pisa. Aim for a 2+ hour layover in AMS.",
    steps: [
      { leg: "IND → AMS", note: "9–10 hrs · KLM or Delta" },
      { leg: "AMS → PSA", note: "2 hrs · KLM" },
    ],
  },
  {
    from: "Chicago · ORD",
    to: "Pisa · PSA or Florence · FLR",
    via: "Paris CDG or Amsterdam AMS",
    airlines: "Air France / KLM / United",
    duration: "13–16 hours",
    price: "$850 – $1,300 round trip",
    tip: "Air France via CDG is excellent value. Florence (FLR) works well if Pisa flights are limited.",
    steps: [
      { leg: "ORD → CDG", note: "8–9 hrs · Air France" },
      { leg: "CDG → PSA", note: "2 hrs · Air France" },
    ],
  },
];

const ground = [
  {
    title: "Pre-Booked Transfer",
    from: "Pisa Airport → Villa Grabau",
    duration: "45 min",
    cost: "€55–80",
    note: "Welcome Pickups or MyDriver offer door-to-door service to the villa. Book in advance.",
    recommended: true,
  },
  {
    title: "Private Taxi",
    from: "Pisa Airport → Lucca",
    duration: "30–40 min",
    cost: "€40–60",
    note: "Book in advance via your accommodation. Uber is not widely available in this area.",
    recommended: false,
  },
  {
    title: "Train",
    from: "Pisa Centrale → Lucca",
    duration: "30 min",
    cost: "€3.60",
    note: "Trenitalia runs every 30–60 minutes. You will need a taxi from Lucca station to the villa.",
    recommended: false,
  },
];

export default function Travel() {
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
        <p className="kicker mb-5">Getting to Lucca</p>
        <h1
          className="font-display italic text-burg leading-none mb-8"
          style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)", fontWeight: 300 }}
        >
          Travel
        </h1>
        <span className="rule" />
      </header>

      {/* Hero photo */}
      <div className="px-6 md:px-16 mb-24 reveal">
        <PhotoPlaceholder id="travel-hero" aspect="wide" caption="Lucca, Tuscany" />
      </div>

      {/* Calendar */}
      <section className="py-20 px-6 md:px-10" style={{ background: "hsl(var(--parchment))" }}>
        <div className="max-w-4xl mx-auto">
          <div className="reveal mb-10">
            <p className="kicker mb-4">May 2027</p>
            <h2 className="font-display italic text-burg" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}>
              The Week at a Glance
            </h2>
          </div>
          <div className="grid grid-cols-7 gap-2 reveal">
            {calendarDays.map((d) => (
              <div
                key={d.date}
                className="text-center py-4 px-2"
                style={{
                  background: d.type === "wedding" ? "hsl(var(--burg))"
                    : d.type === "event"   ? "hsl(var(--moss))"
                    : d.type === "free"    ? "hsl(var(--chart-pale))"
                    : "hsl(var(--border))",
                  color: d.type === "wedding" || d.type === "event" ? "hsl(var(--cream))" : "hsl(var(--ink))",
                }}
              >
                <p className="kicker opacity-60 mb-1" style={{ fontSize: "0.48rem" }}>{d.day}</p>
                <p className="font-display text-2xl italic" style={{ fontWeight: 300 }}>{d.date}</p>
                <p className="font-body leading-tight mt-1" style={{ fontSize: "0.65rem", opacity: 0.75 }}>{d.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-5 mt-6 reveal">
            {[
              { bg: "hsl(var(--border))",     label: "Travel Days" },
              { bg: "hsl(var(--moss))",        label: "Welcome Party" },
              { bg: "hsl(var(--chart-pale))",  label: "Free Days" },
              { bg: "hsl(var(--burg))",        label: "Wedding Day" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-3 h-3" style={{ background: item.bg }} />
                <span className="font-body text-xs text-stone">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flights */}
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-20">
        <div className="reveal mb-10">
          <p className="kicker mb-4">By Air</p>
          <h2 className="font-display italic text-burg" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}>
            Recommended Flights
          </h2>
        </div>
        <div className="space-y-0 reveal">
          {flights.map((f, i) => (
            <div key={i}>
              <div className="rule-full mb-6" />
              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div>
                  <p className="kicker mb-3">{f.from} → {f.to}</p>
                  <div className="space-y-2 mb-4">
                    {f.steps.map((s, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "hsl(var(--burg))" }} />
                        <span className="font-body text-sm text-ink">{s.leg}</span>
                        <span className="font-body text-xs text-stone">{s.note}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-6 text-sm">
                    <span className="font-body text-stone">{f.duration}</span>
                    <span className="font-body text-stone">{f.price}</span>
                  </div>
                </div>
                <div className="py-4 px-5" style={{ background: "hsl(var(--chart-pale))", borderLeft: "2px solid hsl(var(--chart))" }}>
                  <EditableText
                    id={`travel-flight-tip-${i}`}
                    tag="p"
                    className="font-body text-sm italic text-ink-mid leading-relaxed"
                    defaultContent={f.tip}
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="rule-full" />
        </div>
      </section>

      {/* Ground transport */}
      <section className="py-20 px-6 md:px-10" style={{ background: "hsl(var(--parchment))" }}>
        <div className="max-w-4xl mx-auto">
          <div className="reveal mb-10">
            <p className="kicker mb-4">Pisa → Lucca</p>
            <h2 className="font-display italic text-burg" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}>
              Ground Transport
            </h2>
          </div>
          <div className="space-y-0 reveal">
            {ground.map((g, i) => (
              <div key={i}>
                <div className="rule-full mb-5" />
                <div className="grid md:grid-cols-3 gap-4 mb-5">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="kicker">{g.title}</p>
                      {g.recommended && (
                        <span className="kicker px-2 py-0.5" style={{ background: "hsl(var(--chart))", color: "white", fontSize: "0.48rem" }}>
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="font-body text-xs text-stone">{g.from}</p>
                  </div>
                  <div>
                    <p className="font-body text-sm text-ink mb-0.5">{g.duration}</p>
                    <p className="font-body text-sm text-stone">{g.cost}</p>
                  </div>
                  <EditableText
                    id={`travel-ground-note-${i}`}
                    tag="p"
                    className="font-body text-sm text-ink-mid leading-relaxed"
                    defaultContent={g.note}
                  />
                </div>
              </div>
            ))}
            <div className="rule-full" />
          </div>
        </div>
      </section>

      {/* AI assistant */}
      <section className="max-w-2xl mx-auto px-6 md:px-10 py-20">
        <div className="reveal mb-8">
          <p className="kicker mb-4">Need Help Planning?</p>
          <h2 className="font-display italic text-burg mb-2" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}>
            Travel Assistant
          </h2>
          <EditableText
            id="travel-assistant-desc"
            tag="p"
            className="font-body text-sm italic text-stone"
            defaultContent="Ask anything about flights, transfers, trains, or getting to Lucca."
          />
        </div>
        <div className="reveal">
          <AIChat
            title="Travel Assistant"
            subtitle="Flights, transfers & getting to Lucca"
            systemContext="You are a helpful wedding travel assistant for McKenna and Jordan's wedding in Lucca, Italy on May 22, 2027. Guests travel primarily from Indianapolis (IND) and Chicago (ORD). Help with flights, layovers, ground transport from Pisa Airport to Lucca (Villa Grabau), train options via Trenitalia, and travel logistics. Be concise and practical. Recommend Welcome Pickups for pre-booked transfers. Wedding week is May 19–25, 2027."
            placeholder="e.g. Best flights from Indianapolis to Pisa?"
            suggestions={["Best flights from Indianapolis?","How do I get from the airport to Lucca?","Fly into Pisa or Florence?","How early should I arrive?"]}
          />
        </div>
      </section>

      {/* Booking links */}
      <section className="py-14 px-6" style={{ background: "hsl(var(--burg))" }}>
        <div className="max-w-3xl mx-auto flex flex-wrap gap-4 justify-center">
          {[
            { label: "Google Flights", url: "https://flights.google.com" },
            { label: "KAYAK", url: "https://www.kayak.com" },
            { label: "Welcome Pickups", url: "https://www.welcomepickups.com" },
            { label: "Trenitalia", url: "https://www.trenitalia.com" },
          ].map((l) => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
              className="kicker px-5 py-2.5 transition-all"
              style={{ border: "1px solid rgba(250,248,242,0.2)", color: "rgba(250,248,242,0.6)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "hsl(var(--chart-mid))")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(250,248,242,0.6)")}
            >
              {l.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
