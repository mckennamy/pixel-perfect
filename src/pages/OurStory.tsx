import { useEffect, useRef } from "react";

const chapters = [
  {
    year: "How It Began",
    headline: "The Night We Met",
    body: "It started with a glance across a crowded room — the kind of moment you read about in books but never quite believe is real until it happens to you. McKenna and Jordan met on [Date & Place] and from the very first conversation, something felt different. Easy. Like coming home to somewhere you'd never been.",
  },
  {
    year: "Getting to Know You",
    headline: "Late Nights & Long Laughs",
    body: "What followed were months of long dinners that stretched past midnight, road trips with no real destination, and the slow, wonderful discovery that the person sitting across from you is someone worth knowing for the rest of your life. Jordan's [a quality] balanced McKenna's [another quality] in the most perfect way.",
  },
  {
    year: "The Proposal",
    headline: "He Asked. She Said Yes.",
    body: "On [Proposal Date], surrounded by [describe the setting], Jordan got down on one knee. The ring was perfect. The moment was perfect. McKenna said yes before he even finished the question. We celebrated with [how you celebrated] and called everyone we love.",
  },
  {
    year: "Now",
    headline: "Becoming Bradley",
    body: "We chose Lucca, Italy because it is the most beautiful, romantic corner of the world we have ever visited — ancient walls, olive groves, and golden light that makes everything feel like a dream. We cannot wait to share it with all of you, the people who have loved us and cheered us on from the very beginning.",
  },
];

export default function OurStory() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.15 }
    );
    const els = sectionRef.current?.querySelectorAll(".fade-up");
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center text-center py-28 px-6 overflow-hidden"
        style={{
          background: "linear-gradient(160deg, hsl(346,56%,18%) 0%, hsl(346,56%,10%) 100%)",
        }}
      >
        {/* Floral motif lines */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-chartreuse via-transparent to-transparent" />
        </div>

        <p className="section-kicker mb-4">McKenna &amp; Jordan</p>
        <h1
          className="font-display text-5xl sm:text-6xl md:text-7xl italic text-white mb-5"
          style={{ textShadow: "0 2px 30px rgba(0,0,0,0.4)" }}
        >
          Our Story
        </h1>
        <div className="ornament-divider my-4">
          <span className="text-gold text-xs">◆</span>
        </div>
        <p className="font-body text-base italic text-white/70 max-w-md mt-4">
          Every love story is beautiful, but ours is our favourite.
        </p>
      </section>

      {/* Chapters */}
      <section ref={sectionRef} className="max-w-3xl mx-auto px-6 py-20">
        <div className="relative">
          {/* Vertical timeline line */}
          <div
            className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px opacity-20"
            style={{
              background: "linear-gradient(to bottom, transparent, hsl(var(--burg)) 10%, hsl(var(--burg)) 90%, transparent)",
              transform: "translateX(-50%)",
            }}
          />

          <div className="flex flex-col gap-20">
            {chapters.map((chapter, i) => (
              <div
                key={i}
                className={`fade-up relative flex flex-col sm:flex-row gap-8 ${i % 2 === 1 ? "sm:flex-row-reverse" : ""}`}
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-6 sm:left-1/2 w-3 h-3 rounded-full -translate-x-1/2 mt-2"
                  style={{ background: "hsl(var(--chartreuse))", boxShadow: "0 0 12px hsl(var(--chartreuse)/0.5)" }}
                />

                {/* Year label */}
                <div className={`sm:w-1/2 pt-1 ${i % 2 === 1 ? "sm:text-left sm:pl-12" : "sm:text-right sm:pr-12"} pl-14 sm:pl-0`}>
                  <p className="section-kicker">{chapter.year}</p>
                </div>

                {/* Content */}
                <div className={`sm:w-1/2 pl-14 sm:pl-0 ${i % 2 === 1 ? "sm:pr-12" : "sm:pl-12"}`}>
                  <h2 className="font-display text-2xl sm:text-3xl italic text-burg mb-3">
                    {chapter.headline}
                  </h2>
                  <p className="font-body text-base text-ink-mid leading-relaxed">
                    {chapter.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing quote */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: "hsl(var(--chartreuse-pale))" }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="ornament-divider mb-8">
            <span className="text-gold text-xs">◆</span>
          </div>
          <p className="font-display text-3xl sm:text-4xl italic text-burg leading-snug mb-6">
            "And so the adventure begins."
          </p>
          <p className="font-kicker text-[0.6rem] tracking-[0.3em] uppercase text-chartreuse-dark">
            — Becoming Bradley, May 22, 2027 —
          </p>
        </div>
      </section>
    </div>
  );
}
