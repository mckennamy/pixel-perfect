import { useEffect, useRef } from "react";

// Recommendation link styling — bold burgundy with gold underline
const RecLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="font-semibold text-burg underline decoration-gold decoration-1 underline-offset-[3px] transition-opacity hover:opacity-70"
  >
    {children}
  </a>
);

const transports = [
  { num: "I", name: "Private Taxi", meta: "30 minutes · Door to door", desc: <>The most effortless option after a transatlantic flight. <RecLink href="https://www.cotapi.it/">CoTaPi</RecLink> is the official airport taxi provider, available around the clock directly outside the Arrivals hall. Your driver will bring you to the city gate nearest your accommodation.</>, cost: "≈ €70" },
  { num: "II", name: "Pre-Booked Transfer", meta: "30 minutes · Fixed, no surprises", desc: <>For complete peace of mind, pre-book with <RecLink href="https://www.tautouring.com/">Tau Touring</RecLink> — a beloved local service with consistently glowing reviews from travellers — or <RecLink href="https://www.welcomepickups.com/pisa/airport-to-lucca/">Welcome Pickups</RecLink>. Your driver meets you in Arrivals by name. Fixed price, no meters, no guesswork.</>, cost: "≈ €70 – 75 fixed", featured: true },
  { num: "III", name: "Train via Pisa Centrale", meta: "45 – 50 minutes · Scenic", desc: <>A charming, budget-friendly option for light packers. Take the <RecLink href="https://www.pisa-mover.com/en/">Pisa Mover monorail</RecLink> from the airport to Pisa Centrale station (~5 min), then board a <RecLink href="https://www.trenitalia.com/en.html">Trenitalia</RecLink> regional train to Lucca, which runs every hour and takes just 27 minutes.</>, cost: "≈ €4 – 6" },
];

const florenceOptions = [
  { name: "DD Express Bus", time: "~1 hour direct", desc: "Autolinee Toscane's direct coach runs the A11 motorway straight to Lucca. Comfortable, affordable, first stop after Florence is Lucca itself.", cost: "≈ €5 – 10" },
  { name: "Private Transfer", time: "~50 – 60 minutes", desc: "Pre-book a private car from Florence airport directly to your accommodation in Lucca. Best for groups or guests with significant luggage.", cost: "≈ €120 – 130" },
  { name: "Tram + Train", time: "~2+ hours", desc: "T2 tram from the airport to Santa Maria Novella (€1.70), then connect by Trenitalia toward Lucca. Budget-friendly but not ideal with heavy luggage.", cost: "≈ €10 – 20" },
];

const GroundTransport = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    ref.current?.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-28 px-8 bg-parchment" ref={ref}>
      <div className="max-w-[1120px] mx-auto">
        <div className="text-center max-w-[680px] mx-auto mb-16 fade-up">
          <p className="font-kicker text-[0.65rem] tracking-[0.28em] uppercase text-burg-mid mb-3.5">The Final Road</p>
          <h2 className="font-display font-light text-[clamp(2.4rem,4vw,3.6rem)] leading-[1.1] text-ink mb-5">Pisa to Lucca</h2>
          <p className="font-body text-[1.1rem] text-ink-light leading-[1.8] italic">
            Once you land, the journey into Lucca is short and beautiful. The city is just 35 kilometers — 22 miles — from Pisa's airport. Three excellent options await you.
          </p>
        </div>

        {/* Transport cards */}
        <div className="grid grid-cols-3 gap-6 mb-16 max-[780px]:grid-cols-1">
          {transports.map((t) => (
            <div key={t.num} className={`fade-up bg-cream border p-10 pt-10 pb-8 relative transition-all duration-300 hover:shadow-[0_12px_48px_rgba(28,20,16,0.08)] hover:-translate-y-[3px] ${t.featured ? 'border-gold' : 'border-parchment-d'}`}>
              {t.featured && (
                <div className="absolute -top-px right-6 bg-gold text-ink font-kicker text-[0.55rem] tracking-[0.14em] uppercase px-3 py-1">
                  Recommended
                </div>
              )}
              <div className={`font-display text-[3rem] font-light leading-none mb-3 tracking-tight ${t.featured ? 'text-gold/25' : 'text-parchment-d'}`}>{t.num}</div>
              <div className="font-display text-[1.6rem] text-ink leading-[1.1] mb-1">{t.name}</div>
              <div className="font-kicker text-[0.6rem] tracking-[0.16em] uppercase text-ink-light mb-5">{t.meta}</div>
              <div className="w-8 h-px bg-gold mb-5" />
              <div className="font-body text-[0.9rem] text-ink-light leading-[1.7] mb-6">{t.desc}</div>
              <div className={`font-display text-[1.25rem] font-medium tracking-[0.02em] ${t.featured ? 'text-gold' : 'text-burg'}`}>{t.cost}</div>
            </div>
          ))}
        </div>

        {/* Florence block */}
        <div className="fade-up bg-parchment-d border border-gold/20 p-12 mb-12 max-[640px]:p-6">
          <div className="mb-8">
            <h3 className="font-display text-[1.8rem] font-light italic text-ink mb-2">Flying into Florence instead?</h3>
            <p className="font-body text-[0.9rem] text-ink-light italic">
              If your best flights land at Florence Peretola (FLR), here's how to reach Lucca from there — about 80 km / 50 miles away.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8 max-[780px]:grid-cols-1 max-[780px]:gap-6">
            {florenceOptions.map((f) => (
              <div key={f.name} className="fade-up border-l-2 border-gold pl-5">
                <div className="font-display text-[1.15rem] font-medium text-ink mb-0.5">{f.name}</div>
                <div className="font-kicker text-[0.58rem] tracking-[0.15em] uppercase text-gold mb-2.5">{f.time}</div>
                <div className="font-body text-[0.85rem] text-ink-light leading-[1.65] mb-2.5">{f.desc}</div>
                <div className="font-display text-[1.05rem] font-medium text-burg">{f.cost}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Walled city note */}
        <div className="fade-up bg-burg p-2 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `repeating-linear-gradient(-45deg, transparent, transparent 30px, rgba(255,255,255,0.012) 30px, rgba(255,255,255,0.012) 31px)`
          }} />
          <div className="relative z-10 py-10 px-12 max-w-[760px] mx-auto text-center max-[640px]:py-8 max-[640px]:px-6">
            <p className="font-kicker text-[0.6rem] tracking-[0.24em] uppercase text-gold-light mb-3.5">A Note on Lucca's Ancient Walls</p>
            <p className="font-body text-[1rem] italic leading-[1.85]" style={{ color: 'rgba(248, 243, 236, 0.72)' }}>
              Lucca's magnificent Renaissance walls have enclosed the city for over 400 years — and private vehicles cannot enter the historic center. Every taxi and transfer service will drop you at the city gate nearest your accommodation. If you pre-book Tau Touring or Welcome Pickups, your driver will know precisely which gate to use. We recommend having your accommodation's full address on hand when you arrive.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GroundTransport;
