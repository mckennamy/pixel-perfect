import { useState, useEffect, useRef } from "react";
import EditableText from "@/components/wedding/EditableText";

const details = {
  date: "Wednesday, May 21, 2027",
  time: "7:30 PM",
  venue: "La Rancera",
  address: "Lucca, Tuscany, Italy",
  dressCode: "Smart Casual — relaxed but polished",
  notes:
    "Dinner will be served family style with traditional Tuscan courses and wine. Plan to arrive by 7:15 PM. The evening will wrap around 10:30 PM.",
};

const agenda = [
  { time: "7:15 PM",  item: "Arrival & Aperitivo" },
  { time: "7:30 PM",  item: "Rehearsal Dinner Begins" },
  { time: "8:00 PM",  item: "First Course" },
  { time: "8:45 PM",  item: "Main Course" },
  { time: "9:30 PM",  item: "Toasts & Dessert" },
  { time: "10:30 PM", item: "Evening Closes" },
];

export default function RehearsalDinner() {
  const [granted, setGranted] = useState(false);
  const [checked, setChecked] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Access is granted automatically based on the guest tier set by the
  // landing-page name search. No email gate — guests should never have to
  // discover via this page that they aren't invited to the rehearsal.
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("wedding_guest");
      if (stored) {
        const g = JSON.parse(stored);
        if (g?.tier === "rehearsal") setGranted(true);
      }
    } catch {}
    setChecked(true);
  }, []);

  useEffect(() => {
    if (!granted) return;
    const obs = new IntersectionObserver(
      (e) => e.forEach((en) => en.isIntersecting && en.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [granted]);

  // Loading
  if (!checked) {
    return (
      <div className="page-wrapper flex items-center justify-center min-h-screen">
        <p className="font-body italic text-stone">Loading…</p>
      </div>
    );
  }

  // Guest is not on the rehearsal tier — show a graceful 404-style message
  // (no email gate that could reveal invite status).
  if (!granted) {
    return (
      <div className="page-wrapper flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-md text-center">
          <p className="kicker mb-4">Page Not Found</p>
          <h1
            className="font-display italic text-burg mb-6"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}
          >
            We couldn't find that page
          </h1>
          <span className="rule mb-6 block" />
          <p className="font-body text-sm italic text-stone">
            Please return to the home page to continue exploring our wedding website.
          </p>
          <a
            href="/"
            className="kicker inline-block mt-8 px-6 py-3"
            style={{ background: "hsl(var(--burg))", color: "hsl(var(--cream))" }}
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  // ── Granted access ──
  return (
    <div className="page-wrapper" ref={ref}>
      {/* Hero */}
      <header className="pt-28 pb-20 text-center px-6">
        <EditableText
          id="rehearsal-hero-kicker"
          tag="p"
          className="kicker mb-5"
          defaultContent="Private Event"
        />
        <EditableText
          id="rehearsal-hero-title"
          tag="h1"
          className="font-display italic text-burg leading-none mb-8"
          style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 300 }}
          defaultContent="Rehearsal Dinner"
        />
        <span className="rule" />
      </header>

      {/* Event details */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 pb-20">
        <div className="reveal mb-10">
          <EditableText
            id="rehearsal-details-kicker"
            tag="p"
            className="kicker mb-4"
            defaultContent="The Evening Before"
          />
          <EditableText
            id="rehearsal-details-title"
            tag="h2"
            className="font-display italic text-burg"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}
            defaultContent="Event Details"
          />
        </div>
        <div className="space-y-0 reveal">
          {[
            { label: "Date",       value: details.date },
            { label: "Time",       value: details.time },
            { label: "Venue",      value: details.venue },
            { label: "Address",    value: details.address },
            { label: "Dress Code", value: details.dressCode },
          ].map((item) => (
            <div key={item.label}>
              <div className="rule-full mb-4" />
              <div className="grid md:grid-cols-3 gap-2 mb-4">
                <EditableText
                  id={`rehearsal-details-${item.label.toLowerCase().replace(/\s+/g, '-')}-label`}
                  tag="p"
                  className="kicker"
                  defaultContent={item.label}
                />
                <EditableText
                  id={`rehearsal-details-${item.label.toLowerCase().replace(/\s+/g, '-')}-value`}
                  tag="p"
                  className="font-body text-sm text-[hsl(var(--ink-mid))] md:col-span-2"
                  defaultContent={item.value}
                />
              </div>
            </div>
          ))}
          <div className="rule-full mb-4" />
          <div className="grid md:grid-cols-3 gap-2 mb-4">
            <EditableText
              id="rehearsal-details-note-label"
              tag="p"
              className="kicker"
              defaultContent="Note"
            />
            <EditableText
              id="rehearsal-details-notes"
              tag="p"
              className="font-body text-sm italic text-[hsl(var(--stone))] leading-relaxed md:col-span-2"
              defaultContent={details.notes}
            />
          </div>
          <div className="rule-full" />
        </div>
      </section>

      {/* Evening agenda */}
      <section className="py-20 px-6 md:px-10" style={{ background: "hsl(var(--parchment))" }}>
        <div className="max-w-3xl mx-auto">
          <div className="reveal mb-10">
            <EditableText
              id="rehearsal-agenda-kicker"
              tag="p"
              className="kicker mb-4"
              defaultContent="May 21, 2027"
            />
            <EditableText
              id="rehearsal-agenda-title"
              tag="h2"
              className="font-display italic text-burg"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}
              defaultContent="Evening Agenda"
            />
          </div>
          <div className="space-y-5 reveal">
            {agenda.map((item, i) => (
              <div key={i} className="grid grid-cols-[5rem_1fr] gap-6 items-start">
                <EditableText
                  id={`rehearsal-agenda-${i}-time`}
                  tag="p"
                  className="kicker text-right"
                  defaultContent={item.time}
                />
                <div className="border-t border-[hsl(var(--border))] pt-3">
                  <EditableText
                    id={`rehearsal-agenda-${i}-item`}
                    tag="p"
                    className="font-body text-base text-[hsl(var(--ink))]"
                    defaultContent={item.item}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-20 px-6 text-center" style={{ background: "hsl(var(--moss))" }}>
        <div className="max-w-xl mx-auto reveal">
          <span className="rule mb-10 block" style={{ background: "hsl(var(--gold) / 0.4)" }} />
          <EditableText
            id="rehearsal-closing-quote"
            tag="p"
            className="font-display italic text-white leading-snug mb-6"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 300 }}
            defaultContent="We are so grateful to have you by our side."
          />
          <EditableText
            id="rehearsal-closing-body"
            tag="p"
            className="font-body text-sm leading-relaxed mb-8"
            style={{ color: "rgba(250,248,242,0.6)" }}
            defaultContent="This evening is for the people who have held us, shaped us, and walked beside us to this moment. We cannot wait to share it with you."
          />
          <EditableText
            id="rehearsal-closing-signature"
            tag="p"
            className="kicker"
            style={{ color: "rgba(250,248,242,0.45)" }}
            defaultContent="McKenna & Jordan"
          />
        </div>
      </section>
    </div>
  );
}
