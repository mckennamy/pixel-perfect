import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import EditableText from "@/components/wedding/EditableText";

const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  flightArrivalDate: z.string().trim().max(40).optional().or(z.literal("")),
  flightArrivalNumber: z.string().trim().max(40).optional().or(z.literal("")),
  flightArrivalFrom: z.string().trim().max(120).optional().or(z.literal("")),
  flightDepartureDate: z.string().trim().max(40).optional().or(z.literal("")),
  flightDepartureNumber: z.string().trim().max(40).optional().or(z.literal("")),
  flightDepartureTo: z.string().trim().max(120).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full font-body text-sm bg-white border border-[hsl(var(--border))] px-3 py-2.5 focus:outline-none focus:border-[hsl(var(--burg-mid))] placeholder:text-[hsl(var(--stone-light))] text-[hsl(var(--ink))]";
const labelClass = "kicker block mb-2";

export default function Flights() {
  const ref = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const obs = new IntersectionObserver(
      (e) => e.forEach((en) => en.isIntersecting && en.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.from("flight_submissions").insert({
      full_name: data.fullName,
      email: data.email,
      phone: data.phone || null,
      flight_arrival_date: data.flightArrivalDate || null,
      flight_arrival_number: data.flightArrivalNumber || null,
      flight_arrival_from: data.flightArrivalFrom || null,
      flight_departure_date: data.flightDepartureDate || null,
      flight_departure_number: data.flightDepartureNumber || null,
      flight_departure_to: data.flightDepartureTo || null,
      notes: data.notes || null,
    });
    if (error) {
      toast.error("Could not submit flight details. Please try again.");
      console.error("Flight submit error:", error);
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
            id="flights-thankyou-kicker"
            defaultContent="Flight Details Received"
            tag="p"
            className="kicker mb-8"
          />
          <EditableText
            id="flights-thankyou-h1"
            defaultContent="Grazie Mille"
            tag="h1"
            className="font-display italic text-burg leading-none mb-8"
            style={{ fontSize: "clamp(3rem, 8vw, 5rem)", fontWeight: 300 }}
          />
          <span className="rule mb-10 block" />
          <EditableText
            id="flights-thankyou-body"
            tag="p"
            className="font-body text-base text-ink-mid leading-relaxed mb-8"
            defaultContent="Thank you — we have your flight information on file. If anything changes, simply submit again with your updated details and we'll use the most recent."
          />
          <button
            onClick={() => setSubmitted(false)}
            className="kicker px-6 py-3"
            style={{ background: "hsl(var(--burg))", color: "hsl(var(--cream))" }}
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" ref={ref}>
      <header className="pt-28 pb-16 text-center px-6">
        <EditableText
          id="flights-hero-kicker"
          defaultContent="So We Can Plan Your Welcome"
          tag="p"
          className="kicker mb-5"
        />
        <EditableText
          id="flights-hero-h1"
          defaultContent="Flight Details"
          tag="h1"
          className="font-display italic text-burg leading-none mb-8"
          style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)", fontWeight: 300 }}
        />
        <span className="rule" />
        <EditableText
          id="flights-hero-desc"
          tag="p"
          className="font-body text-base md:text-lg italic text-stone leading-relaxed mt-8 max-w-xl mx-auto"
          defaultContent="Already reserved your spot but only just booking your flights? Drop your details here so we can coordinate transportation and welcomes from Pisa or Florence. You don't need to fill in everything — share what you have."
        />
      </header>

      <section className="max-w-2xl mx-auto px-6 md:px-10 pb-24">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="reveal space-y-6 p-6 md:p-10"
          style={{ background: "hsl(var(--parchment))", border: "1px solid hsl(var(--border))" }}
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input className={inputClass} placeholder="Your name" {...register("fullName")} />
              {errors.fullName && <p className="text-xs text-burg mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Email *</label>
              <input type="email" className={inputClass} placeholder="you@email.com" {...register("email")} />
              {errors.email && <p className="text-xs text-burg mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Phone</label>
            <input className={inputClass} placeholder="Optional · helpful for day-of coordination" {...register("phone")} />
          </div>

          <div className="pt-4">
            <p className="font-display italic text-burg text-2xl mb-1" style={{ fontWeight: 300 }}>Arrival</p>
            <p className="font-body text-xs italic text-stone mb-4">Into Pisa (PSA) or Florence (FLR)</p>
            <div className="grid sm:grid-cols-3 gap-5">
              <div>
                <label className={labelClass}>Date</label>
                <input className={inputClass} placeholder="e.g. May 19, 2027" {...register("flightArrivalDate")} />
              </div>
              <div>
                <label className={labelClass}>Flight Number</label>
                <input className={inputClass} placeholder="e.g. AA 234" {...register("flightArrivalNumber")} />
              </div>
              <div>
                <label className={labelClass}>Arriving From</label>
                <input className={inputClass} placeholder="e.g. JFK via LHR" {...register("flightArrivalFrom")} />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <p className="font-display italic text-burg text-2xl mb-1" style={{ fontWeight: 300 }}>Departure</p>
            <p className="font-body text-xs italic text-stone mb-4">When you head home</p>
            <div className="grid sm:grid-cols-3 gap-5">
              <div>
                <label className={labelClass}>Date</label>
                <input className={inputClass} placeholder="e.g. May 24, 2027" {...register("flightDepartureDate")} />
              </div>
              <div>
                <label className={labelClass}>Flight Number</label>
                <input className={inputClass} placeholder="e.g. DL 145" {...register("flightDepartureNumber")} />
              </div>
              <div>
                <label className={labelClass}>Departing To</label>
                <input className={inputClass} placeholder="e.g. JFK" {...register("flightDepartureTo")} />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              className={inputClass}
              rows={3}
              placeholder="Anything we should know — connections, late arrivals, layovers…"
              {...register("notes")}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="kicker w-full py-4 transition-opacity"
            style={{
              background: "hsl(var(--burg))",
              color: "hsl(var(--cream))",
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            {isSubmitting ? "Submitting…" : "Submit Flight Details"}
          </button>
        </form>
      </section>
    </div>
  );
}