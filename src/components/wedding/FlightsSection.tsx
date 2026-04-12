import { useEffect, useRef } from "react";

const indSteps = [
  { color: "bg-burg shadow-[0_0_0_3px_hsl(346,42%,95%)]", title: "Depart Indianapolis (IND)", detail: "Aim for an early morning departure on May 19. A 2–3 hr domestic leg brings you to your transatlantic connection." },
  { color: "bg-gold shadow-[0_0_0_3px_hsl(40,70%,94%)]", title: "Connect at a European hub", detail: "Most praised: Amsterdam (AMS) via KLM/Delta — efficient, traveller-friendly, and one of the smoothest transfers in Europe. Also excellent: Frankfurt (FRA) on Lufthansa, London Heathrow (LHR) on British Airways, or Zurich (ZRH) on Swiss." },
  { color: "bg-chart shadow-[0_0_0_3px_hsl(72,52%,89%)]", title: "Arrive Pisa (PSA) — May 19", detail: "Pisa is the closest major airport to Lucca. Ground transport to the walled city takes just 30–50 minutes." },
];

const ordSteps = [
  { color: "bg-chart shadow-[0_0_0_3px_hsl(72,52%,89%)]", title: "Depart Chicago O'Hare (ORD)", detail: "~2.5 hrs from Plymouth, IN. O'Hare's international terminal offers dramatically more departure times and airlines — well worth the drive for more flexibility on May 19." },
  { color: "bg-gold shadow-[0_0_0_3px_hsl(40,70%,94%)]", title: "Option A — Fly direct to Pisa (PSA)", detail: "1 stop via Amsterdam, Frankfurt, Paris CDG, or Zurich. Closest gateway to Lucca. Airlines: KLM, Lufthansa, Air France, Swiss." },
  { color: "bg-[#4A7FB5] shadow-[0_0_0_3px_#E8EFF7]", title: "Option B — Fly to Florence (FLR)", detail: "More weekly frequencies via Air France (CDG) or KLM (AMS) — 35+ flights per week. Adds ~1 hr of ground travel but can unlock better schedules and pricing." },
];

