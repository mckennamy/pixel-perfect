import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RESERVATIONS_DUE = new Date(2026, 10, 22, 23, 59, 59); // Nov 22, 2026 end of day, local
const WEDDING_DAY = new Date(2027, 4, 22, 0, 0, 0); // May 22, 2027, local

function diffParts(target: Date) {
  const ms = target.getTime() - Date.now();
  if (ms <= 0) return null;
  const totalSeconds = Math.floor(ms / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

type Parts = { days: number; hours: number; minutes: number; seconds: number };

const CountdownCard = ({
  label,
  title,
  target,
  expiredMessage,
  cta,
}: {
  label: string;
  title: string;
  target: Date;
  expiredMessage: string;
  cta?: { to: string; text: string };
}) => {
  const [parts, setParts] = useState<Parts | null>(() => diffParts(target));

  useEffect(() => {
    const timer = window.setInterval(() => setParts(diffParts(target)), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  return (
    <div
      className="px-7 py-8 text-center flex-1"
      style={{
        background: "hsl(var(--parchment))",
        border: "1px solid hsl(var(--burg) / 0.2)",
        boxShadow: "0 4px 24px rgba(28,20,16,0.06)",
      }}
    >
      <p className="kicker mb-2" style={{ color: "hsl(var(--burg))" }}>
        {label}
      </p>
      <p className="font-display italic text-burg text-[clamp(1.3rem,2.2vw,1.75rem)] mb-6" style={{ fontWeight: 300 }}>
        {title}
      </p>

      {parts ? (
        <div className="flex items-start justify-center gap-4 sm:gap-7">
          {[
            { value: parts.days, unit: "Days" },
            { value: parts.hours, unit: "Hours" },
            { value: parts.minutes, unit: "Minutes" },
            { value: parts.seconds, unit: "Seconds" },
          ].map((p) => (
            <div key={p.unit} className="flex flex-col items-center min-w-[2.6rem]">
              <span
                className="font-display text-burg leading-none"
                style={{
                  fontSize: "clamp(1.9rem, 4vw, 3rem)",
                  fontWeight: 300,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {String(p.value).padStart(2, "0")}
              </span>
              <span
                className="kicker mt-2"
                style={{ fontSize: "0.48rem", color: "hsl(var(--stone))" }}
              >
                {p.unit}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="font-body italic text-[1.05rem] text-ink-mid">{expiredMessage}</p>
      )}

      {cta && (
        <Link
          to={cta.to}
          className="inline-block mt-7 px-6 py-2.5 kicker transition-opacity hover:opacity-80"
          style={{
            color: "hsl(var(--parchment))",
            background: "hsl(var(--burg))",
            border: "1px solid hsl(var(--burg))",
          }}
        >
          {cta.text}
        </Link>
      )}
    </div>
  );
};

const Countdown = () => {
  return (
    <section className="pt-12 pb-4 px-6 md:px-10">
      <div className="max-w-4xl mx-auto reveal visible">
        <p className="kicker text-center mb-8" style={{ color: "hsl(var(--burg))" }}>
          Counting Down
        </p>
        <div className="flex flex-col md:flex-row gap-5">
          <CountdownCard
            label="Deadline"
            title="Reservations Due"
            target={RESERVATIONS_DUE}
            expiredMessage="The reservation window has now closed."
            cta={{ to: "/reservations", text: "Reserve Your Stay" }}
          />
          <CountdownCard
            label="Celebration"
            title="The Wedding Day"
            target={WEDDING_DAY}
            expiredMessage="It's the wedding day!"
          />
        </div>
        <div className="rule-full mt-10" />
      </div>
    </section>
  );
};

export default Countdown;
