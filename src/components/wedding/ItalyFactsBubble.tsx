import { useEffect, useRef, useState } from "react";

const funFacts = [
  {
    title: "Linens & Towels",
    body: "European hotels typically don't provide daily housekeeping, linen changes, or extra towels — they conserve water deeply.",
  },
  {
    title: "Power Adapters",
    body: "Italy uses Type C, F, and L plugs (230V). Bring a European adapter (and ideally a small power strip with one EU plug) to charge multiple devices at once.",
  },
  {
    title: "Passport Validity",
    body: "Your passport must have at least 6 months of validity beyond your travel dates. Italy will turn you away at the border if it expires sooner. Check today.",
  },
  {
    title: "REAL ID for Domestic Flights",
    body: "If you're connecting through a U.S. airport, your driver's license must be REAL ID compliant (gold star) — or bring your passport for the domestic leg too.",
  },
  {
    title: "Tipping Culture",
    body: "Tipping isn't expected in Italy — service is included (coperto). Rounding up or leaving a few euros for exceptional service is appreciated, but never required.",
  },
  {
    title: "Water at Restaurants",
    body: "Water is never free at Italian restaurants. You'll be asked: naturale (still) or frizzante (sparkling)? A bottle is usually €2–4.",
  },
  {
    title: "Pharmacies are Lifesavers",
    body: "Italian farmacie (look for the green cross) are excellent. Pharmacists can prescribe minor remedies on the spot — for headaches, allergies, stomach upset, etc.",
  },
  {
    title: "Cash is Still King",
    body: "Many small cafés, taxis, and shops in Tuscany still prefer cash. Withdraw euros before you leave the airport — ATM fees abroad add up fast.",
  },
  {
    title: "The Riposo (Siesta)",
    body: "Many shops close from 1 PM – 4 PM for riposo, especially outside city centers. Plan errands around the morning or late afternoon.",
  },
  {
    title: "Dining Hours",
    body: "Italians eat late: lunch 1–2:30 PM, dinner 8–10 PM. Most restaurants don't open for dinner before 7:30 PM. Aperitivo (5–8 PM) is your bridge.",
  },
  {
    title: "International Phone Plan",
    body: "Call your carrier before you leave — most US plans charge a daily fee abroad. An eSIM (Airalo, Holafly) is often far cheaper for the week.",
  },
  {
    title: "Driving in Italy",
    body: "If renting a car, you legally need an International Driving Permit (IDP) from AAA — easy to get for $20 before you leave. Italian ZTL zones (limited traffic areas) are fined automatically by camera.",
  },
];

