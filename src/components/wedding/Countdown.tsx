import { useEffect, useState } from "react";

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
}: {
  label: string;
  title: string;
  target: Date;
  expiredMessage: string;
}) => {
  const [parts, setParts] = useState<Parts | null>(() => diffParts(target));

  useEffect(() => {
    const timer = window.setInterval(() => setParts(diffParts(target)), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  return (
    <div
      className="px-8 py-9 text-center flex-1"
      style={{
        border: "1px solid rgba(212, 180, 122, 0.35)",
        background: "rgba(255, 240, 220, 0.04)",
      }}
    >
      <p
        className="font-kicker text-[0.62rem] tracking-[0.32em] uppercase mb-2"
        style={{ color: "rgba(212, 180, 122, 0.85)" }}
      >
        {label}
      </p>
      <p className="font-display italic text-[clamp(1.4rem,2.4vw,1.9rem)] mb-6" style={{ color: "#F5E8D0" }}>
        {title}
      </p>

      {parts ? (
        <div className="flex items-start justify-center gap-5 sm:gap-8">
          {[
            { value: parts.days, unit: "Days" },
            { value: parts.hours, unit: "Hours" },
            { value: parts.minutes, unit: "Minutes" },
            { value: parts.seconds, unit: "Seconds" },
          ].map((p) => (
            <div key={p.unit} className="flex flex-col items-center min-w-[2.6rem]">
              <span
                className="font-display leading-none tabular-nums"
                style={{
                  fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
                  fontWeight: 300,
                  color: "#F5E8D0",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {String(p.value).padStart(2, "0")}
              </span>
              <span
                className="font-kicker text-[0.52rem] tracking-[0.26em] uppercase mt-2"
                style={{ color: "rgba(248, 243, 236, 0.5)" }}
              >
                {p.unit}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p
          className="font-body italic text-[1.05rem]"
          style={{ color: "rgba(248, 243, 236, 0.75)" }}
        >
          {expiredMessage}
        </p>
      )}
    </div>
  );
};

const Countdown = () => {
  return (
    <section
      className="relative py-20 px-6"
      style={{
        background: "linear-gradient(175deg, #2A0A12 0%, #3A0D1A 55%, #4A1522 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(184,151,90,0.12) 0%, transparent 65%)",
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto">
        <p
          className="font-kicker text-[0.68rem] tracking-[0.3em] uppercase text-center mb-10"
          style={{ color: "rgba(212, 180, 122, 0.8)" }}
        >
          Counting Down
        </p>
        <div className="flex flex-col md:flex-row gap-5 reveal visible">
          <CountdownCard
            label="Deadline"
            title="Reservations Due"
            target={RESERVATIONS_DUE}
            expiredMessage="The reservation window has now closed."
          />
          <CountdownCard
            label="Celebration"
            title="The Wedding Day"
            target={WEDDING_DAY}
            expiredMessage="It's the wedding day!"
          />
        </div>
      </div>
    </section>
  );
};

export default Countdown;
