import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PhotoPlaceholder from "@/components/wedding/PhotoPlaceholder";

const venues = [
  {
    label: "Wedding Venue",
    name: "Villa Grabau",
    description:
      "Our stunning wedding venue — a historic 16th-century Lucchese villa surrounded by formal Italian gardens, ancient olive groves, and sweeping Tuscan views. Villa Grabau has been the backdrop of love stories for centuries.",
    details: [
      "16th-century historic villa",
      "Formal Italian gardens and ancient olive groves",
      "Ceremony, reception, and overnight suites",
      "Exclusive use for our wedding weekend",
    ],
    url: "https://www.villagrabau.it/en/",
    photoAspect: "video" as const,
  },
  {
    label: "Bridal Party & Welcome Party",
    name: "La Rancera",
    description:
      "Nestled in the Lucca countryside, La Rancera is where our bridal and groom parties will stay in the days leading up to the wedding. Our welcome party will also be hosted here on the evening of May 20.",
    details: [
      "Exclusive use for bridal and groom parties",
      "Welcome party venue — May 20",
      "On-site pool and lush gardens",
      "Traditional Tuscan farmhouse",
    ],
    url: "https://www.larancera.it",
    photoAspect: "video" as const,
  },
];

const tips = [
  {
    title: "On-Site Rooms",
    body: "A limited number of rooms are available at Villa Grabau and La Rancera. Select your preference on the reservation form — these fill quickly.",
  },
  {
    title: "Lucca Town Centre",
    body: "Boutique hotels and B&Bs within the ancient walled city are a wonderful option if you'd like to explore independently.",
  },
  {
    title: "Agriturismo",
    body: "The Tuscan countryside surrounding Lucca is full of charming agriturismo properties — authentic, beautiful, and often very good value.",
  },
  {
    title: "Linen Service",
    body: "For on-site guests, a daily linen and towel change is available for an additional charge. Select your preference on the reservation form.",
  },
];

export default function Accommodations() {
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
        <p className="kicker mb-5">Where You'll Stay</p>
        <h1
          className="font-display italic text-burg leading-none mb-8"
          style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 300 }}
        >
          Accommodations
        </h1>
        <span className="rule" />
      </header>

      {/* Venues */}
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        {venues.map((v, i) => (
          <section key={i} className="mb-24 reveal">
            <div className="mb-6">
              <p className="kicker mb-3">{v.label}</p>
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <h2
                  className="font-display italic text-burg leading-none"
                  style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 300 }}
                >
                  {v.name}
                </h2>
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kicker pb-px transition-opacity hover:opacity-50"
                  style={{ color: "hsl(var(--chart))", borderBottom: "1px solid hsl(var(--chart) / 0.4)" }}
                >
                  Visit Website
                </a>
              </div>
            </div>

            <PhotoPlaceholder aspect={v.photoAspect} />

            <div className="mt-8 grid md:grid-cols-2 gap-8">
              <p className="font-body text-base text-ink-mid leading-relaxed">
                {v.description}
              </p>
              <ul className="space-y-3">
                {v.details.map((d, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <div className="w-px h-4 mt-1.5 flex-shrink-0" style={{ background: "hsl(var(--gold))" }} />
                    <span className="font-body text-sm text-ink-mid">{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {i < venues.length - 1 && (
              <div className="rule-full mt-24" />
            )}
          </section>
        ))}
      </div>

      {/* Tips */}
      <section className="py-20 px-6 md:px-10" style={{ background: "hsl(var(--parchment))" }}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-14 reveal">
            <p className="kicker mb-4">Good to Know</p>
            <h2
              className="font-display italic text-burg"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}
            >
              Accommodation Notes
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            {tips.map((t, i) => (
              <div key={i} className="reveal">
                <div className="rule-full mb-4" />
                <p className="kicker mb-3">{t.title}</p>
                <p className="font-body text-sm text-ink-mid leading-relaxed">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ background: "hsl(var(--burg))" }}>
        <div className="max-w-md mx-auto">
          <span className="rule mb-10 block" style={{ background: "hsl(var(--gold) / 0.5)" }} />
          <p className="font-display italic text-white leading-snug mb-8"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 300 }}>
            Spaces are limited.<br />Reserve before they're gone.
          </p>
          <Link
            to="/reservations"
            className="kicker inline-block px-10 py-3 transition-all duration-300"
            style={{
              border: "1px solid hsl(var(--chart-mid) / 0.6)",
              color: "hsl(var(--chart-mid))",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "hsl(var(--chart-mid))";
              (e.currentTarget as HTMLAnchorElement).style.color = "hsl(var(--moss))";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.color = "hsl(var(--chart-mid))";
            }}
          >
            Reserve Now
          </Link>
        </div>
      </section>
    </div>
  );
}
