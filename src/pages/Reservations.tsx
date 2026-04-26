import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import EditableText from "@/components/wedding/EditableText";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  linenFrequency: z.enum(["every_day", "select_days"]).optional(),
  linenDays: z.array(z.string()).optional(),
  flightArrivalDate: z.string().optional(),
  flightArrivalNumber: z.string().optional(),
  flightArrivalFrom: z.string().optional(),
  flightDepartureDate: z.string().optional(),
  flightDepartureNumber: z.string().optional(),
  flightDepartureTo: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full font-body text-sm bg-white px-3 py-3 focus:outline-none placeholder:text-[hsl(var(--stone-light))] text-[hsl(var(--ink))]";
const inputWrap = "border border-[hsl(var(--border))] focus-within:border-[hsl(var(--burg-mid))] transition-colors";
const errorClass = "font-body text-xs mt-1" + " text-red-600";

export default function Reservations() {
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
  const linenService = watch("linenService");
  const linenFrequency = watch("linenFrequency");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (e) => e.forEach((en) => en.isIntersecting && en.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.from("reservations").insert({
      primary_name: data.primaryName,
      email: data.email,
      phone: data.phone,
      guests: data.guests,
      payment_option: data.paymentOption,
      accommodation_preference: data.accommodationPreference,
      linen_service: data.linenService ?? null,
      linen_frequency: data.linenFrequency ?? null,
      linen_days: data.linenDays ?? null,
      flight_arrival_date: data.flightArrivalDate ?? null,
      flight_arrival_number: data.flightArrivalNumber ?? null,
      flight_arrival_from: data.flightArrivalFrom ?? null,
      flight_departure_date: data.flightDepartureDate ?? null,
      flight_departure_number: data.flightDepartureNumber ?? null,
      flight_departure_to: data.flightDepartureTo ?? null,
      notes: data.notes ?? null,
    });
    if (error) {
      toast.error("Could not submit reservation. Please try again or email us directly.");
      console.error("Reservation submit error:", error);
      return;
    }
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  if (submitted) {
    return (
      <div className="page-wrapper flex items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-lg">
          <EditableText
            id="res-thankyou-kicker"
            defaultContent="Reservation Received"
            tag="p"
            className="kicker mb-8"
          />
          <EditableText
            id="res-thankyou-heading"
            defaultContent="We'll See You in Lucca"
            tag="h1"
            className="font-display italic text-burg leading-none mb-8"
            style={{ fontSize: "clamp(3rem, 8vw, 5rem)", fontWeight: 300 }}
          />
          <span className="rule mb-10 block" />
          <EditableText
            id="res-thankyou-body"
            defaultContent="Thank you for securing your place at our wedding in Lucca, Tuscany. We will be in touch within 48 hours with payment details and confirmation."
            tag="p"
            className="font-body text-base text-ink-mid leading-relaxed mb-8"
          />
          <EditableText
            id="res-thankyou-date"
            defaultContent="Becoming Bradley · May 22, 2027"
            tag="p"
            className="kicker"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" ref={ref}>
      {/* Hero */}
      <header className="pt-28 pb-20 text-center px-6">
        <EditableText
          id="res-hero-kicker"
          defaultContent="Secure Your Place"
          tag="p"
          className="kicker mb-5"
        />
        <EditableText
          id="res-hero-h1"
          defaultContent="Reservations"
          tag="h1"
          className="font-display italic text-burg leading-none mb-8"
          style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)", fontWeight: 300 }}
        />
        <span className="rule" />
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto px-6 pb-24">

        {/* ── 01: Your Details ── */}
        <div className="reveal mb-14">
          <EditableText id="res-section-01" defaultContent="01 — Your Details" tag="p" className="kicker mb-2" />
          <div className="rule-full mb-8" />
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <p className="kicker mb-2">Your Full Name</p>
              <div className={inputWrap}>
                <input {...register("primaryName")} placeholder="McKenna Myers" className={inputClass} />
              </div>
              {errors.primaryName && <p className={errorClass}>{errors.primaryName.message}</p>}
            </div>
            <div>
              <p className="kicker mb-2">Email Address</p>
              <div className={inputWrap}>
                <input {...register("email")} type="email" placeholder="you@email.com" className={inputClass} />
              </div>
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>
            <div>
              <p className="kicker mb-2">Phone Number</p>
              <div className={inputWrap}>
                <input {...register("phone")} placeholder="+1 (317) 555-0100" className={inputClass} />
              </div>
              {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
            </div>
          </div>
        </div>

        {/* ── 02: Your Party ── */}
        <div className="reveal mb-14">
          <EditableText id="res-section-02" defaultContent="02 — Your Party" tag="p" className="kicker mb-2" />
          <div className="rule-full mb-8" />
          <div className="space-y-4">
            {fields.map((field, i) => (
              <div key={field.id} style={{ background: "hsl(var(--parchment))", border: "1px solid hsl(var(--border))" }} className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="kicker">Guest {i + 1}</p>
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className="font-body text-xs text-[hsl(var(--stone))] hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="kicker mb-2">Full Name</p>
                    <div className={inputWrap}>
                      <input {...register(`guests.${i}.fullName`)} placeholder="Full legal name" className={inputClass} />
                    </div>
                    {errors.guests?.[i]?.fullName && (
                      <p className={errorClass}>{errors.guests[i]?.fullName?.message}</p>
                    )}
                  </div>
                  <div>
                    <p className="kicker mb-2">Dietary Restrictions</p>
                    <div className={inputWrap}>
                      <input {...register(`guests.${i}.dietaryRestrictions`)} placeholder="Vegetarian, gluten-free…" className={inputClass} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ fullName: "", dietaryRestrictions: "" })}
              className="w-full kicker py-3 transition-colors"
              style={{ border: "1px solid hsl(var(--border))", color: "hsl(var(--chart-mid))" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "hsl(var(--chart))")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "hsl(var(--border))")}
            >
              + Add Guest
            </button>
          </div>
        </div>

        {/* ── 03: Payment ── */}
        <div className="reveal mb-14">
          <EditableText id="res-section-03" defaultContent="03 — Payment" tag="p" className="kicker mb-2" />
          <div className="rule-full mb-8" />
          <div className="space-y-3">
            {[
              {
                value: "deposit_50",
                label: "Option 1 — 50% Deposit Now",
                sub: "Remaining 50% due by February 22, 2027 (90 days before the wedding)",
              },
              {
                value: "full_payment",
                label: "Option 2 — Pay in Full",
                sub: "One complete payment. No further balance due.",
              },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex items-start gap-4 p-5 cursor-pointer transition-colors"
                style={{ border: "1px solid hsl(var(--border))", background: "hsl(var(--parchment))" }}
              >
                <input
                  type="radio"
                  value={opt.value}
                  {...register("paymentOption")}
                  className="mt-1 accent-[hsl(var(--burg))]"
                  style={{ accentColor: "hsl(var(--burg))" }}
                />
                <div>
                  <p className="font-body text-sm text-[hsl(var(--ink))]">{opt.label}</p>
                  <p className="font-body text-xs italic text-[hsl(var(--stone))]">{opt.sub}</p>
                </div>
              </label>
            ))}
          </div>
          {errors.paymentOption && <p className={errorClass}>{errors.paymentOption.message}</p>}
        </div>

        {/* ── 04: Accommodation ── */}
        <div className="reveal mb-14">
          <EditableText id="res-section-04" defaultContent="04 — Accommodation" tag="p" className="kicker mb-2" />
          <div className="rule-full mb-8" />
          <div className="space-y-3 mb-6">
            {[
              { value: "on_site_villa_grabau", label: "On-Site — Villa Grabau", sub: "Stay at the wedding venue itself" },
              { value: "on_site_la_rancera",   label: "On-Site — La Rancera",   sub: "Charming Tuscan farmhouse adjacent to the bridal party" },
              { value: "off_site",             label: "Off-Site",               sub: "I will arrange my own accommodation" },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex items-start gap-4 p-5 cursor-pointer transition-colors"
                style={{ border: "1px solid hsl(var(--border))", background: "hsl(var(--parchment))" }}
              >
                <input
                  type="radio"
                  value={opt.value}
                  {...register("accommodationPreference")}
                  className="mt-1"
                  style={{ accentColor: "hsl(var(--burg))" }}
                />
                <div>
                  <p className="font-body text-sm text-[hsl(var(--ink))]">{opt.label}</p>
                  <p className="font-body text-xs italic text-[hsl(var(--stone))]">{opt.sub}</p>
                </div>
              </label>
            ))}
          </div>
          {errors.accommodationPreference && (
            <p className={errorClass}>{errors.accommodationPreference.message}</p>
          )}

          {(accommodationPref === "on_site_villa_grabau" || accommodationPref === "on_site_la_rancera") && (
            <div className="mt-6 p-5" style={{ border: "1px solid hsl(var(--border))" }}>
              <p className="kicker mb-1">Linen & Towel Service</p>
              <p className="font-body text-xs italic text-[hsl(var(--stone))] mb-4">
                Available for an additional charge — select your preferred frequency
              </p>
              <div className="flex gap-6 mb-4">
                {[
                  { value: "yes", label: "Yes, please" },
                  { value: "no",  label: "No, thank you" },
                ].map((v) => (
                  <label key={v.value} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value={v.value} {...register("linenService")} style={{ accentColor: "hsl(var(--burg))" }} />
                    <span className="font-body text-sm text-[hsl(var(--ink))]">{v.label}</span>
                  </label>
                ))}
              </div>

              {linenService === "yes" && (
                <div className="mt-2 pt-4" style={{ borderTop: "1px solid hsl(var(--border))" }}>
                  <p className="kicker mb-3">How Often?</p>
                  <div className="flex gap-6 mb-4">
                    {[
                      { value: "every_day",    label: "Every day" },
                      { value: "select_days",  label: "Select specific days" },
                    ].map((v) => (
                      <label key={v.value} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" value={v.value} {...register("linenFrequency")} style={{ accentColor: "hsl(var(--burg))" }} />
                        <span className="font-body text-sm text-[hsl(var(--ink))]">{v.label}</span>
                      </label>
                    ))}
                  </div>

                  {linenFrequency === "select_days" && (
                    <div className="mt-2">
                      <p className="kicker mb-3" style={{ fontSize: "0.48rem" }}>Select days (May 19–25)</p>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { value: "mon", label: "Mon · 19" },
                          { value: "tue", label: "Tue · 20" },
                          { value: "wed", label: "Wed · 21" },
                          { value: "thu", label: "Thu · 22" },
                          { value: "fri", label: "Fri · 23" },
                          { value: "sat", label: "Sat · 24" },
                          { value: "sun", label: "Sun · 25" },
                        ].map((d) => (
                          <label
                            key={d.value}
                            className="flex items-center gap-2 cursor-pointer px-3 py-2 transition-colors"
                            style={{ border: "1px solid hsl(var(--border))", background: "hsl(var(--parchment))" }}
                          >
                            <input
                              type="checkbox"
                              value={d.value}
                              {...register("linenDays")}
                              style={{ accentColor: "hsl(var(--burg))" }}
                            />
                            <span className="kicker" style={{ fontSize: "0.5rem" }}>{d.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── 05: Flights ── */}
        <div className="reveal mb-14">
          <EditableText id="res-section-05" defaultContent="05 — Flight Information" tag="p" className="kicker mb-2" />
          <div className="rule-full mb-2" />
          <p className="font-body text-xs italic text-[hsl(var(--stone))] mb-8">
            Optional — helps us coordinate arrivals and any group transfers.
          </p>

          <div className="mb-8">
            <p className="kicker mb-4">Arrival</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="kicker mb-2">Date</p>
                <div className={inputWrap}>
                  <input type="date" {...register("flightArrivalDate")} className={inputClass} />
                </div>
              </div>
              <div>
                <p className="kicker mb-2">Flight Number</p>
                <div className={inputWrap}>
                  <input {...register("flightArrivalNumber")} placeholder="e.g. KL1234" className={inputClass} />
                </div>
              </div>
              <div className="sm:col-span-2">
                <p className="kicker mb-2">Flying From</p>
                <div className={inputWrap}>
                  <input {...register("flightArrivalFrom")} placeholder="e.g. Indianapolis (IND)" className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="kicker mb-4">Departure</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="kicker mb-2">Date</p>
                <div className={inputWrap}>
                  <input type="date" {...register("flightDepartureDate")} className={inputClass} />
                </div>
              </div>
              <div>
                <p className="kicker mb-2">Flight Number</p>
                <div className={inputWrap}>
                  <input {...register("flightDepartureNumber")} placeholder="e.g. AF1823" className={inputClass} />
                </div>
              </div>
              <div className="sm:col-span-2">
                <p className="kicker mb-2">Flying To</p>
                <div className={inputWrap}>
                  <input {...register("flightDepartureTo")} placeholder="e.g. Indianapolis (IND)" className={inputClass} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 06: Notes ── */}
        <div className="reveal mb-14">
          <EditableText id="res-section-06" defaultContent="06 — Anything Else?" tag="p" className="kicker mb-2" />
          <div className="rule-full mb-8" />
          <p className="kicker mb-2">Notes or Special Requests</p>
          <div className={inputWrap}>
            <textarea
              {...register("notes")}
              rows={4}
              placeholder="Accessibility needs, questions, anything we should know…"
              className={inputClass + " resize-none"}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="reveal text-center">
          <div className="rule-full mb-10" />
          <button
            type="submit"
            disabled={isSubmitting}
            className="kicker inline-block px-14 py-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "hsl(var(--burg))",
              color: "hsl(var(--cream))",
            }}
            onMouseEnter={e => !isSubmitting && ((e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--burg-mid))")}
            onMouseLeave={e => !isSubmitting && ((e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--burg))")}
          >
            {isSubmitting ? "Submitting…" : "Submit Reservation"}
          </button>
          <EditableText
            id="res-submit-note"
            defaultContent="We will be in touch within 48 hours with payment details and confirmation."
            tag="p"
            className="font-body text-xs italic text-[hsl(var(--stone))] mt-6"
          />
        </div>
      </form>
    </div>
  );
}
