import { useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";
import AIChat from "@/components/wedding/AIChat";

const excursionDays = [
  {
    date: "Wednesday, May 21",
    label: "Free Day (Non-Rehearsal Dinner Guests)",
    note: "Perfect day to explore Lucca or take a day trip",
  },
  {
    date: "Friday, May 23",
    label: "Free Day — The Morning After",
    note: "Enjoy a leisurely morning, then venture out",
  },
  {
    date: "Saturday, May 24",
    label: "Free Day / Departure Prep",
    note: "Last full day — make it count!",
  },
];

const destinations = [
  {
    name: "Lucca",
    distance: "Right here!",
    emoji: "🏰",
    highlights: [
      "Walk or cycle the ancient city walls (4km loop)",
      "Visit the Guinigi Tower with rooftop oak trees",
      "Explore Piazza dell'Anfiteatro (Roman amphitheatre)",
      "Browse the daily market at Piazza San Michele",
      "Wine tasting at local Lucchese wine bars",
    ],
    tip: "Rent a bike — cycling the walls is one of the most iconic things you can do in Lucca.",
  },
  {
    name: "Pisa",
    distance: "30 min by car / train",
    emoji: "🗼",
    highlights: [
      "The Leaning Tower of Pisa (book in advance!)",
      "Piazza dei Miracoli — cathedral, baptistery & tower",
      "Lungarno riverside walk",
      "Lunch at a local trattoria near the market",
    ],
    tip: "Arrive early — the tower gets crowded by 10 AM. Book tower entry online at opapisa.it.",
  },
  {
    name: "Florence",
    distance: "75 min by car / 1.5 hrs by train",
    emoji: "🎨",
    highlights: [
      "Uffizi Gallery (Botticelli, da Vinci, Michelangelo)",
      "Ponte Vecchio & Oltrarno neighbourhood",
      "Accademia Gallery — see Michelangelo's David",
      "Piazzale Michelangelo at sunset",
      "Mercato Centrale for incredible food",
    ],
    tip: "Pre-book all museum tickets — the Uffizi and Accademia sell out weeks in advance.",
  },
  {
    name: "Cinque Terre",
    distance: "2 hrs by car",
    emoji: "🌊",
    highlights: [
      "Hike the Sentiero Azzurro coastal trail",
      "Visit all five villages: Riomaggiore, Manarola, Corniglia, Vernazza, Monterosso",
      "Fresh seafood and limoncello with a view",
      "Boat tour between the villages",
    ],
    tip: "Buy a Cinque Terre card for the train and trails. Start early to avoid the afternoon crowds.",
  },
  {
    name: "Siena",
    distance: "1.5 hrs by car",
    emoji: "🏙️",
    highlights: [
      "Piazza del Campo — one of Italy's greatest squares",
      "Siena Cathedral (Duomo di Siena)",
      "Torre del Mangia — climb for city views",
      "Explore the medieval contrade (neighbourhoods)",
    ],
    tip: "Siena is hilly — wear comfortable shoes. It's less crowded than Florence and absolutely stunning.",
  },
  {
    name: "Chianti Wine Country",
    distance: "1 hr by car",
    emoji: "🍷",
    highlights: [
      "Wine tasting at Chianti Classico estates",
      "Drive the Via Chiantigiana scenic route",
      "Visit Greve in Chianti's main square",
      "Truffle hunting tours (seasonal)",
    ],
    tip: "Book a guided wine tour so everyone can enjoy without worrying about driving. Many estates offer private tours.",
  },
];

const bookingResources = [
  { label: "Viator Tours", url: "https://www.viator.com", desc: "Group & private tours across Tuscany" },
  { label: "GetYourGuide", url: "https://www.getyourguide.com", desc: "Instantly bookable activities" },
  { label: "Airbnb Experiences", url: "https://www.airbnb.com/experiences", desc: "Local cooking classes, wine tours" },
  { label: "Uffizi Tickets", url: "https://www.uffizi.it/en/tickets", desc: "Florence — book far in advance" },
  { label: "Tower of Pisa", url: "https://www.opapisa.it", desc: "Official Pisa ticket booking" },
  { label: "Trenitalia", url: "https://www.trenitalia.com", desc: "Train travel across Tuscany" },
];

export default function Excursions() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
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
          background: "linear-gradient(160deg, hsl(120,18%,16%) 0%, hsl(68,65%,18%) 100%)",
        }}
      >
        <p className="section-kicker mb-4">Beyond the Wedding</p>
        <h1 className="font-display text-5xl sm:text-6xl italic text-white mb-4">
          Excursions
        </h1>
        <div className="ornament-divider my-4">
          <span className="text-gold text-xs">◆</span>
        </div>
        <p className="font-body text-base italic text-white/65 max-w-lg mt-4">
          Make the most of your time in Tuscany
        </p>
      </section>

      {/* Free days */}
      <section className="py-12 px-6" style={{ background: "hsl(var(--parchment))" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 fade-up">
            <p className="section-kicker mb-2">Your Free Days</p>
            <h2 className="font-display text-2xl italic text-burg">
              Days to Explore
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {excursionDays.map((day, i) => (
              <div
                key={i}
                className="fade-up bg-white border border-parchment-d p-5 rounded-sm shadow-sm"
              >
                <p className="section-kicker mb-1">{day.date}</p>
                <p className="font-body text-sm text-burg font-medium mb-1">{day.label}</p>
                <p className="font-body text-xs text-ink-light italic">{day.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations grid */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12 fade-up">
          <p className="section-kicker mb-2">Where to Go</p>
          <h2 className="font-display text-3xl italic text-burg">
            Destinations Near Lucca
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, i) => (
            <div
              key={i}
              className="fade-up bg-white border border-parchment-d rounded-sm shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div
                className="px-5 py-4 flex items-center gap-3"
                style={{ background: "hsl(var(--moss-dark))" }}
              >
                <span className="text-2xl">{dest.emoji}</span>
                <div>
                  <p className="font-kicker text-sm tracking-wide text-white">{dest.name}</p>
                  <p className="font-body text-xs text-chartreuse/80">{dest.distance}</p>
                </div>
              </div>

              {/* Highlights */}
              <div className="p-5">
                <ul className="flex flex-col gap-2 mb-4">
                  {dest.highlights.map((h, j) => (
                    <li key={j} className="flex items-start gap-2 font-body text-xs text-ink-mid">
                      <span className="text-chartreuse-dark mt-0.5">✦</span>
                      {h}
                    </li>
                  ))}
                </ul>
                <div
                  className="p-3 rounded-sm border-l-2 border-chartreuse"
                  style={{ background: "hsl(var(--chartreuse-pale))" }}
                >
                  <p className="font-body text-xs italic text-ink-mid">
                    💡 {dest.tip}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Excursions Assistant */}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-8 fade-up">
          <p className="section-kicker mb-2">Plan Your Days</p>
          <h2 className="font-display text-3xl italic text-burg mb-3">
            Activity Planner
          </h2>
          <p className="font-body text-sm text-ink-light italic">
            Ask me to build a custom itinerary, find the best restaurants, book tours, or suggest
            activities for any day of your trip.
          </p>
        </div>
        <div className="fade-up">
          <AIChat
            title="Excursion Planner"
            subtitle="Tuscany activities, restaurants & day trips"
            systemContext="You are a knowledgeable Tuscany travel concierge helping guests attending McKenna and Jordan Bradley's wedding in Lucca, Italy (May 22, 2027). Guests have free days on May 21, 23, and 24. Help them plan day trips to Pisa (30 min away), Florence (75 min), Siena (1.5 hrs), Cinque Terre (2 hrs), Chianti wine country (1 hr), and local Lucca activities. Suggest specific restaurants, tours, booking links (Viator, GetYourGuide), and practical tips. Be enthusiastic, specific, and helpful. Include estimated prices when relevant."
            placeholder="e.g. Build me a full day itinerary in Florence…"
            suggestions={[
              "Best day trip from Lucca?",
              "Plan a full day in Florence",
              "Wine tours near Lucca",
              "Best restaurants in Lucca",
            ]}
          />
        </div>
      </section>

      {/* Booking resources */}
      <section
        className="py-14 px-6"
        style={{ background: "hsl(var(--burg))" }}
      >
        <div className="max-w-4xl mx-auto">
          <p className="font-kicker text-[0.6rem] tracking-[0.3em] uppercase text-chartreuse text-center mb-6">
            Book Your Experiences
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {bookingResources.map((r) => (
              <a
                key={r.label}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 bg-white/10 border border-white/20 p-4 rounded-sm hover:bg-white/20 transition-colors group"
              >
                <div className="flex-1">
                  <p className="font-kicker text-xs tracking-wide text-chartreuse group-hover:text-white transition-colors mb-0.5">
                    {r.label}
                  </p>
                  <p className="font-body text-xs text-white/60">{r.desc}</p>
                </div>
                <ExternalLink size={12} className="text-white/40 flex-shrink-0 mt-0.5" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
