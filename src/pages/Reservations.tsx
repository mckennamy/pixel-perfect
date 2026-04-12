import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, CheckCircle } from "lucide-react";

const guestSchema = z.object({
  fullName: z.string().min(2, "Full name required"),
  dietaryRestrictions: z.string().optional(),
});

const schema = z.object({
  primaryName: z.string().min(2, "Your full name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Phone number required"),
  guests: z.array(guestSchema).min(1, "Add at least one guest"),
  paymentOption: z.enum(["deposit_50", "full_payment"], {
    errorMap: () => ({ message: "Please select a payment option" }),
  }),
  accommodationPreference: z.enum(["on_site_villa_grabau", "on_site_la_rancera", "off_site"], {
    errorMap: () => ({ message: "Please select an accommodation preference" }),
  }),
  linenService: z.enum(["yes", "no"]).optional(),
  flightArrivalDate: z.string().optional(),
  flightArrivalNumber: z.string().optional(),
  flightArrivalFrom: z.string().optional(),
  flightDepartureDate: z.string().optional(),
  flightDepartureNumber: z.string().optional(),
  flightDepartureTo: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function Reservations() {
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      guests: [{ fullName: "", dietaryRestrictions: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "guests" });
  const accommodationPref = watch("accommodationPreference");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const onSubmit = async (data: FormData) => {
    // Save to localStorage and show confirmation
    const reservations = JSON.parse(localStorage.getItem("wedding_reservations") || "[]");
    const entry = {
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: "pending",
      paid: data.paymentOption === "full_payment" ? "full" : "deposit",
      ...data,
    };
    reservations.push(entry);
    localStorage.setItem("wedding_reservations", JSON.stringify(reservations));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="page-wrapper flex items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-lg animate-invitation-reveal">
          <div className="w-16 h-16 rounded-full bg-chartreuse/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-chartreuse-dark" />
          </div>
          <p className="section-kicker mb-3">You're Officially Invited</p>
          <h1 className="font-display text-4xl italic text-burg mb-4">
            Reservation Received!
          </h1>
          <div className="ornament-divider my-6 mx-auto" style={{ maxWidth: 240 }}>
            <span className="text-gold text-xs">◆</span>
          </div>
          <p className="font-body text-base text-ink-mid leading-relaxed mb-6">
            Thank you so much for reserving your spot at our wedding in Lucca.
            We'll be in touch shortly with payment details and confirmation.
          </p>
          <p className="font-kicker text-[0.6rem] tracking-[0.3em] uppercase text-chartreuse-dark">
            — Becoming Bradley, May 22, 2027 —
          </p>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full font-body text-sm bg-white border border-parchment-d rounded-sm px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-burg/40 placeholder:text-ink-light/50";
  const labelClass = "block font-kicker text-[0.58rem] tracking-widest uppercase text-ink-mid mb-1.5";
  const errorClass = "font-body text-xs text-red-600 mt-1";

  return (
    <div className="page-wrapper" ref={sectionRef}>
      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center text-center py-24 px-6"
        style={{
          background: "linear-gradient(160deg, hsl(346,56%,18%) 0%, hsl(346,56%,10%) 100%)",
        }}
      >
        <p className="section-kicker mb-4">Secure Your Spot</p>
        <h1 className="font-display text-5xl sm:text-6xl italic text-white mb-4">
          Reservations
        </h1>
        <div className="ornament-divider my-4">
          <span className="text-gold text-xs">◆</span>
        </div>
        <p className="font-body text-base italic text-white/65 max-w-lg mt-4">
          Complete the form below to officially reserve your place at our wedding
        </p>
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto px-6 py-16">
        {/* ── Section 1: Contact ── */}
        <div className="fade-up mb-10">
          <div className="flex items-center gap-4 mb-6">
            <p className="section-kicker whitespace-nowrap">01 — Your Details</p>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold)), transparent)" }} />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className={labelClass}>Your Full Name *</label>
              <input {...register("primaryName")} placeholder="McKenna Myers" className={inputClass} />
              {errors.primaryName && <p className={errorClass}>{errors.primaryName.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Email Address *</label>
              <input {...register("email")} type="email" placeholder="you@email.com" className={inputClass} />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Phone Number *</label>
              <input {...register("phone")} placeholder="+1 (317) 555-0100" className={inputClass} />
              {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
            </div>
          </div>
        </div>

        {/* ── Section 2: Party members ── */}
        <div className="fade-up mb-10">
          <div className="flex items-center gap-4 mb-6">
            <p className="section-kicker whitespace-nowrap">02 — Your Party</p>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold)), transparent)" }} />
          </div>
          <div className="flex flex-col gap-4">
            {fields.map((field, i) => (
              <div key={field.id} className="bg-parchment/40 border border-parchment-d p-4 rounded-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-kicker text-[0.55rem] tracking-widest uppercase text-ink-light">
                    Guest {i + 1}
                  </p>
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className="text-ink-light hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input
                      {...register(`guests.${i}.fullName`)}
                      placeholder="Full legal name"
                      className={inputClass}
                    />
                    {errors.guests?.[i]?.fullName && (
                      <p className={errorClass}>{errors.guests[i]?.fullName?.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Dietary Restrictions</label>
                    <input
                      {...register(`guests.${i}.dietaryRestrictions`)}
                      placeholder="Vegetarian, gluten-free, etc."
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ fullName: "", dietaryRestrictions: "" })}
              className="flex items-center gap-2 font-kicker text-[0.58rem] tracking-widest uppercase text-chartreuse-dark border border-chartreuse-dark/40 px-4 py-2.5 hover:bg-chartreuse-dark hover:text-white transition-colors w-full justify-center"
            >
              <Plus size={12} /> Add Guest
            </button>
          </div>
        </div>

        {/* ── Section 3: Payment ── */}
        <div className="fade-up mb-10">
          <div className="flex items-center gap-4 mb-6">
            <p className="section-kicker whitespace-nowrap">03 — Payment</p>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold)), transparent)" }} />
          </div>
          <div className="flex flex-col gap-3">
            {[
              {
                value: "deposit_50",
                label: "Option 1 — 50% Deposit Now",
                sub: "Remaining 50% due 90 days before the wedding (by February 22, 2027)",
              },
              {
                value: "full_payment",
                label: "Option 2 — Pay in Full Now",
                sub: "One-time full payment. No further balance due.",
              },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex items-start gap-4 bg-white border border-parchment-d p-4 rounded-sm cursor-pointer hover:border-burg/40 transition-colors"
              >
                <input
                  type="radio"
                  value={opt.value}
                  {...register("paymentOption")}
                  className="mt-1 accent-burg"
                />
                <div>
                  <p className="font-body text-sm text-ink font-medium">{opt.label}</p>
                  <p className="font-body text-xs text-ink-light">{opt.sub}</p>
                </div>
              </label>
            ))}
          </div>
          {errors.paymentOption && <p className={errorClass}>{errors.paymentOption.message}</p>}
        </div>

        {/* ── Section 4: Accommodations ── */}
        <div className="fade-up mb-10">
          <div className="flex items-center gap-4 mb-6">
            <p className="section-kicker whitespace-nowrap">04 — Accommodation</p>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold)), transparent)" }} />
          </div>
          <div className="flex flex-col gap-3 mb-4">
            {[
              { value: "on_site_villa_grabau", label: "On-Site — Villa Grabau", sub: "Stay at the wedding venue itself" },
              { value: "on_site_la_rancera", label: "On-Site — La Rancera", sub: "Charming Tuscan farmhouse, bridal party adjacent" },
              { value: "off_site", label: "Off-Site", sub: "I'll arrange my own accommodation" },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex items-start gap-4 bg-white border border-parchment-d p-4 rounded-sm cursor-pointer hover:border-burg/40 transition-colors"
              >
                <input
                  type="radio"
                  value={opt.value}
                  {...register("accommodationPreference")}
                  className="mt-1 accent-burg"
                />
                <div>
                  <p className="font-body text-sm text-ink font-medium">{opt.label}</p>
                  <p className="font-body text-xs text-ink-light">{opt.sub}</p>
                </div>
              </label>
            ))}
          </div>
          {errors.accommodationPreference && (
            <p className={errorClass}>{errors.accommodationPreference.message}</p>
          )}

          {/* Linen service (only for on-site) */}
          {(accommodationPref === "on_site_villa_grabau" || accommodationPref === "on_site_la_rancera") && (
            <div className="mt-4">
              <label className={labelClass}>Daily Linen &amp; Towel Change Service?</label>
              <p className="font-body text-xs text-ink-light mb-3">
                Available for an additional charge per night
              </p>
              <div className="flex gap-4">
                {["yes", "no"].map((v) => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={v}
                      {...register("linenService")}
                      className="accent-burg"
                    />
                    <span className="font-body text-sm text-ink capitalize">{v === "yes" ? "Yes, please" : "No, thank you"}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Section 5: Flights ── */}
        <div className="fade-up mb-10">
          <div className="flex items-center gap-4 mb-6">
            <p className="section-kicker whitespace-nowrap">05 — Flight Info</p>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold)), transparent)" }} />
          </div>
          <p className="font-body text-xs italic text-ink-light mb-5">
            Optional — helps us coordinate arrivals and any group transfers.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <p className="font-kicker text-[0.55rem] tracking-widest uppercase text-ink-light sm:col-span-2">
              Arrival
            </p>
            <div>
              <label className={labelClass}>Arrival Date</label>
              <input type="date" {...register("flightArrivalDate")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Flight Number</label>
              <input {...register("flightArrivalNumber")} placeholder="e.g. KL1234" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Flying From</label>
              <input {...register("flightArrivalFrom")} placeholder="e.g. Indianapolis (IND)" className={inputClass} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <p className="font-kicker text-[0.55rem] tracking-widest uppercase text-ink-light sm:col-span-2">
              Departure
            </p>
            <div>
              <label className={labelClass}>Departure Date</label>
              <input type="date" {...register("flightDepartureDate")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Flight Number</label>
              <input {...register("flightDepartureNumber")} placeholder="e.g. AF1823" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Flying To</label>
              <input {...register("flightDepartureTo")} placeholder="e.g. Indianapolis (IND)" className={inputClass} />
            </div>
          </div>
        </div>

        {/* ── Section 6: Notes ── */}
        <div className="fade-up mb-10">
          <div className="flex items-center gap-4 mb-6">
            <p className="section-kicker whitespace-nowrap">06 — Anything Else?</p>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold)), transparent)" }} />
          </div>
          <label className={labelClass}>Notes or Special Requests</label>
          <textarea
            {...register("notes")}
            rows={4}
            placeholder="Accessibility needs, questions, anything we should know…"
            className={inputClass + " resize-none"}
          />
        </div>

        {/* Submit */}
        <div className="fade-up text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="font-kicker text-[0.6rem] tracking-[0.3em] uppercase px-12 py-4 bg-burg text-white hover:bg-burg-mid disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Submitting…" : "Submit My Reservation"}
          </button>
          <p className="font-body text-xs italic text-ink-light mt-4">
            We'll be in touch within 48 hours with payment details and confirmation.
          </p>
        </div>
      </form>
    </div>
  );
}
