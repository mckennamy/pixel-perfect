import { useState } from "react";
import { Mail, Lock } from "lucide-react";

// Add invited email addresses here — editable directly in Lovable
const INVITED_EMAILS: string[] = [
  "example@email.com",
  // Add more invited guest emails below
];

interface RehearsalDetails {
  date: string;
  time: string;
  venue: string;
  address: string;
  dressCode: string;
  notes: string;
}

const details: RehearsalDetails = {
  date: "Wednesday, May 21, 2027",
  time: "7:30 PM",
  venue: "La Rancera",
  address: "Lucca, Tuscany, Italy",
  dressCode: "Smart Casual — relaxed but polished",
  notes:
    "Dinner will be served family style with traditional Tuscan courses and wine. Plan to arrive by 7:15 PM. The evening will wrap around 10:30 PM.",
};

const agenda = [
  { time: "7:15 PM", item: "Arrival & Aperitivo" },
  { time: "7:30 PM", item: "Rehearsal Dinner Begins" },
  { time: "8:00 PM", item: "First Course" },
  { time: "8:45 PM", item: "Main Course" },
  { time: "9:30 PM", item: "Toasts & Dessert" },
  { time: "10:30 PM", item: "Evening Closes" },
];

export default function RehearsalDinner() {
  const [email, setEmail] = useState("");
  const [granted, setGranted] = useState(false);
  const [error, setError] = useState("");

  // Check if already verified this session
  const sessionGranted = typeof window !== "undefined" && sessionStorage.getItem("rehearsal_access") === "yes";

  const checkAccess = () => {
    const normalised = email.trim().toLowerCase();
    const isInvited =
      INVITED_EMAILS.map((e) => e.toLowerCase()).includes(normalised) ||
      normalised.endsWith("@bradley.com"); // fallback for demo

    if (isInvited) {
      sessionStorage.setItem("rehearsal_access", "yes");
      setGranted(true);
      setError("");
    } else {
      setError("This email address isn't on our rehearsal dinner guest list. Please check your invitation or reach out directly.");
    }
  };

  if (!granted && !sessionGranted) {
    return (
      <div className="page-wrapper flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-sm text-center">
          <div className="w-12 h-12 rounded-full bg-burg/10 flex items-center justify-center mx-auto mb-5">
            <Mail size={20} className="text-burg" />
          </div>
          <p className="section-kicker mb-2">Private Event</p>
          <h1 className="font-display text-3xl italic text-burg mb-2">
            Rehearsal Dinner
          </h1>
          <p className="font-body text-sm text-ink-light mb-6 italic">
            This page is reserved for invited guests. Enter the email address on your invitation to continue.
          </p>

          <div className="bg-white border border-parchment-d p-6 rounded-sm shadow-sm text-left">
            <label className="block font-kicker text-[0.58rem] tracking-widest uppercase text-ink-mid mb-2">
              Your Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && checkAccess()}
              placeholder="you@email.com"
              className="w-full font-body text-sm bg-parchment/40 border border-parchment-d rounded-sm px-3 py-2.5 mb-3 focus:outline-none focus:ring-1 focus:ring-burg/40"
            />
            {error && (
              <p className="font-body text-xs text-red-600 mb-3 leading-snug">{error}</p>
            )}
            <button
              onClick={checkAccess}
              className="w-full font-kicker text-[0.6rem] tracking-[0.3em] uppercase py-3 bg-burg text-white hover:bg-burg-mid transition-colors"
            >
              View Invitation
            </button>
          </div>

          <p className="font-body text-xs italic text-ink-light mt-4">
            Questions? Reach out to McKenna directly.
          </p>
        </div>
      </div>
    );
  }

  // ── Granted access ──
  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center text-center py-24 px-6"
        style={{
          background: "linear-gradient(160deg, hsl(346,56%,16%) 0%, hsl(72,38%,18%) 100%)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Lock size={12} className="text-chartreuse/60" />
          <p className="section-kicker">Private Event</p>
        </div>
        <h1 className="font-display text-5xl sm:text-6xl italic text-white mb-4">
          Rehearsal Dinner
        </h1>
        <div className="ornament-divider my-4">
          <span className="text-gold text-xs">◆</span>
        </div>
        <p className="font-body text-base italic text-white/65 max-w-md mt-4">
          We are so grateful to have you by our side for this evening.
        </p>
      </section>

      {/* Details card */}
      <section className="py-16 px-6 max-w-2xl mx-auto">
        <div className="bg-white border border-parchment-d rounded-sm shadow-md overflow-hidden">
          {/* Card header */}
          <div
            className="px-8 py-6 text-center"
            style={{ background: "hsl(var(--chartreuse-pale))" }}
          >
            <p className="font-kicker text-[0.55rem] tracking-[0.3em] uppercase text-chartreuse-dark mb-1">
              Becoming Bradley
            </p>
            <p className="font-display text-2xl italic text-burg">
              The Evening Before
            </p>
          </div>

          {/* Details */}
          <div className="px-8 py-8">
            <div className="grid sm:grid-cols-2 gap-5 mb-8">
              {[
                { label: "Date", value: details.date },
                { label: "Time", value: details.time },
                { label: "Venue", value: details.venue },
                { label: "Address", value: details.address },
                { label: "Dress Code", value: details.dressCode },
              ].map((item) => (
                <div key={item.label} className={item.label === "Dress Code" ? "sm:col-span-2" : ""}>
                  <p className="font-kicker text-[0.5rem] tracking-widest uppercase text-ink-light mb-0.5">
                    {item.label}
                  </p>
                  <p className="font-body text-sm text-ink">{item.value}</p>
                </div>
              ))}
            </div>

            <div
              className="p-4 rounded-sm border-l-2 border-chartreuse mb-8"
              style={{ background: "hsl(var(--chartreuse-pale))" }}
            >
              <p className="font-body text-sm text-ink-mid italic leading-relaxed">
                {details.notes}
              </p>
            </div>

            {/* Evening agenda */}
            <div>
              <p className="font-kicker text-[0.58rem] tracking-widest uppercase text-ink-light mb-4">
                Evening Agenda
              </p>
              <div className="flex flex-col gap-3">
                {agenda.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="font-kicker text-[0.6rem] tracking-wide text-ink-light w-16 flex-shrink-0">
                      {item.time}
                    </span>
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: i === 0 ? "hsl(var(--chartreuse))" : "hsl(var(--burg-light))" }}
                    />
                    <span className="font-body text-sm text-ink">{item.item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="px-8 py-5 text-center border-t border-parchment-d"
            style={{ background: "hsl(var(--parchment))" }}
          >
            <p className="font-body text-xs italic text-ink-light">
              We love you and cannot wait to celebrate with you tomorrow. ✦
            </p>
            <p className="font-kicker text-[0.5rem] tracking-[0.25em] uppercase text-chartreuse-dark mt-2">
              McKenna &amp; Jordan
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
