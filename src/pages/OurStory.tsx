import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PhotoPlaceholder from "@/components/wedding/PhotoPlaceholder";

const chapters = [
  {
    label: "How We Met",
    title: "The Night Everything Changed",
    body: "It started with a glance across a crowded room — the kind of moment you read about in books but never quite believe until it happens to you. McKenna and Jordan met on [Date & Place] and from the very first conversation, something felt undeniably different. Easy. Like coming home somewhere you had never been.",
    photoAspect: "video" as const,
    photoCaption: "The night we met",
  },
  {
    label: "Getting to Know You",
    title: "Late Nights & Long Laughs",
    body: "What followed were months of long dinners that stretched past midnight, road trips with no real destination, and the slow, wonderful discovery that the person sitting across from you is someone worth knowing for the rest of your life. Every ordinary moment became extraordinary.",
    photoAspect: "square" as const,
    photoCaption: "",
  },
  {
    label: "The Proposal",
    title: "He Asked. She Said Yes.",
    body: "On [Proposal Date], surrounded by [describe the setting], Jordan got down on one knee. The ring was perfect. The moment was perfect. McKenna said yes before he even finished the question. We celebrated with [how you celebrated] and called everyone we love.",
    photoAspect: "video" as const,
    photoCaption: "The proposal",
  },
  {
    label: "Now",
    title: "Becoming Bradley",
    body: "We chose Lucca, Italy because it is the most beautiful, romantic corner of the world we have ever visited — ancient walls, olive groves, and golden light that makes everything feel like a dream. We cannot wait to share it with every person who has loved and cheered for us from the very beginning.",
    photoAspect: "wide" as const,
    photoCaption: "Lucca, Tuscany",
  },
];

const exploreLinks = [
  { href: "/accommodations", label: "Accommodations" },
  { href: "/travel",         label: "Travel" },
  { href: "/finer-details",  label: "Finer Details" },
  { href: "/excursions",     label: "Excursions" },
  { href: "/faq",            label: "FAQ" },
  { href: "/reservations",   label: "Reserve Your Spot" },
];

export default function OurStory() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="page-wrapper" ref={ref}>
      {/* Hero */}
      <header className="pt-28 pb-20 text-center px-6">
        <p className="kicker mb-5">McKenna &amp; Jordan</p>
        <h1
          className="font-display italic text-burg leading-none mb-8"
          style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)", fontWeight: 300 }}
        >
          Our Story
        </h1>
        <span className="rule" />
      </header>

      {/* Hero photo */}
      <div className="px-6 md:px-16 mb-24 reveal">
        <PhotoPlaceholder aspect="wide" caption="McKenna & Jordan" />
      </div>

      {/* Chapters */}
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        {chapters.map((ch, i) => (
          <section key={i} className="mb-28 reveal">
            <p className="kicker mb-4">{ch.label}</p>
            <h2
              className="font-display italic text-burg leading-tight mb-6"
              style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 300 }}
            >
              {ch.title}
            </h2>
            <p className="font-body text-base text-ink-mid leading-relaxed mb-10">
              {ch.body}
            </p>
            <PhotoPlaceholder aspect={ch.photoAspect} caption={ch.photoCaption} />
          </section>
        ))}
      </div>

      {/* Closing quote */}
      <section
        className="py-24 px-6 text-center"
        style={{ background: "hsl(var(--moss))" }}
      >
        <div className="max-w-xl mx-auto">
          <span className="rule mb-10 block" />
          <p
            className="font-display italic leading-snug mb-8"
            style={{
              color: "hsl(var(--cream))",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 300,
            }}
          >
            "And so the adventure begins."
          </p>
          <p className="kicker" style={{ color: "hsl(var(--chart-mid) / 0.8)" }}>
            Becoming Bradley · May 22, 2027
          </p>
        </div>
      </section>

      {/* Continue exploring */}
      <section className="py-24 px-6 text-center" style={{ background: "hsl(var(--cream))" }}>
        <div className="max-w-2xl mx-auto">
          <span className="rule mb-10 block" />
          <p className="kicker mb-6 text-stone">Continue Exploring</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {exploreLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="font-body text-sm italic text-burg border-b border-transparent hover:border-burg transition-colors pb-0.5"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
