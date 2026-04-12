import { useEffect, useRef } from "react";
import { ExternalLink, MapPin, Users, Star } from "lucide-react";

const villas = [
  {
    name: "Villa Grabau",
    role: "Wedding Venue",
    highlight: true,
    description:
      "Our stunning wedding venue — a historic 16th-century Lucchese villa surrounded by formal Italian gardens, ancient olive groves, and sweeping Tuscan views. Villa Grabau has been the backdrop of love stories for centuries, and we cannot wait to add ours to its walls.",
    details: [
      "16th-century historic villa",
      "Formal Italian gardens & olive groves",
      "Ceremony, reception & overnight suites",
      "Exclusive use for our wedding weekend",
    ],
    url: "https://www.villagrabau.it/en/",
    tag: "Ceremony & Reception",
    color: "burg",
  },
  {
    name: "La Rancera",
    role: "Bridal & Groom Party Accommodations",
    highlight: false,
    description:
      "Nestled in the Lucca countryside, La Rancera is where our bridal and groom parties will be staying. With its warm stone interiors, lush gardens, and authentic Tuscan charm, it's the perfect retreat for the people closest to us in the days leading up to the wedding. Our welcome party will also be hosted here.",
    details: [
      "Exclusive use for bridal & groom parties",
      "Welcome party venue (May 20)",
      "On-site pool and gardens",
      "Traditional Tuscan farmhouse style",
    ],
    url: "https://www.larancera.it",
    tag: "Bridal Party & Welcome Party",
    color: "olive",
  },
];

const accommodationTips = [
  {
    title: "On-Site Villas",
    description:
      "A limited number of on-site rooms are available at Villa Grabau and La Rancera. These fill up fast — make sure to select your preference on the reservation form.",
    icon: "🏡",
  },
  {
    title: "Lucca Town Centre",
    description:
      "Lucca's walled medieval centre has wonderful boutique hotels and B&Bs within walking distance of everything. A perfect base if you want to explore independently.",
    icon: "🏛️",
  },
  {
    title: "Nearby Agriturismo",
    description:
      "The Tuscan countryside surrounding Lucca is dotted with charming agriturismo (farm-stay) properties — beautiful, affordable, and deeply authentic.",
    icon: "🌿",
  },
  {
    title: "Linen & Towel Service",
    description:
      "For on-site guests, a daily linen and towel change service is available for an additional charge. Select your preference on the reservation form.",
    icon: "🛏️",
  },
];

export default function Accommodations() {
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
          background: "linear-gradient(160deg, hsl(120,18%,16%) 0%, hsl(120,20%,10%) 100%)",
        }}
      >
        <p className="section-kicker mb-4">Where You'll Stay</p>
        <h1 className="font-display text-5xl sm:text-6xl italic text-white mb-4">
          Accommodations
        </h1>
        <div className="ornament-divider my-4">
          <span className="text-gold text-xs">◆</span>
        </div>
        <p className="font-body text-base italic text-white/65 max-w-lg mt-4">
          Lucca, Tuscany — May 19–25, 2027
        </p>
      </section>

      {/* Venue cards */}
      <section className="max-w-5xl mx-auto px-6 py-20 flex flex-col gap-12">
        {villas.map((villa, i) => (
          <div
            key={i}
            className="fade-up grid md:grid-cols-5 gap-0 overflow-hidden rounded-sm shadow-md border border-parchment-d"
          >
            {/* Color accent sidebar */}
            <div
              className="md:col-span-1 flex flex-col items-center justify-center py-8 px-4 gap-3"
              style={{
                background:
                  villa.color === "burg"
                    ? "hsl(var(--burg))"
                    : "hsl(var(--olive-dark))",
              }}
            >
              <div className="text-white/20 text-5xl font-display italic">
                {i + 1}
              </div>
              {villa.highlight && (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={8} className="text-gold fill-gold" />
                  ))}
                </div>
              )}
              <p
                className="font-kicker text-[0.5rem] tracking-[0.2em] uppercase text-center"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {villa.tag}
              </p>
            </div>

            {/* Content */}
            <div className="md:col-span-4 bg-white p-8">
              <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                <div>
                  <p className="section-kicker mb-1">{villa.role}</p>
                  <h2 className="font-display text-3xl italic text-burg">
                    {villa.name}
                  </h2>
                </div>
                <a
                  href={villa.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-kicker text-[0.58rem] tracking-widest uppercase text-chartreuse-dark border border-chartreuse-dark/40 px-3 py-1.5 hover:bg-chartreuse-dark hover:text-white transition-colors"
                >
                  Visit Website <ExternalLink size={10} />
                </a>
              </div>

              <p className="font-body text-base text-ink-mid leading-relaxed mb-6">
                {villa.description}
              </p>

              <ul className="grid sm:grid-cols-2 gap-2">
                {villa.details.map((d, j) => (
                  <li key={j} className="flex items-start gap-2 font-body text-sm text-ink-light">
                    <span className="text-chartreuse mt-1">✦</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      {/* Tips grid */}
      <section
        className="py-16 px-6"
        style={{ background: "hsl(var(--parchment))" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 fade-up">
            <p className="section-kicker mb-2">Good to Know</p>
            <h2 className="font-display text-3xl italic text-burg">
              Accommodation Tips
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {accommodationTips.map((tip, i) => (
              <div
                key={i}
                className="fade-up bg-white border border-parchment-d p-6 rounded-sm"
              >
                <div className="text-2xl mb-3">{tip.icon}</div>
                <h3 className="font-kicker text-sm tracking-wide text-burg mb-2">
                  {tip.title}
                </h3>
                <p className="font-body text-sm text-ink-light leading-relaxed">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="fade-up text-center mb-10">
          <p className="section-kicker mb-2">Find Us</p>
          <h2 className="font-display text-3xl italic text-burg">
            Lucca, Tuscany
          </h2>
        </div>
        <div
          className="fade-up w-full h-64 rounded-sm border border-parchment-d flex items-center justify-center"
          style={{ background: "hsl(var(--chartreuse-pale))" }}
        >
          <div className="text-center">
            <MapPin size={28} className="text-burg mx-auto mb-3" />
            <p className="font-kicker text-xs tracking-widest uppercase text-burg mb-1">
              Villa Grabau
            </p>
            <p className="font-body text-sm text-ink-light italic">
              San Pancrazio, Lucca, 55100, Italy
            </p>
            <a
              href="https://www.villagrabau.it/en/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 font-body text-xs text-chartreuse-dark hover:underline"
            >
              Open on Google Maps <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 px-6 text-center"
        style={{ background: "hsl(var(--burg))" }}
      >
        <div className="ornament-divider mb-8 mx-auto" style={{ maxWidth: 280 }}>
          <span className="text-gold/60 text-xs">◆</span>
        </div>
        <p className="font-kicker text-[0.6rem] tracking-[0.3em] uppercase text-chartreuse mb-3">
          Ready to Reserve?
        </p>
        <p className="font-display text-3xl italic text-white mb-6">
          Secure your spot before spaces fill up
        </p>
        <a
          href="/reservations"
          className="font-kicker text-[0.6rem] tracking-[0.3em] uppercase px-8 py-3 border border-chartreuse text-chartreuse hover:bg-chartreuse hover:text-moss-dark transition-all duration-300 inline-block"
        >
          Reserve Now
        </a>
      </section>
    </div>
  );
}
