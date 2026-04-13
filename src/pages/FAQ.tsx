import { useState, useEffect, useRef } from "react";
import EditableText from "@/components/wedding/EditableText";

const faqs = [
  {
    category: "The Basics",
    items: [
      { q: "When and where is the wedding?", a: "The ceremony and reception take place on Thursday, May 22, 2027 at Villa Grabau in Lucca, Tuscany, Italy. Festivities begin at 4:00 PM." },
      { q: "Who is invited?", a: "Each invitation is addressed to specific guests. Your invitation will indicate how many seats are reserved for your party. We are not able to accommodate additional guests beyond those listed." },
      { q: "Are children welcome?", a: "We love your little ones — please reach out to us directly so we can best accommodate families. The wedding is an elegant evening event, so we recommend childcare arrangements for younger children if possible." },
      { q: "What is the dress code?", a: "Garden Party Formal. Floor-length gowns or elegant midi dresses for women; suits or sport coats for men. Please avoid white and ivory, which are reserved for the bride." },
    ],
  },
  {
    category: "Travel",
    items: [
      { q: "What is the best airport to fly into?", a: "Pisa International Airport (PSA) is the closest — just 30 to 40 minutes from Lucca. Florence Airport (FLR) is also a solid option, approximately 75 minutes away." },
      { q: "How do I get from the airport to Lucca?", a: "We recommend pre-booking a private transfer directly to Villa Grabau or your accommodation. Welcome Pickups and MyDriver are both excellent. The train from Pisa to Lucca is also cheap and scenic (€3.60, about 30 minutes) but you will need a taxi from Lucca station." },
      { q: "When should I arrive and depart?", a: "We recommend arriving by May 19 or 20 to settle in and join the Welcome Party on the evening of May 20. Departure is May 24 or 25. The full week is May 19 through 25." },
    ],
  },
  {
    category: "Accommodations",
    items: [
      { q: "Where should I stay?", a: "A limited number of on-site rooms are available at Villa Grabau and La Rancera — indicate your preference on the reservation form. We also recommend boutique hotels within Lucca's walled city, or agriturismo properties in the surrounding countryside." },
      { q: "Can I stay on-site?", a: "Yes. Both Villa Grabau and La Rancera offer on-site accommodation. A daily linen and towel change service is available for an additional charge." },
    ],
  },
  {
    category: "Reservations",
    items: [
      { q: "How do I officially RSVP?", a: "Please complete the Reservations form on this website. We ask for your party's details, accommodation preference, and flight information. An RSVP alone is not a reservation — you will need to complete the form and submit your deposit." },
      { q: "What are the payment options?", a: "Option 1: A 50% deposit now, with the remaining balance due 90 days before the wedding (February 22, 2027). Option 2: Full payment now." },
      { q: "What if I need to cancel?", a: "Please contact us directly as soon as possible. Refund policies depend on timing." },
    ],
  },
  {
    category: "The Celebration",
    items: [
      { q: "What is the Welcome Party?", a: "An informal gathering on the evening of May 20 at La Rancera — cocktails, appetizers, and a warm Tuscan welcome for all wedding guests. Cocktail attire." },
      { q: "What about the Rehearsal Dinner?", a: "The Rehearsal Dinner on May 21 is a private event for the wedding party and immediate family. Invited guests will receive a separate communication." },
      { q: "Are there excursions on free days?", a: "May 21 and May 23–24 are free days. We have put together a full Excursions page with recommendations for Lucca, Pisa, Florence, and beyond — complete with an AI planning assistant." },
      { q: "Will phones be allowed during the ceremony?", a: "We ask that guests put phones away during the ceremony so everyone can be fully present. Our photographer will capture every moment beautifully." },
    ],
  },
];

function FAQItem({ id, q, a }: { id: string; q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: "hsl(var(--border))" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-6 py-5 text-left group"
      >
        <EditableText
          id={`${id}-question`}
          tag="span"
          className="font-body text-base text-ink group-hover:text-burg transition-colors"
          defaultContent={q}
        />
        <span
          className="flex-shrink-0 font-display text-xl text-stone-light transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "none", lineHeight: 1 }}
        >
          +
        </span>
      </button>
      {open && (
        <div className="pb-6 pr-10">
          <EditableText
            id={`${id}-answer`}
            tag="p"
            className="font-body text-sm text-ink-mid leading-relaxed"
            defaultContent={a}
          />
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
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
          id="faq-hero-kicker"
          defaultContent="Questions Answered"
          tag="p"
          className="kicker mb-5"
        />
        <EditableText
          id="faq-hero-h1"
          defaultContent="FAQ"
          tag="h1"
          className="font-display italic text-burg leading-none mb-8"
          style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)", fontWeight: 300 }}
        />
        <span className="rule" />
      </header>

      <div className="max-w-2xl mx-auto px-6 md:px-10 pb-24">
        {faqs.map((section, i) => {
          const slug = section.category.toLowerCase().replace(/\s+/g, "-");
          return (
            <section key={i} className="mb-16 reveal">
              <EditableText
                id={`faq-category-${slug}`}
                defaultContent={section.category}
                tag="p"
                className="kicker mb-6"
              />
              <div style={{ borderTop: "1px solid hsl(var(--border))" }}>
                {section.items.map((item, j) => (
                  <FAQItem key={j} id={`faq-${slug}-${j + 1}`} q={item.q} a={item.a} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Contact */}
        <div className="reveal mt-8 pt-10" style={{ borderTop: "1px solid hsl(var(--border))" }}>
          <EditableText
            id="faq-contact-kicker"
            defaultContent="Still Have Questions?"
            tag="p"
            className="kicker mb-4"
          />
          <EditableText
            id="faq-contact-tagline"
            tag="p"
            className="font-display italic text-burg text-2xl mb-4"
            defaultContent="We are always happy to help."
          />
          <a
            href="mailto:hello@becomingbradley.com"
            className="font-body text-sm text-burg border-b border-burg/40 hover:border-burg transition-colors pb-0.5"
          >
            hello@becomingbradley.com
          </a>
        </div>
      </div>
    </div>
  );
}
