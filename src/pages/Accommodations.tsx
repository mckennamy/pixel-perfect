import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import EditableText from "@/components/wedding/EditableText";
import PhotoPlaceholder from "@/components/wedding/PhotoPlaceholder";

const villas = [
  {
    id: "annadora",
    name: "La Casa di Annadora",
    beds: 4,
    baths: 2,
    guests: 9,
    sqm: 100,
    pool: "Private pool",
    tag: "Garden Villa",
    description: "An intimate and beautifully appointed villa with a private pool tucked into Villa Grabau's lush gardens. La Casa di Annadora is filled with an eclectic collection of Indian and Chinese antiques, creating a warmly curated atmosphere unlike any hotel.",
    features: ["4 bedrooms · 2 bathrooms", "Private pool", "Up to 9 guests", "100 m²", "Eclectic antique furnishings", "Full villa buyout"],
    aspect: "video" as const,
  },
  {
    id: "orazio",
    name: "La Casa di Orazio",
    beds: 5,
    baths: 3,
    guests: 10,
    sqm: 180,
    pool: "Shared circular pool",
    tag: "Grand Villa",
    description: "The grandest of the guest villas, with five spacious bedrooms and three bathrooms set across 180 square metres. A magnificent four-poster bed anchors the master suite. La Casa di Orazio shares the estate's beautiful circular 10-metre pool with La Stalletta.",
    features: ["5 bedrooms · 3 bathrooms", "Shared 10m circular pool", "Up to 10 guests", "180 m²", "Grand four-poster master suite", "Full villa buyout"],
    aspect: "video" as const,
  },
  {
    id: "stalletta",
    name: "La Stalletta",
    beds: 2,
    baths: 1,
    guests: 7,
    sqm: 100,
    pool: "Shared circular pool",
    tag: "Garden Cottage",
    description: "A charming converted stable nestled in the citrus garden, La Stalletta is an idyllic retreat for smaller groups. Set across two bedrooms with access to the shared circular pool alongside La Casa di Orazio, it combines rustic Tuscan character with every comfort.",
    features: ["2 bedrooms · 1 bathroom", "Shared 10m circular pool", "Up to 7 guests", "100 m²", "Citrus garden setting", "Full villa buyout"],
    aspect: "video" as const,
  },
  {
    id: "arancera",
    name: "L'Arancera",
    beds: 12,
    baths: 12,
    guests: 24,
    sqm: 436,
    pool: "Infinity saltwater pool + jacuzzi",
    tag: "Bridal & Groom Parties Only",
    bridal: true,
    description: "Our most spectacular villa — twelve en-suite bedrooms spread across five interconnected apartments, with 436 square metres of beautifully renovated space. L'Arancera features an infinity saltwater pool, a private jacuzzi, and sweeping grounds. Reserved exclusively for the bridal and groom parties and their designated plus ones.",
    features: ["12 bedrooms · 12 en-suite bathrooms", "Infinity saltwater pool & jacuzzi", "Up to 24 guests", "436 m²", "5 interconnected apartments", "Exclusively bridal & groom parties"],
    aspect: "video" as const,
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

      {/* Intro */}
      <div className="max-w-2xl mx-auto px-6 text-center mb-20 reveal">
        <EditableText
          id="accommodations-intro"
          tag="p"
          className="font-body text-base text-ink-mid leading-relaxed"
          defaultContent="All accommodation for our wedding week is on the grounds of Villa Grabau itself — a 16th-century estate in the hills above Lucca. Guests stay in one of four private villas, each with its own character, set amid centuries-old gardens, olive groves, and Tuscan countryside."
        />
      </div>

      {/* ── The Villas ── */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 mb-24">
        <div className="reveal mb-14">
          <p className="kicker mb-4">On the Estate</p>
          <h2
            className="font-display italic text-burg"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 300 }}
          >
            The Villas
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {villas.map((v) => (
            <div
              key={v.id}
              className="reveal"
              style={{
                border: v.bridal ? "1px solid rgba(184,154,106,0.45)" : "1px solid hsl(var(--border))",
                background: v.bridal ? "hsl(var(--burg-pale))" : "transparent",
              }}
            >
              {/* Tag */}
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{
                  borderBottom: v.bridal ? "1px solid rgba(184,154,106,0.3)" : "1px solid hsl(var(--border))",
                  background: v.bridal ? "hsl(var(--burg))" : "hsl(var(--parchment))",
                }}
              >
                <p
                  className="kicker"
                  style={{ color: v.bridal ? "hsl(var(--gold-light))" : "hsl(var(--stone))" }}
                >
                  {v.tag}
                </p>
                {/* Stats */}
                <div className="flex items-center gap-3">
                  {[
                    { n: v.beds,   label: "bed"  },
                    { n: v.baths,  label: "bath" },
                    { n: v.guests, label: "guest" },
                  ].map(({ n, label }) => (
                    <span
                      key={label}
                      className="kicker"
                      style={{
                        color: v.bridal ? "rgba(250,248,242,0.6)" : "hsl(var(--stone-light))",
                        fontSize: "0.48rem",
                      }}
                    >
                      {n} {label}{n !== 1 ? "s" : ""}
                    </span>
                  ))}
                </div>
              </div>

              {/* Photo */}
              <PhotoPlaceholder id={`villa-${v.id}`} aspect={v.aspect} />

              {/* Content */}
              <div className="p-6">
                <h3
                  className="font-display italic text-burg mb-1"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)", fontWeight: 300 }}
                >
                  {v.name}
                </h3>
                <p
                  className="kicker mb-4"
                  style={{ color: "hsl(var(--stone-light))", fontSize: "0.5rem" }}
                >
                  {v.pool} · {v.sqm} m²
                </p>

                <EditableText
                  id={`villa-${v.id}-desc`}
                  tag="p"
                  className="font-body text-sm text-ink-mid leading-relaxed mb-5"
                  defaultContent={v.description}
                />

                <ul className="space-y-2">
                  {v.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div
                        className="flex-shrink-0 mt-1.5"
                        style={{ width: 16, height: 1, background: "hsl(var(--gold))" }}
                      />
                      <span className="font-body text-xs text-ink-mid">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-20 px-6 md:px-10" style={{ background: "hsl(var(--burg))" }}>
        <div className="max-w-4xl mx-auto">
          <div className="reveal mb-14">
            <span className="rule block mb-10" style={{ background: "hsl(var(--gold) / 0.45)" }} />
            <p className="kicker mb-4" style={{ color: "hsl(var(--gold-light) / 0.7)" }}>Cost Breakdown</p>
            <h2
              className="font-display italic text-white"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}
            >
              Pricing
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10 reveal">
            {/* Per-guest rate */}
            <div
              className="p-8"
              style={{ border: "1px solid rgba(250,248,242,0.1)", background: "rgba(255,255,255,0.04)" }}
            >
              <p className="kicker mb-3" style={{ color: "hsl(var(--gold-light) / 0.7)" }}>Per-Guest Rate</p>
              <p
                className="font-display italic text-white leading-none mb-1"
                style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 300 }}
              >
                $460
                <span className="font-body not-italic text-sm ml-2" style={{ color: "rgba(250,248,242,0.5)" }}>USD</span>
              </p>
              <p className="font-body text-xs italic mb-6" style={{ color: "rgba(250,248,242,0.45)" }}>
                €385 per guest · all-inclusive accommodation for the week
              </p>
              <div className="space-y-3">
                {[
                  "Arrival Monday, May 19",
                  "Departure Saturday, May 24 or Sunday, May 25",
                  "Covers 5–6 nights on the estate",
                  "All villas — shared with your party",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-2" style={{ width: 12, height: 1, background: "hsl(var(--gold))" }} />
                    <p className="font-body text-xs" style={{ color: "rgba(250,248,242,0.6)" }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & services */}
            <div className="space-y-6">
              {/* Payment */}
              <div
                className="p-8"
                style={{ border: "1px solid rgba(250,248,242,0.1)", background: "rgba(255,255,255,0.04)" }}
              >
                <p className="kicker mb-3" style={{ color: "hsl(var(--gold-light) / 0.7)" }}>Payment</p>
                <p className="font-body text-sm mb-3" style={{ color: "rgba(250,248,242,0.75)" }}>
                  All payments are in <strong style={{ color: "white" }}>USD via Venmo</strong>. After submitting your reservation, you will receive payment instructions directly from McKenna.
                </p>
                <p className="font-body text-xs italic" style={{ color: "rgba(250,248,242,0.4)" }}>
                  A 50% deposit secures your place; the remaining balance is due February 22, 2027.
                </p>
              </div>

              {/* Linen service */}
              <div
                className="p-8"
                style={{ border: "1px solid rgba(250,248,242,0.1)", background: "rgba(255,255,255,0.04)" }}
              >
                <p className="kicker mb-3" style={{ color: "hsl(var(--gold-light) / 0.7)" }}>Linen & Towel Service</p>
                <p className="font-body text-sm mb-2" style={{ color: "rgba(250,248,242,0.75)" }}>
                  Daily linen and towel changes are available for an additional per-night charge.
                  Select your preference — every day or specific days — on the reservation form.
                </p>
                <p className="font-body text-xs italic" style={{ color: "rgba(250,248,242,0.4)" }}>
                  Service is available to all on-site guests.
                </p>
              </div>

              {/* L'Arancera note */}
              <div
                className="p-6 flex gap-4"
                style={{ border: "1px solid rgba(184,154,106,0.35)", background: "rgba(184,154,106,0.06)" }}
              >
                <div className="flex-shrink-0 w-px self-stretch" style={{ background: "hsl(var(--gold))" }} />
                <div>
                  <p className="kicker mb-2" style={{ color: "hsl(var(--gold-light))" }}>L'Arancera</p>
                  <p className="font-body text-xs" style={{ color: "rgba(250,248,242,0.55)" }}>
                    L'Arancera is reserved exclusively for the bridal party, groom's party, and their designated plus ones. It is not available for general guest booking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Villa Grabau & L'Arancera links ── */}
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-20">
        <div className="reveal mb-10">
          <p className="kicker mb-4">The Estate</p>
          <h2
            className="font-display italic text-burg"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 300 }}
          >
            Villa Grabau
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 reveal">
          <div>
            <PhotoPlaceholder id="villa-grabau-hero" aspect="video" caption="Villa Grabau" />
            <div className="mt-4 flex items-center justify-between">
              <p className="font-display italic text-burg" style={{ fontSize: "1.4rem" }}>Villa Grabau</p>
              <a
                href="https://www.villagrabau.it/en/"
                target="_blank"
                rel="noopener noreferrer"
                className="kicker pb-px transition-opacity hover:opacity-50"
                style={{ color: "hsl(var(--chart))", borderBottom: "1px solid hsl(var(--chart) / 0.4)" }}
              >
                Visit Website
              </a>
            </div>
            <EditableText
              id="villa-grabau-desc"
              tag="p"
              className="font-body text-sm text-ink-mid leading-relaxed mt-3"
              defaultContent="Our stunning wedding venue — a historic 16th-century Lucchese villa surrounded by formal Italian gardens, ancient olive groves, and sweeping Tuscan views. Villa Grabau has been the backdrop of love stories for centuries."
            />
          </div>
          <div>
            <PhotoPlaceholder id="larancera-hero" aspect="video" caption="L'Arancera" />
            <div className="mt-4 flex items-center justify-between">
              <p className="font-display italic text-burg" style={{ fontSize: "1.4rem" }}>L'Arancera</p>
              <a
                href="https://www.aranceravillagrabau.it/"
                target="_blank"
                rel="noopener noreferrer"
                className="kicker pb-px transition-opacity hover:opacity-50"
                style={{ color: "hsl(var(--chart))", borderBottom: "1px solid hsl(var(--chart) / 0.4)" }}
              >
                Visit Website
              </a>
            </div>
            <EditableText
              id="larancera-desc"
              tag="p"
              className="font-body text-sm text-ink-mid leading-relaxed mt-3"
              defaultContent="Nestled within Villa Grabau's grounds, L'Arancera is where the bridal and groom parties will stay in the days leading up to the wedding. The welcome party on May 20 will also be hosted here."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ background: "hsl(var(--moss))" }}>
        <div className="max-w-md mx-auto">
          <span className="rule mb-10 block" style={{ background: "hsl(var(--gold) / 0.4)" }} />
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
