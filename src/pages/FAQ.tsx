import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    category: "The Basics",
    items: [
      {
        q: "When and where is the wedding?",
        a: "The wedding ceremony and reception will be held on Thursday, May 22, 2027 at Villa Grabau in Lucca, Tuscany, Italy. Festivities begin at 4:00 PM with a cocktail hour, followed by the ceremony at 5:30 PM.",
      },
      {
        q: "Who is invited?",
        a: "Each invitation is addressed to specific guests. Your invitation will indicate how many seats are reserved for your party. We are not able to accommodate additional guests beyond those listed on your invitation.",
      },
      {
        q: "Are children welcome?",
        a: "We love your little ones! Please reach out to us directly so we can best accommodate families. Note that the wedding is an elegant evening event, so we recommend arranging childcare for younger children if possible.",
      },
      {
        q: "What is the dress code?",
        a: "Garden Party Formal — think floor-length gowns or elegant midi dresses for women, suits or sport coats for men. Please avoid white, ivory, and all-black. Full details are on the Finer Details page.",
      },
    ],
  },
  {
    category: "Travel & Logistics",
    items: [
      {
        q: "What are the best airports to fly into?",
        a: "Pisa International Airport (PSA) is the closest airport to Lucca — just 30–40 minutes away. Florence Airport (FLR) is also a solid option, about 75 minutes from Lucca. We recommend flying into Pisa whenever possible.",
      },
      {
        q: "How do I get from the airport to Lucca?",
        a: "We recommend pre-booking a private transfer directly to Villa Grabau or your accommodation. Welcome Pickups and MyDriver are both excellent services. The train from Pisa to Lucca is also cheap and scenic (€3.60, ~30 min) but you'll need a taxi from Lucca station.",
      },
      {
        q: "Do I need a rental car?",
        a: "Not necessarily! If you plan to stay in or near Lucca and use transfers and taxis, a rental car isn't required. However, if you want flexibility to explore Tuscany independently, a car is a wonderful idea.",
      },
      {
        q: "When should I arrive and depart?",
        a: "We recommend arriving by May 19 or 20 to settle in and join the Welcome Party on the evening of May 20. Departure days are May 24 or 25. The full week is May 19–25.",
      },
    ],
  },
  {
    category: "Accommodations",
    items: [
      {
        q: "Where should I stay?",
        a: "A limited number of on-site rooms are available at Villa Grabau and La Rancera — please select your preference on the reservation form. We also recommend boutique hotels and B&Bs within Lucca's walled city, or charming agriturismo properties in the surrounding countryside.",
      },
      {
        q: "Is there a room block at a hotel?",
        a: "We have reserved on-site villa rooms for wedding guests. Details are available on the Accommodations page. For off-site options, we recommend booking early as May in Lucca is a popular time.",
      },
      {
        q: "Can I stay on-site at the venue?",
        a: "Yes! Both Villa Grabau and La Rancera have on-site accommodation available for guests. Indicate your preference on the reservation form. A daily linen and towel change service is available for an additional charge.",
      },
    ],
  },
  {
    category: "Reservations & Payments",
    items: [
      {
        q: "How do I officially RSVP?",
        a: "Please use our Reservations page to complete your booking form. We ask for your party details, accommodation preference, and flight information. An RSVP alone is not a reservation — you'll need to complete the form and submit your deposit.",
      },
      {
        q: "What are the payment options?",
        a: "Option 1: 50% deposit now, with the remaining balance due 90 days before the wedding (February 22, 2027). Option 2: Full payment now. Both options are available on the reservation form.",
      },
      {
        q: "What is the deadline to reserve?",
        a: "Please submit your reservation by [Deadline Date]. Spaces are limited and we want to make sure you're included in our headcounts for accommodation and catering.",
      },
      {
        q: "What if I need to cancel?",
        a: "We understand that plans change. Please contact us directly if you need to cancel or modify your reservation. Refund policies depend on timing — please reach out as early as possible.",
      },
    ],
  },
  {
    category: "The Celebration",
    items: [
      {
        q: "What is the Welcome Party?",
        a: "Our Welcome Party is on Tuesday, May 20 at 7:00 PM at La Rancera. This is a casual, celebratory gathering for all wedding guests — cocktails, appetizers, and a warm Tuscan welcome. Casual cocktail attire.",
      },
      {
        q: "What is the Rehearsal Dinner?",
        a: "The Rehearsal Dinner is a private event on May 21 for the wedding party and immediate family. Invited guests will receive a separate communication with details.",
      },
      {
        q: "Are there excursions planned for free days?",
        a: "Yes! May 21 and May 23–24 are free days. We've put together a full Excursions page with recommended activities near Lucca, Pisa, and Florence — complete with an AI assistant to help you plan. We'll also share curated group activity suggestions closer to the date.",
      },
      {
        q: "Will there be a photographer?",
        a: "Absolutely. We will have a professional photographer and videographer capturing the entire weekend. We ask that during the ceremony itself, guests keep phones away so everyone can be fully present. A photographer will capture every moment for you.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-parchment-d last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className="font-body text-base text-ink group-hover:text-burg transition-colors">
          {q}
        </span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 mt-1 text-burg/60 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-5 pr-8">
          <p className="font-body text-sm text-ink-mid leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
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
          background: "linear-gradient(160deg, hsl(72,38%,20%) 0%, hsl(120,18%,14%) 100%)",
        }}
      >
        <p className="section-kicker mb-4">Questions? We've Got Answers.</p>
        <h1 className="font-display text-5xl sm:text-6xl italic text-white mb-4">
          FAQ
        </h1>
        <div className="ornament-divider my-4">
          <span className="text-gold text-xs">◆</span>
        </div>
        <p className="font-body text-base italic text-white/65 max-w-lg mt-4">
          Everything you need to know about joining us in Lucca
        </p>
      </section>

      {/* FAQ sections */}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        <div className="flex flex-col gap-12">
          {faqs.map((section, i) => (
            <div key={i} className="fade-up">
              <div className="flex items-center gap-4 mb-6">
                <p className="section-kicker whitespace-nowrap">{section.category}</p>
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold)), transparent)" }} />
              </div>
              <div className="bg-white border border-parchment-d rounded-sm shadow-sm px-6 divide-y divide-parchment-d">
                {section.items.map((item, j) => (
                  <FAQItem key={j} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section
        className="py-16 px-6 text-center"
        style={{ background: "hsl(var(--parchment))" }}
      >
        <div className="max-w-xl mx-auto">
          <div className="ornament-divider mb-8 mx-auto" style={{ maxWidth: 280 }}>
            <span className="text-gold text-xs">◆</span>
          </div>
          <p className="font-display text-3xl italic text-burg mb-3">
            Still have questions?
          </p>
          <p className="font-body text-sm text-ink-light mb-6">
            We're always happy to help. Reach out directly and we'll get back to you as soon as possible.
          </p>
          <a
            href="mailto:mckennamyers@example.com"
            className="font-kicker text-[0.6rem] tracking-[0.3em] uppercase px-8 py-3 bg-burg text-white hover:bg-burg-mid transition-colors inline-block"
          >
            Email Us
          </a>
        </div>
      </section>
    </div>
  );
}
