import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Stage = "idle" | "opening" | "risen" | "invitation" | "exit";

export default function EnvelopeLanding() {
  const [stage, setStage] = useState<Stage>("idle");
  const navigate = useNavigate();

  useEffect(() => {
    if (stage === "opening") {
      const t = setTimeout(() => setStage("risen"), 1400);
      return () => clearTimeout(t);
    }
    if (stage === "risen") {
      const t = setTimeout(() => setStage("invitation"), 600);
      return () => clearTimeout(t);
    }
  }, [stage]);

  const handleEnter = () => {
    setStage("exit");
    setTimeout(() => navigate("/our-story"), 700);
  };

  // ── Formal Invitation ──────────────────────────────────────────
  if (stage === "invitation" || stage === "exit") {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto py-12 px-4"
        style={{
          background: "hsl(var(--moss))",
          opacity: stage === "exit" ? 0 : 1,
          transition: "opacity 0.6s ease",
        }}
      >
        <div
          className="invitation-entering w-full max-w-md mx-auto"
          style={{ maxWidth: 440 }}
        >
          {/* Invitation card */}
          <div
            className="w-full text-center py-14 px-10"
            style={{
              background: "hsl(var(--cream))",
              border: "1px solid hsl(var(--gold) / 0.3)",
              boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
            }}
          >
            {/* Top rule */}
            <div className="flex items-center gap-4 mb-10">
              <div className="flex-1 h-px" style={{ background: "hsl(var(--gold) / 0.4)" }} />
              <span className="font-script text-gold text-xl">B</span>
              <div className="flex-1 h-px" style={{ background: "hsl(var(--gold) / 0.4)" }} />
            </div>

            <p className="kicker text-stone mb-2">Becoming Bradley</p>

            <p className="font-body text-xs tracking-[0.18em] uppercase text-stone mt-6 mb-1">
              The honour of your presence
            </p>
            <p className="font-body text-xs tracking-[0.18em] uppercase text-stone mb-8">
              is requested at the marriage of
            </p>

            <p className="font-display text-4xl italic text-burg leading-tight mb-2">
              McKenna Myers
            </p>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-stone my-3">and</p>
            <p className="font-display text-4xl italic text-burg leading-tight mb-10">
              Jordan Bradley
            </p>

            <div className="h-px mx-auto mb-10" style={{ width: 48, background: "hsl(var(--gold) / 0.5)" }} />

            <p className="font-kicker text-[0.62rem] tracking-[0.22em] uppercase text-ink-mid mb-1">
              Saturday, the Twenty-Second of May
            </p>
            <p className="font-kicker text-[0.62rem] tracking-[0.22em] uppercase text-ink-mid mb-8">
              Two Thousand and Twenty-Seven
            </p>

            <p className="font-display text-xl italic text-ink mb-1">Villa Grabau</p>
            <p className="font-body text-xs tracking-widest uppercase text-stone mb-10">
              Lucca · Tuscany · Italy
            </p>

            <p className="font-body text-sm italic text-stone mb-1">
              Festivities begin at six o'clock in the evening
            </p>
            <p className="font-body text-sm italic text-stone mb-12">
              Dinner and dancing to follow
            </p>

            {/* Bottom rule */}
            <div className="flex items-center gap-4 mb-10">
              <div className="flex-1 h-px" style={{ background: "hsl(var(--gold) / 0.4)" }} />
              <div className="w-1 h-1 rounded-full" style={{ background: "hsl(var(--gold))" }} />
              <div className="flex-1 h-px" style={{ background: "hsl(var(--gold) / 0.4)" }} />
            </div>

            <button
              onClick={handleEnter}
              className="font-kicker text-[0.58rem] tracking-[0.38em] uppercase px-10 py-3 transition-all duration-300"
              style={{
                border: "1px solid hsl(var(--burg))",
                color: "hsl(var(--burg))",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--burg))";
                (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--cream))";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--burg))";
              }}
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Envelope Scene ─────────────────────────────────────────────
  const isOpening = stage === "opening" || stage === "risen";
  const W = 380;
  const H = 260;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: "hsl(var(--moss))" }}
    >
      {/* Subtle background texture lines */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-full"
            style={{
              left: `${(i + 1) * 12.5}%`,
              background: "hsl(var(--cream))",
            }}
          />
        ))}
      </div>

      {/* Tagline */}
      <p
        className="kicker mb-16 transition-opacity duration-500"
        style={{
          color: "hsl(var(--chart-mid) / 0.7)",
          opacity: isOpening ? 0 : 1,
        }}
      >
        Becoming Bradley
      </p>

      {/* Envelope */}
      <div
        style={{ width: W, height: H, position: "relative", cursor: stage === "idle" ? "pointer" : "default" }}
        onClick={() => stage === "idle" && setStage("opening")}
      >
        {/* Body */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, #B8CC1A 0%, #9EAE0E 100%)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          }}
        />

        {/* Left triangle */}
        <div
          className="absolute bottom-0 left-0"
          style={{
            width: 0, height: 0,
            borderStyle: "solid",
            borderWidth: `0 0 ${H * 0.55}px ${W / 2}px`,
            borderColor: `transparent transparent rgba(0,0,0,0.12) transparent`,
          }}
        />
        {/* Right triangle */}
        <div
          className="absolute bottom-0 right-0"
          style={{
            width: 0, height: 0,
            borderStyle: "solid",
            borderWidth: `0 ${W / 2}px ${H * 0.55}px 0`,
            borderColor: `transparent rgba(0,0,0,0.12) transparent transparent`,
          }}
        />

        {/* Wax seal / monogram */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 3, paddingTop: "8%" }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "radial-gradient(circle, hsl(var(--burg-mid)) 0%, hsl(var(--burg)) 100%)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
              border: "1.5px solid rgba(212,184,130,0.35)",
            }}
          >
            <span className="font-script text-gold" style={{ fontSize: 38, lineHeight: 1 }}>
              B
            </span>
          </div>
        </div>

        {/* Flap */}
        <div
          className={isOpening ? "flap-opening" : ""}
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            zIndex: isOpening ? 1 : 4,
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            style={{
              width: 0, height: 0,
              borderStyle: "solid",
              borderWidth: `0 ${W / 2}px ${H * 0.52}px ${W / 2}px`,
              borderColor: `transparent transparent #A8BC10 transparent`,
              filter: "brightness(0.88)",
            }}
          />
        </div>

        {/* Rising card */}
        {isOpening && (
          <div
            className="card-rising absolute left-1/2"
            style={{
              bottom: "25%",
              transform: "translateX(-50%)",
              width: "72%",
              zIndex: 5,
            }}
          >
            <div
              className="py-6 px-5 text-center"
              style={{
                background: "hsl(var(--cream))",
                border: "1px solid hsl(var(--gold) / 0.25)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
              }}
            >
              <p className="kicker mb-2" style={{ color: "hsl(var(--stone))" }}>
                Becoming Bradley
              </p>
              <p className="font-display text-xl italic" style={{ color: "hsl(var(--burg))" }}>
                McKenna & Jordan
              </p>
              <p className="font-body text-xs mt-1" style={{ color: "hsl(var(--stone))", letterSpacing: "0.12em" }}>
                May 22, 2027 · Lucca, Italy
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Open prompt */}
      <div
        className="mt-16 text-center transition-opacity duration-500"
        style={{ opacity: isOpening ? 0 : 1 }}
      >
        <p className="font-body text-sm italic mb-5" style={{ color: "rgba(250,248,242,0.4)" }}>
          You have been cordially invited
        </p>
        <button
          onClick={() => setStage("opening")}
          className="kicker transition-opacity hover:opacity-60"
          style={{ color: "hsl(var(--chart-mid) / 0.8)" }}
        >
          Open Invitation
        </button>
      </div>
    </div>
  );
}
