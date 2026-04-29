import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EditableText from "@/components/wedding/EditableText";
import ItalyFactsBubble from "@/components/wedding/ItalyFactsBubble";

const faqs = [
  {
    category: "The Basics",
    items: [
      { q: "When and where is the wedding?", a: "The ceremony and reception take place on Thursday, May 22, 2027 at Villa Grabau in Lucca, Tuscany, Italy. Festivities begin at 4:00 PM." },
      { q: "Who is invited?", a: "Each invitation is addressed to specific guests. Your invitation will indicate how many seats are reserved for your party. We are not able to accommodate additional guests beyond those listed." },
      { q: "Are children welcome?", a: "We love your little ones — please reach out to us directly so we can best accommodate families. The wedding is an elegant evening event, so we recommend childcare arrangements for younger children if possible." },
      { q: "What is the dress code?", a: "Garden Party Formal. Floor-length gowns or elegant midi dresses for women; suits or sport coats for men. Please avoid white and ivory, which are reserved for the bride." },
      { q: "Help! Do I need to learn Italian?", a: "Not at all — you do not need to be fluent. Most Italians (especially in tourist-friendly cities like Lucca, Pisa, and Florence) speak at least some English, and you will get by perfectly well. That said, locals deeply appreciate when you try, and even a handful of phrases will warm up every interaction. A few to tuck in your back pocket:<br /><br /><strong>Greetings & basics</strong><br />• Ciao — Hi / Bye (informal)<br />• Buongiorno — Good morning / Good day<br />• Buonasera — Good evening<br />• Arrivederci — Goodbye (formal)<br />• Per favore — Please<br />• Grazie / Grazie mille — Thank you / Thanks so much<br />• Prego — You're welcome / Please, go ahead<br />• Scusi — Excuse me (formal)<br />• Sì / No — Yes / No<br /><br /><strong>Helpful questions</strong><br />• Parla inglese? — Do you speak English?<br />• Dov'è il bagno? — Where is the bathroom?<br />• Quanto costa? — How much does it cost?<br />• Il conto, per favore — The check, please<br />• Un caffè, per favore — A coffee, please<br />• Non capisco — I don't understand<br />• Mi scusi, mi sono perso/persa — Excuse me, I'm lost<br /><br /><strong>The essentials</strong><br />• Salute! / Cin cin! — Cheers!<br />• Buon appetito — Enjoy your meal<br />• Bellissimo / Bellissima — Beautiful" },
    ],
  },
  {
    category: "Travel",
    items: [
      { q: "What is the best airport to fly into?", a: "Pisa International Airport (PSA) is the closest — just 30 to 40 minutes from Lucca. Florence Airport (FLR) is also a solid option, approximately 75 minutes away." },
      { q: "How do I get from the airport to Lucca?", a: 'We recommend pre-booking a private transfer directly to Villa Grabau or your accommodation. <a href="https://www.welcomepickups.com/pisa/airport-to-lucca/" target="_blank" rel="noopener noreferrer" style="font-weight:600;color:hsl(var(--burg));text-decoration:underline;text-decoration-color:hsl(var(--gold));text-underline-offset:3px;">Welcome Pickups</a> and <a href="https://www.mydriver.com/" target="_blank" rel="noopener noreferrer" style="font-weight:600;color:hsl(var(--burg));text-decoration:underline;text-decoration-color:hsl(var(--gold));text-underline-offset:3px;">MyDriver</a> are both excellent. The train from <a href="https://www.trenitalia.com/en.html" target="_blank" rel="noopener noreferrer" style="font-weight:600;color:hsl(var(--burg));text-decoration:underline;text-decoration-color:hsl(var(--gold));text-underline-offset:3px;">Trenitalia</a> is also cheap and scenic (€3.60, about 30 minutes) but you will need a taxi from Lucca station.' },
      { q: "When should I arrive and depart?", a: "We recommend arriving by May 19 or 20 to settle in and join the Welcome Party on the evening of May 20. Departure is May 24 or 25. The full week is May 19 through 25." },
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

      {/* Italy Fun Facts + Word of the Day */}
      <ItalyFactsBubble />

      {/* Central hub notice */}
      <div className="max-w-2xl mx-auto px-6 md:px-10 mt-4 mb-12 reveal">
        <div
          className="rounded-md p-6 md:p-7 text-center"
          style={{
            background: "hsl(var(--parchment))",
            border: "1px solid hsl(var(--burg) / 0.25)",
            boxShadow: "0 4px 24px rgba(28,20,16,0.06)",
          }}
        >
          <EditableText
            id="faq-hub-kicker"
            defaultContent="A Living Page"
            tag="p"
            className="kicker mb-3"
            style={{ color: "hsl(var(--burg))" }}
          />
          <EditableText
            id="faq-hub-note"
            defaultContent="Menus, finer details, and other surprises are subject to be added as the planning process continues — this website is your central hub, so check back often."
            tag="p"
            className="font-body italic text-ink-light"
            style={{ fontSize: "0.95rem", lineHeight: 1.7 }}
          />
        </div>
      </div>

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

        {/* Ask a Question */}
        <div className="reveal mt-8 pt-10" style={{ borderTop: "1px solid hsl(var(--border))" }}>
          <AskQuestionForm />
        </div>
      </div>
    </div>
  );
}

const questionSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  question: z.string().trim().min(4, "Please write your question").max(2000),
});

function AskQuestionForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const inputClass =
    "w-full font-body text-sm bg-white border border-[hsl(var(--border))] px-3 py-2.5 focus:outline-none focus:border-[hsl(var(--burg-mid))] placeholder:text-[hsl(var(--stone-light))] text-[hsl(var(--ink))]";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = questionSchema.safeParse({ name, email, phone, question });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    if (!parsed.data.email && !parsed.data.phone) {
      toast.error("Please provide an email or phone so we can reply");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("guest_questions").insert({
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      question: parsed.data.question,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
    setName(""); setEmail(""); setPhone(""); setQuestion("");
  };

  if (submitted) {
    return (
      <div>
        <p className="kicker mb-4">Question Received</p>
        <p className="font-display italic text-burg text-2xl mb-3">Thank you — we'll be in touch soon.</p>
        <p className="font-body text-sm text-ink-mid mb-6">
          We typically respond within 24–48 hours. Have another question?{" "}
          <button
            onClick={() => setSubmitted(false)}
            className="text-burg border-b border-burg/40 hover:border-burg transition-colors pb-0.5"
          >
            Ask another
          </button>
        </p>
      </div>
    );
  }

  return (
    <div>
      <EditableText
        id="faq-contact-kicker"
        defaultContent="Still Have Questions?"
        tag="p"
        className="kicker mb-4"
      />
      <EditableText
        id="faq-contact-tagline"
        tag="p"
        className="font-display italic text-burg text-2xl mb-3"
        defaultContent="Ask us anything."
      />
      <p className="font-body text-sm italic text-ink-mid mb-6">
        Send us your question below and we'll get back to you within 24–48 hours.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className={inputClass}
          placeholder="Your name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          required
        />
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            className={inputClass}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
          />
          <input
            className={inputClass}
            placeholder="Phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={40}
          />
        </div>
        <p className="font-body text-xs italic text-stone -mt-1">
          Provide at least one — whichever you'd prefer we use to reply.
        </p>
        <textarea
          className={inputClass}
          placeholder="Your question *"
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={2000}
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="kicker px-6 py-3 transition-colors disabled:opacity-60"
          style={{ background: "hsl(var(--burg))", color: "hsl(var(--cream))" }}
        >
          {submitting ? "Sending…" : "Send Question"}
        </button>
      </form>
    </div>
  );
}
