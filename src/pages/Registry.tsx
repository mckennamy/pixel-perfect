import { useEffect, useRef } from "react";
import EditableText from "@/components/wedding/EditableText";
import OrnamentDivider from "@/components/wedding/OrnamentDivider";

export default function Registry() {
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
      <header className="pt-28 pb-16 text-center px-6">
        <EditableText
          id="registry-hero-kicker"
          defaultContent="With Gratitude"
          tag="p"
          className="kicker mb-5"
        />
        <EditableText
          id="registry-hero-h1"
          defaultContent="Registry"
          tag="h1"
          className="font-display italic text-burg leading-none mb-8"
          style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)", fontWeight: 300 }}
        />
        <span className="rule" />
      </header>

      {/* Note */}
      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-2xl mx-auto text-center reveal">
          <OrnamentDivider />

          <EditableText
            id="registry-note-1"
            tag="p"
            className="font-body text-base md:text-lg text-ink-mid leading-relaxed mt-10 mb-6"
            defaultContent="Your presence in Tuscany is, truly, the most generous gift we could ask for. Crossing the world to share this week with us means everything."
          />

          <EditableText
            id="registry-note-2"
            tag="p"
            className="font-body text-base md:text-lg text-ink-mid leading-relaxed mb-6"
            defaultContent="For those who feel inclined, we've created a registry to help make our life together in Italy a little more magical."
          />

          <EditableText
            id="registry-note-3"
            tag="p"
            className="font-body text-sm italic text-stone leading-relaxed mb-12"
            defaultContent="With love and so much gratitude — Jordan & McKenna."
          />

          <a
            href="https://www.zola.com/registry/mckennaandjordan2027/?preview=true"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-col items-center gap-3 px-10 py-8 transition-colors hover:bg-white/60"
            style={{
              border: "1px solid hsl(var(--gold) / 0.4)",
              background: "hsl(var(--parchment))",
            }}
          >
            <span
              className="kicker"
              style={{ color: "hsl(var(--burg) / 0.7)" }}
            >
              View Our Registry
            </span>
            <span
              className="font-display italic text-burg"
              style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 300 }}
            >
              Zola · McKenna & Jordan
            </span>
            <span className="font-body text-xs text-stone uppercase tracking-widest mt-1">
              Opens in a new tab
            </span>
          </a>

          <OrnamentDivider />
        </div>
      </section>
    </div>
  );
}