// Italian word of the day — keyed by day of year so it's stable across visits
const italianWords = [
  { it: "Buongiorno", en: "Good morning / Hello" },
  { it: "Grazie", en: "Thank you" },
  { it: "Prego", en: "You're welcome / Please" },
  { it: "Ciao", en: "Hi / Bye" },
  { it: "Salute!", en: "Cheers! (lit. 'health')" },
  { it: "Per favore", en: "Please" },
  { it: "Mi scusi", en: "Excuse me (formal)" },
  { it: "Quanto costa?", en: "How much does it cost?" },
  { it: "Il conto, per favore", en: "The check, please" },
  { it: "Dov'è il bagno?", en: "Where is the bathroom?" },
  { it: "Buona sera", en: "Good evening" },
  { it: "Buona notte", en: "Good night" },
  { it: "Andiamo!", en: "Let's go!" },
  { it: "Bellissimo", en: "Beautiful / Wonderful" },
  { it: "Magari", en: "I wish / Maybe" },
  { it: "Allora", en: "So... / Well..." },
  { it: "Che bella!", en: "How beautiful!" },
  { it: "Buon appetito", en: "Enjoy your meal" },
  { it: "Cin cin", en: "Cheers (toasting)" },
  { it: "Più piano, per favore", en: "Slower, please" },
  { it: "Non capisco", en: "I don't understand" },
  { it: "Parla inglese?", en: "Do you speak English?" },
  { it: "Vorrei...", en: "I would like..." },
  { it: "Un caffè", en: "An espresso" },
  { it: "Un cappuccino", en: "A cappuccino (only before 11 AM!)" },
  { it: "Acqua naturale", en: "Still water" },
  { it: "Acqua frizzante", en: "Sparkling water" },
  { it: "Vino rosso", en: "Red wine" },
  { it: "Vino bianco", en: "White wine" },
  { it: "Amore", en: "Love" },
  { it: "La dolce vita", en: "The sweet life" },
];

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function ItalyFactsBubble() {
  const [factIndex, setFactIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);
  const resumeTimer = useRef<number | null>(null);

  const word = italianWords[getDayOfYear() % italianWords.length];
  const fact = funFacts[factIndex];

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setFactIndex((i) => (i + 1) % funFacts.length);
        setFading(false);
      }, 400);
    }, 7000);
    return () => clearInterval(interval);
  }, [paused]);

  const goTo = (next: number) => {
    setFading(true);
    setTimeout(() => {
      setFactIndex(((next % funFacts.length) + funFacts.length) % funFacts.length);
      setFading(false);
    }, 250);
    // Pause auto-rotation briefly so user can read
    setPaused(true);
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setPaused(false), 15000);
  };

  const handlePrev = () => goTo(factIndex - 1);
  const handleNext = () => goTo(factIndex + 1);

  return (
    <div className="max-w-2xl mx-auto px-6 mb-12">
      <div
        style={{
          background: "linear-gradient(135deg, hsl(var(--parchment)) 0%, hsl(var(--gold-pale)) 100%)",
          border: "1px solid hsl(var(--gold) / 0.35)",
          padding: "1.75rem 2rem",
          position: "relative",
        }}
      >
        {/* Top gold line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold)) 50%, transparent 100%)",
          }}
        />

        <div className="grid md:grid-cols-[1.4fr_1fr] gap-7">
          {/* Fun fact */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span style={{ color: "hsl(var(--gold))", fontSize: "0.9rem" }}>✦</span>
              <p className="kicker" style={{ color: "hsl(var(--burg))" }}>
                Fun Fact About Italy
              </p>
            </div>
            <div
              style={{
                opacity: fading ? 0 : 1,
                transform: fading ? "translateY(4px)" : "translateY(0)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
                minHeight: "5.5rem",
              }}
            >
              <p
                className="font-display italic mb-2"
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 400,
                  color: "hsl(var(--burg))",
                  lineHeight: 1.2,
                }}
              >
                {fact.title}
              </p>
              <p
                className="font-body text-sm leading-relaxed"
                style={{ color: "hsl(var(--ink-mid))" }}
              >
                {fact.body}
              </p>
            </div>

            {/* Controls: prev / dots / next */}
            <div className="flex items-center gap-3 mt-4">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous fact"
                style={{
                  background: "transparent",
                  border: "1px solid hsl(var(--gold) / 0.5)",
                  color: "hsl(var(--burg))",
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "0.7rem",
                  lineHeight: 1,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--gold) / 0.15)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
              >
                ‹
              </button>
              <div className="flex gap-1.5">
                {funFacts.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background:
                        i === factIndex
                          ? "hsl(var(--burg))"
                          : "hsl(var(--gold) / 0.4)",
                      transition: "background 0.3s",
                    }}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next fact"
                style={{
                  background: "transparent",
                  border: "1px solid hsl(var(--gold) / 0.5)",
                  color: "hsl(var(--burg))",
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "0.7rem",
                  lineHeight: 1,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--gold) / 0.15)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
              >
                ›
              </button>
            </div>
          </div>

          {/* Italian word of the day */}
          <div
            style={{
              borderLeft: "1px solid hsl(var(--gold) / 0.4)",
              paddingLeft: "1.5rem",
            }}
            className="md:pl-6 pl-0 md:border-l border-l-0 md:border-t-0 border-t pt-4 md:pt-0"
          >
            <div className="flex items-center gap-3 mb-3">
              <span style={{ color: "hsl(var(--gold))", fontSize: "0.9rem" }}>✦</span>
              <p className="kicker" style={{ color: "hsl(var(--burg))" }}>
                Italian Word of the Day
              </p>
            </div>
            <p
              className="font-script mb-1"
              style={{
                fontSize: "2.1rem",
                lineHeight: 1.05,
                color: "hsl(var(--burg))",
                fontWeight: 400,
              }}
            >
              {word.it}
            </p>
            <p
              className="font-display italic"
              style={{
                fontSize: "0.95rem",
                color: "hsl(var(--ink-mid))",
                lineHeight: 1.4,
              }}
            >
              {word.en}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}