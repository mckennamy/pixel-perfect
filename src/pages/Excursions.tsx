import { useEffect, useRef } from "react";
import AIChat from "@/components/wedding/AIChat";
import PhotoPlaceholder from "@/components/wedding/PhotoPlaceholder";
import EditableText from "@/components/wedding/EditableText";

const freeDays = [
  { date: "Wednesday, May 21", note: "Free for guests not attending the Rehearsal Dinner" },
  { date: "Friday, May 23",    note: "The morning after — take it slowly, then venture out" },
  { date: "Saturday, May 24",  note: "Last full day in Tuscany — make it count" },
];

const destinations = [
  {
    name: "Lucca",
    distance: "You are already here",
    highlights: [
      "Walk or cycle the ancient city walls — a 4km loop above the rooftops",
      "Climb the Guinigi Tower with oak trees growing from its summit",
      "Piazza dell'Anfiteatro — a Roman amphitheatre turned perfect oval piazza",
      "Wine tasting at Lucchese wine bars",
      "Browse the daily market at Piazza San Michele",
    ],
    tip: "Rent a bicycle. Cycling the walls at dusk is something you will never forget.",
  },
  {
    name: "Pisa",
    distance: "30 minutes by car or train",
    highlights: [
      "The Leaning Tower — book entry tickets in advance at opapisa.it",
      "Piazza dei Miracoli — cathedral, baptistery, and tower together",
      "Lungarno riverside walk and aperitivo",
    ],
    tip: "Arrive early. The tower is crowded by 10 AM. Book well in advance.",
  },
  {
    name: "Florence",
    distance: "75 minutes by car, 1.5 hours by train",
    highlights: [
      "Uffizi Gallery — Botticelli, da Vinci, Michelangelo",
      "Accademia Gallery — Michelangelo's David",
      "Ponte Vecchio and the Oltrarno neighbourhood",
      "Piazzale Michelangelo at golden hour",
      "Mercato Centrale for lunch",
    ],
    tip: "Pre-book all museums. The Uffizi and Accademia sell out weeks in advance.",
  },
  {
    name: "Chianti Wine Country",
    distance: "1 hour by car",
    highlights: [
      "Private tastings at Chianti Classico estates",
      "Drive the Via Chiantigiana — one of Italy's great scenic roads",
      "Visit the hilltop village of Greve in Chianti",
    ],
    tip: "Book a guided wine tour so everyone can enjoy without worrying about driving.",
  },
  {
    name: "Cinque Terre",
    distance: "2 hours by car",
    highlights: [
      "Hike between the five coastal villages",
      "Fresh seafood and limoncello with a view",
      "Boat tours between Riomaggiore, Vernazza, and Monterosso",
    ],
    tip: "Buy a Cinque Terre card for the train and trails. Start before 9 AM.",
  },
  {
    name: "Siena",
    distance: "1.5 hours by car",
    highlights: [
      "Piazza del Campo — one of the great medieval squares of Europe",
      "Siena Cathedral, among the finest Gothic churches in Italy",
      "Torre del Mangia — climb for sweeping views",
    ],
    tip: "Siena is hillier than it looks. Wear comfortable shoes.",
  },
];

