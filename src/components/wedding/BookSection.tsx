import { useEffect, useRef } from "react";

const links = [
  { name: "Google Flights", desc: "Best for comparing routes and tracking price drops across all airlines", href: "https://www.google.com/flights" },
  { name: "KAYAK", desc: "Excellent for multi-stop itineraries and fare alerts", href: "https://www.kayak.com" },
  { name: "Expedia", desc: "Bundle flights and hotels for additional savings", href: "https://www.expedia.com" },
  { name: "Welcome Pickups", desc: "Pre-book your Pisa airport → Lucca private transfer", href: "https://www.welcomepickups.com/pisa/airport-to-lucca/" },
  { name: "Trenitalia", desc: "Book the Pisa Centrale to Lucca train in advance", href: "https://www.trenitalia.com/en.html" },
];

const BookSection = () => {
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
          <p className="font-kicker text-[0.65rem] tracking-[0.28em] uppercase text-burg-mid mb-3.5">Resources</p>
          <h2 className="font-display font-light text-[clamp(2.4rem,4vw,3.6rem)] leading-[1.1] text-ink mb-5">Book Your Journey</h2>
          <p className="font-body text-[1.1rem] text-ink-light leading-[1.8] italic">
            Use these trusted services to find and book your flights and ground transport.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-px bg-parchment-d border border-parchment-d max-[780px]:grid-cols-1">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="fade-up bg-parchment p-8 flex flex-col gap-1.5 transition-colors duration-200 hover:bg-burg-tint group"
            >
              <div className="font-display text-[1.3rem] font-medium text-ink">{link.name}</div>
              <div className="font-body text-[0.85rem] text-ink-light italic leading-[1.55] flex-1">{link.desc}</div>
              <div className="text-[1.1rem] text-gold mt-3 transition-transform duration-200 group-hover:translate-x-1">→</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookSection;
