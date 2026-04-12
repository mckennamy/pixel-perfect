import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Stage = "idle" | "opening" | "card-risen" | "invitation" | "entering";

export default function EnvelopeLanding() {
  const [stage, setStage] = useState<Stage>("idle");
  const navigate = useNavigate();

  // Chain the animation stages automatically once triggered
  useEffect(() => {
    if (stage === "opening") {
      const t1 = setTimeout(() => setStage("card-risen"), 1200);
      return () => clearTimeout(t1);
    }
    if (stage === "card-risen") {
      const t2 = setTimeout(() => setStage("invitation"), 500);
      return () => clearTimeout(t2);
    }
  }, [stage]);

  const handleOpen = () => {
    if (stage === "idle") setStage("opening");
  };

  const handleEnter = () => {
    setStage("entering");
    setTimeout(() => navigate("/our-story"), 700);
  };

  // ── Invitation card (shown after envelope opens) ──
  if (stage === "invitation" || stage === "entering") {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50 overflow-auto py-10"
        style={{
          background: "radial-gradient(ellipse at center, #1a2416 0%, #0d130a 100%)",
          opacity: stage === "entering" ? 0 : 1,
          transition: "opacity 0.6s ease-in",
        }}
      >
        <div className="animate-invitation-reveal w-[340px] sm:w-[440px] md:w-[520px]">
          {/* Card */}
          <div
            className="relative mx-auto px-10 py-14 text-center shadow-2xl"
            style={{
              background: "linear-gradient(160deg, #FDFAF5 0%, #F5EFE0 100%)",
              border: "1px solid #d4b896",
              boxShadow: "0 30px 80px rgba(0,0,0,0.5), inset 0 0 40px rgba(200,180,140,0.1)",
            }}
          >
            {/* Top ornament */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-16" style={{ background: "linear-gradient(90deg, transparent, #8B3A4F)" }} />
              <span className="text-burg text-xs">✦</span>
              <div className="h-px w-16" style={{ background: "linear-gradient(90deg, #8B3A4F, transparent)" }} />
            </div>

            {/* Tagline */}
            <p className="font-kicker text-[0.55rem] tracking-[0.35em] uppercase text-chartreuse-dark mb-6">
              Becoming Bradley
            </p>

            {/* Formal copy */}
            <p className="font-body text-xs tracking-[0.15em] uppercase text-ink-light mb-3">
              The honour of your presence
            </p>
            <p className="font-body text-xs tracking-[0.15em] uppercase text-ink-light mb-6">
              is requested at the marriage of
            </p>

            <p className="font-display text-3xl sm:text-4xl italic text-burg leading-tight mb-2">
              McKenna Myers
            </p>
            <p className="font-body text-xs tracking-widest uppercase text-ink-light mb-2">&amp;</p>
            <p className="font-display text-3xl sm:text-4xl italic text-burg leading-tight mb-8">
              Jordan Bradley
            </p>

            <div className="ornament-divider my-6">
              <span className="text-gold text-[0.5rem]">◆</span>
            </div>

            <p className="font-kicker text-[0.65rem] tracking-[0.2em] uppercase text-ink-mid mb-1">
              Saturday, the Twenty-Second of May
            </p>
            <p className="font-kicker text-[0.65rem] tracking-[0.2em] uppercase text-ink-mid mb-6">
              Two Thousand and Twenty-Seven
            </p>

            <p className="font-display text-base italic text-ink mb-1">
              Villa Grabau
            </p>
            <p className="font-body text-xs tracking-wider text-ink-light mb-8">
              Lucca, Tuscany, Italy
            </p>

            <p className="font-body text-xs italic text-ink-light mb-1">
              Festivities begin at six o'clock in the evening
            </p>
            <p className="font-body text-xs italic text-ink-light mb-10">
              Dinner and dancing to follow
            </p>

            {/* Bottom ornament */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-16" style={{ background: "linear-gradient(90deg, transparent, #8B3A4F)" }} />
              <span className="text-burg text-xs">✦</span>
              <div className="h-px w-16" style={{ background: "linear-gradient(90deg, #8B3A4F, transparent)" }} />
            </div>

            {/* Enter button */}
            <button
              onClick={handleEnter}
              className="font-kicker text-[0.6rem] tracking-[0.3em] uppercase px-8 py-3 border border-burg text-burg hover:bg-burg hover:text-white transition-all duration-300"
            >
              Enter Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Envelope scene ──
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 60%, #1e2d18 0%, #0d130a 100%)",
      }}
    >
      {/* Stars/particles decoration */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-chartreuse/20"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animation: `seal-pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: Math.random() * 3 + "s",
            }}
          />
        ))}
      </div>

      {/* Top tagline */}
      <p
        className="font-kicker text-[0.6rem] tracking-[0.4em] uppercase text-chartreuse/70 mb-10"
        style={{
          opacity: stage === "opening" ? 0 : 1,
          transition: "opacity 0.4s ease",
        }}
      >
        Becoming Bradley
      </p>

      {/* Envelope wrapper — floats when idle */}
      <div
        style={{
          animation: stage === "idle" ? "envelope-float 3.5s ease-in-out infinite" : "none",
          cursor: stage === "idle" ? "pointer" : "default",
        }}
        onClick={handleOpen}
      >
        {/* Envelope container with 3D perspective */}
        <div
          style={{
            width: "clamp(280px, 45vw, 460px)",
            height: "clamp(190px, 30vw, 310px)",
            position: "relative",
          }}
        >
          {/* ── Envelope body (background) ── */}
          <div
            className="absolute inset-0 rounded-sm"
            style={{
              background: "linear-gradient(145deg, #B8CC1A 0%, #A8BC10 50%, #96AA08 100%)",
              boxShadow: stage === "idle"
                ? "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(168,188,16,0.15)"
                : "0 8px 30px rgba(0,0,0,0.4)",
              transition: "box-shadow 0.5s ease",
            }}
          />

          {/* ── Bottom-left triangle fold ── */}
          <div
            className="absolute bottom-0 left-0"
            style={{
              width: 0,
              height: 0,
              borderStyle: "solid",
              borderWidth: "0 0 clamp(95px,15vw,155px) clamp(140px,22.5vw,230px)",
              borderColor: "transparent transparent #9EAC08 transparent",
              opacity: 0.7,
            }}
          />

          {/* ── Bottom-right triangle fold ── */}
          <div
            className="absolute bottom-0 right-0"
            style={{
              width: 0,
              height: 0,
              borderStyle: "solid",
              borderWidth: "0 clamp(140px,22.5vw,230px) clamp(95px,15vw,155px) 0",
              borderColor: "transparent #9EAC08 transparent transparent",
              opacity: 0.7,
            }}
          />

          {/* ── Cursive B monogram / seal ── */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: 2, marginTop: "10%" }}
          >
            <div
              className="flex items-center justify-center rounded-full animate-seal-pulse"
              style={{
                width: "clamp(56px,9vw,90px)",
                height: "clamp(56px,9vw,90px)",
                background: "radial-gradient(circle, #6B1D2E 0%, #4A0F1E 100%)",
                boxShadow: "0 4px 20px rgba(107,29,46,0.5), inset 0 1px 2px rgba(255,255,255,0.1)",
                border: "2px solid rgba(212,184,150,0.4)",
              }}
            >
              <span
                className="font-script text-gold"
                style={{ fontSize: "clamp(28px,4.5vw,52px)", lineHeight: 1 }}
              >
                B
              </span>
            </div>
          </div>

          {/* ── Envelope FLAP (top triangle) ── */}
          <div
            className={stage === "opening" || stage === "card-risen" ? "envelope-flap-open" : ""}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: stage === "opening" || stage === "card-risen" ? 1 : 3,
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderStyle: "solid",
                borderWidth: `0 clamp(140px,22.5vw,230px) clamp(95px,15vw,155px) clamp(140px,22.5vw,230px)`,
                borderColor: `transparent transparent #A8BC10 transparent`,
                filter: "brightness(0.9)",
              }}
            />
          </div>

          {/* ── Card rising out ── */}
          {(stage === "opening" || stage === "card-risen") && (
            <div
              className="envelope-card-rise absolute left-1/2"
              style={{
                bottom: "30%",
                transform: "translateX(-50%)",
                width: "75%",
                zIndex: 4,
              }}
            >
              <div
                className="py-6 px-4 text-center"
                style={{
                  background: "linear-gradient(160deg, #FDFAF5 0%, #F5EFE0 100%)",
                  border: "1px solid #d4b896",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}
              >
                <p className="font-kicker text-[0.45rem] tracking-[0.25em] uppercase text-chartreuse-dark mb-2">
                  Becoming Bradley
                </p>
                <p className="font-display text-lg italic text-burg">
                  McKenna & Jordan
                </p>
                <p className="font-body text-[0.6rem] tracking-wider text-ink-light mt-1">
                  May 22, 2027 · Lucca, Italy
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click hint */}
      <div
        className="mt-12 text-center"
        style={{
          opacity: stage === "idle" ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        <p className="font-body text-xs italic text-white/50 mb-2">
          You've been cordially invited
        </p>
        <button
          onClick={handleOpen}
          className="font-kicker text-[0.6rem] tracking-[0.3em] uppercase text-chartreuse/80 hover:text-chartreuse transition-colors border border-chartreuse/30 px-6 py-2.5 hover:border-chartreuse/60"
        >
          Open Invitation
        </button>
      </div>
    </div>
  );
}