export default function Excursions() {
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
        <EditableText
          id="excursions-hero-kicker"
          defaultContent="Beyond the Wedding"
          tag="p"
          className="kicker mb-5"
        />
        <EditableText
          id="excursions-hero-h1"
          defaultContent="Excursions"
          tag="h1"
          className="font-display italic text-burg leading-none mb-8"
          style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)", fontWeight: 300 }}
        />
        <span className="rule" />
      </header>

      {/* Hero photo */}
      <div className="px-6 md:px-16 mb-24 reveal">
        <PhotoPlaceholder id="excursions-hero" aspect="wide" caption="Tuscany" />
      </div>

      {/* Free days */}
      <section className="py-16 px-6 md:px-10" style={{ background: "hsl(var(--parchment))" }}>
        <div className="max-w-4xl mx-auto">
          <div className="reveal mb-10">
            <EditableText
              id="excursions-freedays-kicker"
              defaultContent="Your Free Days"
              tag="p"
              className="kicker mb-4"
            />
            <EditableText
              id="excursions-freedays-h2"
              defaultContent="Days to Explore"
              tag="h2"
              className="font-display italic text-burg"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}
            />
          </div>
          <div className="space-y-0 reveal">
            {freeDays.map((d, i) => (
              <div key={i}>
                <div className="rule-full mb-4" />
                <div className="grid md:grid-cols-2 gap-2 mb-4">
                  <EditableText
                    id={`excursions-freeday-date-${i}`}
                    tag="p"
                    className="kicker"
                    defaultContent={d.date}
                  />
                  <EditableText
                    id={`excursions-freeday-note-${i + 1}`}
                    tag="p"
                    className="font-body text-sm italic text-stone"
                    defaultContent={d.note}
                  />
                </div>
              </div>
            ))}
            <div className="rule-full" />
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-20">
        <div className="reveal mb-10">
          <EditableText
            id="excursions-destinations-kicker"
            defaultContent="Where to Go"
            tag="p"
            className="kicker mb-4"
          />
          <EditableText
            id="excursions-destinations-h2"
            defaultContent="Destinations Near Lucca"
            tag="h2"
            className="font-display italic text-burg"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}
          />
        </div>
        <div className="space-y-0 reveal">
          {destinations.map((dest, i) => (
            <div key={i}>
              <div className="rule-full mb-6" />
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <EditableText
                    id={`excursions-dest-${i}-name`}
                    defaultContent={dest.name}
                    tag="p"
                    className="font-display italic text-burg text-2xl mb-1"
                    style={{ fontWeight: 300 }}
                  />
                  <EditableText
                    id={`excursions-dest-${i}-distance`}
                    defaultContent={dest.distance}
                    tag="p"
                    className="font-body text-xs text-stone"
                  />
                </div>
                <ul className="space-y-2 md:col-span-2">
                  {dest.highlights.map((h, j) => (
                    <li key={j} className="font-body text-sm text-ink-mid leading-relaxed flex gap-3">
                      <span className="text-stone-light flex-shrink-0 mt-0.5">—</span>
                      <EditableText
                        id={`excursions-dest-${i}-highlight-${j}`}
                        defaultContent={h}
                        tag="span"
                      />
                    </li>
                  ))}
                  <li className="pt-2">
                    <EditableText
                      id={`excursions-tip-${dest.name.toLowerCase().replace(/\s+/g, "-")}`}
                      tag="p"
                      className="font-body text-xs italic text-stone leading-relaxed"
                      defaultContent={dest.tip}
                    />
                  </li>
                </ul>
              </div>
            </div>
          ))}
          <div className="rule-full" />
        </div>
      </section>

      {/* AI planner */}
      <section className="py-20 px-6 md:px-10" style={{ background: "hsl(var(--parchment))" }}>
        <div className="max-w-2xl mx-auto">
          <div className="reveal mb-8">
            <EditableText
              id="excursions-planner-kicker"
              defaultContent="Plan Your Days"
              tag="p"
              className="kicker mb-4"
            />
            <EditableText
              id="excursions-planner-h2"
              defaultContent="Activity Planner"
              tag="h2"
              className="font-display italic text-burg mb-2"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}
            />
            <EditableText
              id="excursions-planner-desc"
              tag="p"
              className="font-body text-sm italic text-stone"
              defaultContent="Ask for a custom itinerary, restaurant recommendations, or help booking activities anywhere in Tuscany."
            />
          </div>
          <div className="reveal">
            <AIChat
              title="Excursion Planner"
              subtitle="Tuscany activities, restaurants & day trips"
              systemContext="You are a Tuscany travel concierge helping guests at McKenna and Jordan Bradley's wedding in Lucca, Italy (May 22, 2027). Free days are May 21, 23, and 24. Help plan day trips to Pisa (30 min), Florence (75 min), Siena (1.5 hrs), Cinque Terre (2 hrs), Chianti (1 hr), and local Lucca activities. Suggest specific restaurants, tours, booking links via Viator and GetYourGuide, and practical tips. Include estimated prices when helpful."
              placeholder="e.g. Build me a full day itinerary in Florence…"
              suggestions={["Best day trip from Lucca?","Plan a day in Florence","Wine tours near Lucca","Best restaurants in Lucca"]}
            />
          </div>
        </div>
      </section>

      {/* Booking links */}
      <section className="py-14 px-6" style={{ background: "hsl(var(--burg))" }}>
        <div className="max-w-3xl mx-auto flex flex-wrap gap-4 justify-center">
          {[
            { label: "Viator", url: "https://www.viator.com" },
            { label: "GetYourGuide", url: "https://www.getyourguide.com" },
            { label: "Uffizi Tickets", url: "https://www.uffizi.it/en/tickets" },
            { label: "Pisa Tower", url: "https://www.opapisa.it" },
            { label: "Trenitalia", url: "https://www.trenitalia.com" },
          ].map((l) => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
              className="kicker px-5 py-2.5 transition-all"
              style={{ border: "1px solid rgba(250,248,242,0.2)", color: "rgba(250,248,242,0.6)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "hsl(var(--chart-mid))")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(250,248,242,0.6)")}
            >
              {l.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
