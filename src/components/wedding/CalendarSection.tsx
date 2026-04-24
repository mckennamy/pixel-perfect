import { useEffect, useRef } from "react";

const days = [
  { num: 19, weekday: "Tuesday", tag: "✦ Arrival Day", desc: "Book flights landing in Pisa on May 19. Settle into Lucca, rest, and begin to fall in love with Tuscany.", type: "travel-in" },
  { num: 20, weekday: "Wednesday", tag: "Wedding Events", desc: "Celebrations begin. Details and schedule shared separately with guests.", type: "event" },
  { num: 21, weekday: "Thursday", tag: "Wedding Events", desc: "More celebrations to come. We cannot wait to share these moments with you.", type: "event" },
  { num: 22, weekday: "Friday", tag: "The Wedding", desc: "The day we say I do — in the most beautiful city in the world.", type: "wedding", flourish: true },
  { num: 23, weekday: "Saturday", tag: "Wedding Events", desc: "The final day of festivities — savor every last moment in Tuscany.", type: "event" },
  { num: 24, weekday: "Sunday", tag: "✦ Depart Home", desc: "An early departure option for those who need to return. We'll miss you already.", type: "travel-out" },
];

const typeStyles: Record<string, { bg: string; numColor: string; weekdayColor: string; tagColor: string; descColor: string }> = {
  "travel-in": { bg: "bg-burg-tint", numColor: "text-burg", weekdayColor: "text-burg-mid", tagColor: "text-burg", descColor: "text-ink-light" },
  event: { bg: "bg-gold-pale", numColor: "text-gold", weekdayColor: "text-gold/70", tagColor: "text-gold", descColor: "text-ink-light" },
  wedding: { bg: "bg-burg", numColor: "text-chart-light", weekdayColor: "text-gold-light/70", tagColor: "text-gold-light", descColor: "text-gold-pale/70" },
  "travel-out": { bg: "bg-chart-pale", numColor: "text-chart", weekdayColor: "text-chart-mid", tagColor: "text-chart", descColor: "text-ink-light" },
};

const legend = [
  { label: "Arrival day", className: "bg-burg-tint border border-burg-light" },
  { label: "Wedding events", className: "bg-gold-pale border border-gold" },
  { label: "Wedding day", className: "bg-burg border border-burg-mid" },
  { label: "Departure day", className: "bg-chart-pale border border-chart-light" },
];

const CalendarSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    ref.current?.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-28 px-8 bg-parchment overflow-hidden" ref={ref}>
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 70% 40% at 50% 0%, rgba(184,151,90,0.07) 0%, transparent 70%)`
      }} />

      <div className="relative max-w-[1120px] mx-auto">
        <div className="text-center max-w-[680px] mx-auto mb-16 fade-up">
          <p className="font-kicker text-[0.65rem] tracking-[0.28em] uppercase text-burg-mid mb-3.5">Plan Your Stay</p>
          <h2 className="font-display font-light text-[clamp(2.4rem,4vw,3.6rem)] leading-[1.1] text-ink mb-5">The Week of Celebrations</h2>
          <p className="font-body text-[1.1rem] text-ink-light leading-[1.8] italic">
            We've mapped out the full week so you can plan your travel with confidence. May 19th is your arrival day — please plan to land in Pisa and reach Lucca that evening so you're rested and ready for everything that follows.
          </p>
        </div>

        <div className="grid grid-cols-7 gap-px bg-parchment-d border border-parchment-d rounded overflow-hidden shadow-[0_8px_60px_rgba(28,20,16,0.08)] max-[900px]:grid-cols-4 max-[580px]:grid-cols-2">
          {days.map((day) => {
            const s = typeStyles[day.type];
            return (
              <div key={day.num} className={`fade-up ${s.bg} p-7 pb-6 relative transition-transform duration-200 hover:-translate-y-0.5 hover:z-10`}>
                {day.flourish && (
                  <div className="absolute top-4 right-4 text-[0.75rem] text-gold-light opacity-60">★</div>
                )}
                <div className={`font-display text-[3rem] font-light leading-none mb-0.5 tracking-tight ${s.numColor}`}>{day.num}</div>
                <div className={`font-kicker text-[0.55rem] tracking-[0.18em] uppercase mb-3 ${s.weekdayColor}`}>{day.weekday}</div>
                <div className={`font-kicker text-[0.58rem] tracking-[0.1em] uppercase mb-2.5 font-medium ${s.tagColor}`}>{day.tag}</div>
                <div className={`font-body text-[0.82rem] italic leading-[1.55] ${s.descColor}`}>{day.desc}</div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-8 justify-center flex-wrap mt-8">
          {legend.map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-sm flex-shrink-0 ${l.className}`} />
              <span className="font-kicker text-[0.6rem] tracking-[0.12em] uppercase text-ink-light">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CalendarSection;
