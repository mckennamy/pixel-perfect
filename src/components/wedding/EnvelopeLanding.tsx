import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditableText from "@/components/wedding/EditableText";
import villaPhoto from "@/assets/villa-grabau-photo.png";
import villaMotion from "@/assets/villa-grabau-motion.mp4.asset.json";

type Stage = "idle" | "opening" | "risen" | "invitation" | "exit";

export default function EnvelopeLanding() {
  const [stage, setStage] = useState<Stage>("idle");
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (stage === "opening") {
      const t = setTimeout(() => setStage("risen"), 1900);
      return () => clearTimeout(t);
    }
    if (stage === "risen") {
      const t = setTimeout(() => setStage("invitation"), 900);
      return () => clearTimeout(t);
    }
  }, [stage]);

  const handleEnter = () => {
    setStage("exit");
    setTimeout(() => navigate("/our-story"), 750);
  };

  const isOpening = stage === "opening" || stage === "risen";

  // ── Invitation Card ──────────────────────────────────────────────
  if (stage === "invitation" || stage === "exit") {
    return (
      <div
        className="fixed inset-0 overflow-y-auto z-50"
        style={{ background: "hsl(42 35% 97%)" }}
      >
        <div className="min-h-full flex items-start md:items-center justify-center py-10 px-4">
          <div
            className="invitation-entering w-full"
            style={{
              maxWidth: 480,
              opacity: stage === "exit" ? 0 : 1,
              transition: "opacity 0.7s ease",
            }}
          >
            <div
              style={{
                background: "#FAF8F2",
                border: "1px solid rgba(184,154,106,0.28)",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.12), 0 40px 100px rgba(0,0,0,0.18), 0 0 0 1px rgba(184,154,106,0.08)",
                padding: "1.75rem 2.25rem 3rem",
                textAlign: "center",
              }}
            >
              <img
                src={villaPhoto}
                alt="Villa Grabau, Lucca, Italy"
                style={{
                  display: "block",
                  width: "calc(100% + 1rem)",
                  marginLeft: "-0.5rem",
                  marginRight: "-0.5rem",
                  marginBottom: "2rem",
                  height: "auto",
                }}
              />

              <EditableText
                id="invite-together"
                tag="p"
                className="font-body"
                style={{
                  fontSize: "1.05rem",
                  color: "hsl(var(--burg))",
                  marginBottom: "1.5rem",
                  letterSpacing: "0.01em",
                }}
                defaultContent="Together with their families"
              />

              <EditableText
                id="invite-bride"
                tag="p"
                className="font-script"
                style={{
                  fontSize: "clamp(2.2rem, 8vw, 2.9rem)",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  color: "hsl(var(--burg))",
                }}
                defaultContent="McKenna Danielle Myers"
              />
              <p
                className="font-script"
                style={{
                  fontSize: "clamp(1.6rem, 6vw, 2rem)",
                  color: "hsl(var(--burg))",
                  margin: "0.25rem 0",
                  lineHeight: 1.1,
                }}
              >
                &amp;
              </p>
              <EditableText
                id="invite-groom"
                tag="p"
                className="font-script"
                style={{
                  fontSize: "clamp(2.2rem, 8vw, 2.9rem)",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  color: "hsl(var(--burg))",
                  marginBottom: "2rem",
                }}
                defaultContent="Jordan Christopher Bradley"
              />

              <EditableText
                id="invite-request-line1"
                tag="p"
                className="font-body"
                style={{ fontSize: "1rem", color: "hsl(var(--burg))", lineHeight: 1.6 }}
                defaultContent="request the pleasure of your company"
              />
              <EditableText
                id="invite-request-line2"
                tag="p"
                className="font-body"
                style={{ fontSize: "1rem", color: "hsl(var(--burg))", lineHeight: 1.6, marginBottom: "2rem" }}
                defaultContent="at their wedding celebration"
              />

              {/* Date / Time block — generous internal rhythm */}
              <EditableText
                id="invite-on"
                tag="p"
                className="font-body"
                style={{ fontSize: "1rem", color: "hsl(var(--burg))", marginBottom: "0.75rem" }}
                defaultContent="on"
              />
              <EditableText
                id="invite-date-line1"
                tag="p"
                className="font-body"
                style={{ fontSize: "1.05rem", color: "hsl(var(--burg))", lineHeight: 1.5 }}
                defaultContent="Saturday, the twenty-second of May"
              />
              <EditableText
                id="invite-date-line2"
                tag="p"
                className="font-body"
                style={{ fontSize: "1.05rem", color: "hsl(var(--burg))", lineHeight: 1.5, marginBottom: "1.25rem" }}
                defaultContent="two thousand twenty-seven"
              />
              <EditableText
                id="invite-time"
                tag="p"
                className="font-body italic"
                style={{ fontSize: "1rem", color: "hsl(var(--burg))", lineHeight: 1.5, marginBottom: "2.5rem" }}
                defaultContent="at four o'clock in the afternoon"
              />

              <button
                onClick={handleEnter}
                className="kicker inline-block px-12 py-3 transition-all duration-300"
                style={{ border: "1px solid hsl(var(--burg))", color: "hsl(var(--burg))" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--burg))";
                  (e.currentTarget as HTMLButtonElement).style.color = "#FAF8F2";
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
      </div>
    );
  }

  // ── Cinematic Tuscan Landing ─────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Layer 1: Cinematic looping video of Villa Grabau */}
      <video
        src={villaMotion.url}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: mounted ? "scale(1.04)" : "scale(1.12)",
          transition: "transform 14s ease-out",
        }}
      />

      {/* Layer 2: Atmospheric vignette + warmth wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 0%, rgba(20,8,12,0.35) 55%, rgba(20,8,12,0.78) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(40,15,20,0.45) 0%, rgba(40,15,20,0) 30%, rgba(40,15,20,0) 65%, rgba(20,8,12,0.7) 100%)",
        }}
      />

      {/* Layer 3: Film grain */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          opacity: 0.18,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "256px",
        }}
      />

      {/* Layer 4: Content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center h-full px-6"
        style={{
          opacity: isOpening ? 0 : 1,
          transition: "opacity 0.9s ease",
          pointerEvents: isOpening ? "none" : "auto",
        }}
      >
        {/* Top kicker — fades in first */}
        <div
          className="text-center"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(-8px)",
            transition: "opacity 1.6s ease 0.2s, transform 1.6s ease 0.2s",
          }}
        >
          <EditableText
            id="landing-kicker"
            tag="p"
            className="kicker"
            style={{
              color: "rgba(232,210,170,0.78)",
              fontSize: "0.72rem",
              letterSpacing: "0.55em",
            }}
            defaultContent="Lucca, Italy · May MMXXVII"
          />
        </div>

        {/* Hairline gold rule */}
        <div
          className="my-8"
          style={{
            width: mounted ? "8rem" : "0",
            height: 1,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(232,210,170,0.6) 50%, transparent 100%)",
            transition: "width 2s ease 0.6s",
          }}
        />

        {/* Names — the hero */}
        <div
          className="text-center"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 2s ease 0.9s, transform 2s ease 0.9s",
          }}
        >
          <EditableText
            id="landing-bride-first"
            tag="p"
            className="font-script"
            style={{
              fontSize: "clamp(4rem, 11vw, 7.5rem)",
              color: "hsl(42 45% 92%)",
              lineHeight: 0.95,
              textShadow: "0 4px 24px rgba(0,0,0,0.4)",
            }}
            defaultContent="McKenna Danielle Myers"
          />
          <p
            className="font-display italic"
            style={{
              fontSize: "clamp(1.2rem, 2.4vw, 1.6rem)",
              color: "rgba(232,210,170,0.7)",
              margin: "0.6rem 0",
              letterSpacing: "0.1em",
            }}
          >
            and
          </p>
          <EditableText
            id="landing-groom-first"
            tag="p"
            className="font-script"
            style={{
              fontSize: "clamp(4rem, 11vw, 7.5rem)",
              color: "hsl(42 45% 92%)",
              lineHeight: 0.95,
              textShadow: "0 4px 24px rgba(0,0,0,0.4)",
            }}
            defaultContent="Jordan Christopher Bradley"
          />
        </div>

        {/* Hairline gold rule */}
        <div
          className="mt-10 mb-6"
          style={{
            width: mounted ? "4rem" : "0",
            height: 1,
            background: "rgba(232,210,170,0.55)",
            transition: "width 2s ease 1.4s",
          }}
        />

        {/* Subtle prompt */}
        <div
          className="text-center"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 2s ease 1.8s",
          }}
        >
          <EditableText
            id="landing-prompt"
            tag="p"
            className="font-display italic"
            style={{
              color: "rgba(250,248,242,0.72)",
              fontSize: "1.15rem",
              marginBottom: "1.75rem",
              letterSpacing: "0.02em",
            }}
            defaultContent="You are cordially invited"
          />

          <button
            onClick={() => setStage("opening")}
            className="kicker group relative inline-flex items-center gap-3 px-10 py-4 transition-all duration-500"
            style={{
              color: "hsl(42 45% 88%)",
              fontSize: "0.74rem",
              letterSpacing: "0.5em",
              border: "1px solid rgba(232,210,170,0.5)",
              background: "rgba(20,8,12,0.25)",
              backdropFilter: "blur(2px)",
            }}
            onMouseEnter={e => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = "rgba(232,210,170,0.92)";
              b.style.color = "hsl(350 72% 15%)";
              b.style.borderColor = "rgba(232,210,170,0.92)";
              b.style.letterSpacing = "0.55em";
            }}
            onMouseLeave={e => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = "rgba(20,8,12,0.25)";
              b.style.color = "hsl(42 45% 88%)";
              b.style.borderColor = "rgba(232,210,170,0.5)";
              b.style.letterSpacing = "0.5em";
            }}
          >
            Open Invitation
          </button>
        </div>
      </div>

      {/* The Envelope — appears when opening, drifts up out of frame */}
      {isOpening && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center px-6"
          style={{ animation: "envelopeRise 0.6s ease forwards" }}
        >
          <div
            style={{
              width: "min(520px, calc(100vw - 48px))",
              aspectRatio: "520 / 330",
              position: "relative",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.4), 0 16px 48px rgba(0,0,0,0.7), 0 50px 90px rgba(0,0,0,0.4), 0 0 0 1px rgba(200,170,110,0.18)",
            }}
          >
            <svg
              viewBox="0 0 520 330"
              xmlns="http://www.w3.org/2000/svg"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
            >
              <defs>
                <linearGradient id="envBody" x1="0.2" y1="0" x2="0.8" y2="1">
                  <stop offset="0%" stopColor="#A8B560" />
                  <stop offset="55%" stopColor="#8E9C44" />
                  <stop offset="100%" stopColor="#6F7C32" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="520" height="330" fill="url(#envBody)" />
              <polygon points="0,0 260,185 0,330" fill="rgba(0,0,0,0.10)" />
              <polygon points="520,0 260,185 520,330" fill="rgba(0,0,0,0.10)" />
              <polygon points="0,330 520,330 260,185" fill="rgba(0,0,0,0.16)" />
              <line x1="0" y1="0" x2="260" y2="185" stroke="rgba(0,0,0,0.18)" strokeWidth="0.6" />
              <line x1="520" y1="0" x2="260" y2="185" stroke="rgba(0,0,0,0.18)" strokeWidth="0.6" />
              <line x1="0" y1="330" x2="260" y2="185" stroke="rgba(0,0,0,0.22)" strokeWidth="0.6" />
              <line x1="520" y1="330" x2="260" y2="185" stroke="rgba(0,0,0,0.22)" strokeWidth="0.6" />
            </svg>

            {/* Sliding invitation card */}
            <div
              className="invitation-sliding"
              style={{
                position: "absolute",
                bottom: "4%",
                left: "8%",
                right: "8%",
                zIndex: 4,
              }}
            >
              <div
                style={{
                  padding: "1.5rem 1.4rem",
                  textAlign: "center",
                  background: "#FAF8F2",
                  border: "1px solid rgba(184,154,106,0.22)",
                  boxShadow: "0 10px 36px rgba(0,0,0,0.28)",
                }}
              >
                <p className="kicker mb-1">Becoming Bradley</p>
                <p
                  className="font-display italic"
                  style={{ fontSize: "1.5rem", color: "hsl(var(--burg))", fontWeight: 300 }}
                >
                  McKenna &amp; Jordan
                </p>
                <p
                  className="font-body"
                  style={{
                    fontSize: "0.72rem",
                    color: "hsl(var(--stone))",
                    letterSpacing: "0.14em",
                    marginTop: "0.25rem",
                  }}
                >
                  May 22, 2027 · Lucca, Italy
                </p>
              </div>
            </div>

            {/* Envelope flap with seal — seal sits at the bottom point */}
            <div
              className="flap-rip"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "56.1%",
                background: "linear-gradient(178deg, #B0BD66 0%, #7A8838 100%)",
                clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
                transformOrigin: "top center",
                zIndex: 10,
              }}
            >
              {/* Seal centered on the bottom V-point of the flap */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: "-36px",
                  transform: "translateX(-50%)",
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 38% 32%, hsl(350,52%,34%) 0%, hsl(350,72%,19%) 55%, hsl(350,74%,13%) 100%)",
                  boxShadow:
                    "0 2px 6px rgba(0,0,0,0.45), 0 6px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.18)",
                  border: "1.5px solid rgba(184,154,106,0.48)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backfaceVisibility: "hidden",
                }}
              >
                <span
                  className="font-script"
                  style={{
                    fontSize: 36,
                    color: "hsl(var(--gold-light))",
                    lineHeight: 1,
                    textShadow: "0 1px 4px rgba(0,0,0,0.35)",
                  }}
                >
                  B
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
