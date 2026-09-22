import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Fare = {
  id: string;
  checked_on: string;
  origin: string;
  headline: string;
  routing: string;
  airline: string | null;
  price_low: number | null;
  price_high: number | null;
  note: string | null;
};

const originLabel = (code: string) =>
  code === "IND" ? "Indianapolis (IND)" : code === "ORD" ? "Chicago O'Hare (ORD)" : code;

const priceText = (f: Fare) => {
  if (f.price_low && f.price_high) return `$${f.price_low}–$${f.price_high}`;
  if (f.price_low) return `from ~$${f.price_low}`;
  return "—";
};

export default function FareWatch() {
  const [fares, setFares] = useState<Fare[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("fare_watch")
        .select("*")
        .order("checked_on", { ascending: false })
        .order("origin", { ascending: true })
        .limit(12);
      if (!active) return;
      const rows = (data ?? []) as Fare[];
      const latestDay = rows[0]?.checked_on;
      setFares(rows.filter((r) => r.checked_on === latestDay));
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading || fares.length === 0) return null;

  const dateLabel = new Date(`${fares[0].checked_on}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="mt-8 reveal"
      style={{ background: "hsl(var(--parchment))", border: "1px solid hsl(var(--border))" }}
    >
      <div className="px-6 pt-6 pb-4">
        <p className="kicker mb-2" style={{ color: "hsl(var(--burg))" }}>
          ✦ Today's Best Fares
        </p>
        <p className="font-body text-xs italic text-stone">
          Updated every morning at 8:00 AM · Last checked {dateLabel}
        </p>
      </div>
      <div className="px-6 pb-6 space-y-0">
        {fares.map((f) => (
          <div key={f.id}>
            <div className="rule-full mb-4" />
            <div className="grid md:grid-cols-3 gap-3 mb-4">
              <div>
                <p className="kicker mb-1">{originLabel(f.origin)}</p>
                <p className="font-body text-sm text-ink">{f.headline}</p>
                {f.airline && <p className="font-body text-xs text-stone">{f.airline}</p>}
              </div>
              <div>
                <p className="font-body text-sm text-ink mb-0.5">{f.routing}</p>
                <p className="font-display text-lg text-burg">{priceText(f)}</p>
              </div>
              {f.note && (
                <p className="font-body text-sm italic text-ink-mid leading-relaxed">{f.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div
        className="py-3 px-6"
        style={{ background: "hsl(var(--gold-pale) / 0.5)", borderTop: "1px solid hsl(var(--border))" }}
      >
        <p className="font-body text-xs italic text-stone leading-relaxed">
          Estimates for round-trip travel per person, arriving May 19 and departing May 24–25, 2027. Always confirm
          the live price with the airline before booking.
        </p>
      </div>
    </div>
  );
}