const FlightsSection = () => {
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
    <section className="py-28 px-8 bg-cream" ref={ref}>
      <div className="max-w-[1120px] mx-auto">
        <div className="text-center max-w-[680px] mx-auto mb-16 fade-up">
          <p className="font-kicker text-[0.65rem] tracking-[0.28em] uppercase text-burg-mid mb-3.5">Getting There</p>
          <h2 className="font-display font-light text-[clamp(2.4rem,4vw,3.6rem)] leading-[1.1] text-ink mb-5">Your Flight Routes</h2>
          <p className="font-body text-[1.1rem] text-ink-light leading-[1.8] italic">
            Whether you depart from Indianapolis or make the drive to Chicago, Pisa is your gateway into Tuscany — just 35 kilometers from Lucca's ancient walls. Below are the two routes we recommend most.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-10 max-[780px]:grid-cols-1">
          {/* IND Route */}
          <RouteCard
            badge="Indianapolis"
            badgeClass="bg-burg text-gold-pale"
            from="IND"
            to="PSA"
            names="Indianapolis Intl. → Pisa Galileo Galilei"
            steps={indSteps}
            time="~16–18 hrs"
            price="from ~$400"
            priceColor="text-burg-light"
            airlines="Via Lufthansa · KLM/Delta · British Airways · Swiss"
          />

          {/* ORD Route */}
          <div className="fade-up relative">
            <div className="absolute -top-px left-0 right-0 h-1 bg-chart" />
            <div className="absolute top-3 right-4 bg-chart font-kicker text-[0.55rem] tracking-[0.14em] uppercase px-3 py-1 text-cream z-10">
              Most Flight Options
            </div>
            <RouteCard
              badge="Chicago O'Hare"
              badgeClass="bg-chart text-cream"
              from="ORD"
              to="PSA / FLR"
              names="Chicago O'Hare → Pisa or Florence"
              steps={ordSteps}
              time="~14–16 hrs"
              price="from ~$555"
              priceColor="text-chart-light"
              airlines="Via Air France · KLM · Lufthansa · Swiss · British Airways · United"
              featured
            />
          </div>
        </div>

        {/* Recommendation */}
        <div className="fade-up bg-burg p-2 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 100%, rgba(184,151,90,0.15) 0%, transparent 70%)`
          }} />
          <div className="relative z-10 py-11 px-12 text-center max-w-[820px] mx-auto max-[640px]:py-8 max-[640px]:px-6">
            <p className="font-kicker text-[0.62rem] tracking-[0.24em] uppercase text-gold-light mb-4">Our Recommendation</p>
            <p className="font-body text-[1.1rem] italic leading-[1.8]" style={{ color: 'rgba(248, 243, 236, 0.82)' }}>
              For guests departing Indianapolis, the <strong className="text-gold-pale not-italic font-medium">KLM/Delta route via Amsterdam (AMS) directly into Pisa</strong> is consistently praised as the most seamless journey — Amsterdam's Schiphol airport is among the world's most efficient transfer hubs. For guests driving to Chicago, <strong className="text-gold-pale not-italic font-medium">Air France via Paris CDG</strong> offers the greatest weekly frequency into both Pisa and Florence. In either case, book at least 2–3 months ahead, and target a flight that lands in Pisa on the evening of <strong className="text-gold-pale not-italic font-medium">May 19th</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const RouteCard = ({ badge, badgeClass, from, to, names, steps, time, price, priceColor, airlines, featured }: {
  badge: string; badgeClass: string; from: string; to: string; names: string;
  steps: { color: string; title: string; detail: string }[];
  time: string; price: string; priceColor: string; airlines: string; featured?: boolean;
}) => (
  <div className={`fade-up bg-cream border border-parchment-d p-8 pb-6 max-[640px]:p-7 max-[640px]:pb-5 ${featured ? 'border-t-0' : ''}`}>
    <div className="mb-6">
      <div className={`inline-block font-kicker text-[0.55rem] tracking-[0.14em] uppercase px-3 py-1.5 rounded-sm mb-4 ${badgeClass}`}>{badge}</div>
      <div className="flex items-center gap-4 mb-1">
        <span className="font-display text-[2rem] font-light text-ink tracking-[0.04em]">{from}</span>
        <div className="flex items-center gap-1 flex-1">
          <div className="flex-1 h-px bg-gold" />
          <div className="text-gold text-[0.9rem]">→</div>
        </div>
        <span className="font-display text-[2rem] font-light text-ink tracking-[0.04em]">{to}</span>
      </div>
      <div className="font-body text-[0.82rem] text-ink-light italic mb-8">{names}</div>
    </div>

    <div className="flex flex-col border-l border-parchment-d ml-1.5 pl-6 mb-8">
      {steps.map((step, i) => (
        <div key={i} className="relative pb-5">
          <div className={`absolute -left-6 top-1.5 -translate-x-1/2 w-2 h-2 rounded-full ${step.color}`} />
          <div className="font-display text-[1.05rem] font-medium text-ink mb-1">{step.title}</div>
          <div className="font-body text-[0.88rem] text-ink-light leading-[1.65]">{step.detail}</div>
        </div>
      ))}
    </div>

    <div className="flex justify-between items-end pt-6 border-t border-parchment-d mb-2.5">
      <div>
        <div className="font-kicker text-[0.58rem] tracking-[0.15em] uppercase text-ink-light mb-0.5">Journey time</div>
        <div className="font-display text-[1.35rem] text-ink">{time}</div>
      </div>
      <div className="text-right">
        <div className="font-kicker text-[0.58rem] tracking-[0.15em] uppercase text-ink-light mb-0.5">Typical round trip</div>
        <div className={`font-display text-[1.35rem] ${priceColor}`}>{price}</div>
      </div>
    </div>
    <div className="font-body text-[0.78rem] italic text-ink-light">{airlines}</div>
  </div>
);

export default FlightsSection;
