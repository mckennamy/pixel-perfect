import { useState, useEffect, useRef } from "react";
import EditableText from "@/components/wedding/EditableText";

// Add invited email addresses here — editable directly in Lovable
const INVITED_EMAILS: string[] = [
  "example@email.com",
  "mckennamy@gmail.com",
  // Add more invited guest emails below
];

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
  const [email, setEmail] = useState("");
  const [granted, setGranted] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const sessionGranted = typeof window !== "undefined" && sessionStorage.getItem("rehearsal_access") === "yes";

  useEffect(() => {
    if (!granted && !sessionGranted) return;
    const obs = new IntersectionObserver(
      (e) => e.forEach((en) => en.isIntersecting && en.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [granted, sessionGranted]);

  const checkAccess = () => {
    const normalised = email.trim().toLowerCase();
    const isInvited =
      INVITED_EMAILS.map((e) => e.toLowerCase()).includes(normalised) ||
      normalised.endsWith("@bradley.com");

    if (isInvited) {
      sessionStorage.setItem("rehearsal_access", "yes");
      setGranted(true);
      setError("");
    } else {
      setError(
        "This email address isn't on our rehearsal dinner guest list. Please check your invitation or reach out directly."
      );
    }
  };

  // ── Email gate ──
  if (!granted && !sessionGranted) {
    return (
      <div className="page-wrapper flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <p className="kicker mb-4">Private Event</p>
            <h1
              className="font-display italic text-burg"
              style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300 }}
            >
              Rehearsal Dinner
            </h1>
            <span className="rule mt-6 block" />
          </div>

          <EditableText
            id="rehearsal-gate-desc"
            tag="p"
            className="font-body text-sm italic text-[hsl(var(--stone))] text-center mb-8"
            defaultContent="This page is reserved for invited guests. Enter the email address on your invitation to continue."
          />

          <div className="p-8" style={{ border: "1px solid hsl(var(--border))", background: "hsl(var(--parchment))" }}>
            <p className="kicker mb-3">Your Email Address</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && checkAccess()}
              placeholder="you@email.com"
              className="w-full font-body text-sm bg-white border border-[hsl(var(--border))] px-3 py-3 mb-3 focus:outline-none focus:border-[hsl(var(--burg-mid))] placeholder:text-[hsl(var(--stone-light))] text-[hsl(var(--ink))]"
            />
            {error && (
              <p className="font-body text-xs text-red-600 mb-4 leading-relaxed">{error}</p>
            )}
            <button
              onClick={checkAccess}
              className="w-full kicker py-3 transition-colors"
              style={{ background: "hsl(var(--burg))", color: "hsl(var(--cream))" }}
            >
              View Invitation
            </button>
          </div>

          <EditableText
            id="rehearsal-gate-footer"
            tag="p"
            className="font-body text-xs italic text-[hsl(var(--stone))] text-center mt-6"
            defaultContent="Questions? Reach out to McKenna directly."
          />
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
