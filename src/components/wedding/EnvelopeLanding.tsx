import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditableText from "@/components/wedding/EditableText";

type Stage = "idle" | "opening" | "risen" | "invitation" | "exit";

// Background used for both stages — deep burgundy radial spotlight
const BG = `radial-gradient(ellipse at 50% 42%, hsl(350,65%,19%) 0%, hsl(350,72%,12%) 45%, hsl(350,80%,8%) 100%)`;

export default function EnvelopeLanding() {
  const [stage, setStage] = useState<Stage>("idle");
  const navigate = useNavigate();

  useEffect(() => {
    if (stage === "opening") {
      const t = setTimeout(() => setStage("risen"), 1800);
      return () => clearTimeout(t);
    }
    if (stage === "risen") {
      const t = setTimeout(() => setStage("invitation"), 700);
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
        style={{ background: BG }}
      >
        <div className="min-h-full flex items-start md:items-center justify-center py-10 px-4">
          <div
            className="invitation-entering w-full"
            style={{
              maxWidth: 460,
              opacity: stage === "exit" ? 0 : 1,
              transition: "opacity 0.7s ease",
            }}
          >
            {/* The invitation card */}
            <div
              style={{
                background: "#FAF8F2",
                border: "1px solid rgba(184,154,106,0.28)",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.4), 0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(184,154,106,0.08)",
                padding: "3rem 2.5rem",
                textAlign: "center",
              }}
            >
              {/* Monogram rule */}
              <div className="flex items-center gap-4 mb-10">
                <div className="flex-1 h-px" style={{ background: "rgba(184,154,106,0.35)" }} />
                <span className="font-script" style={{ fontSize: "1.75rem", color: "hsl(var(--gold))", lineHeight: 1 }}>
                  B
                </span>
                <div className="flex-1 h-px" style={{ background: "rgba(184,154,106,0.35)" }} />
              </div>

              <p className="kicker mb-10" style={{ textTransform: "lowercase" }}>becoming bradley</p>

              <p
                style={{
                  fontFamily: "Cinzel, serif",
                  fontSize: "0.58rem",
                  letterSpacing: "0.18em",
                  textTransform: "lowercase",
                  color: "hsl(var(--stone))",
                  marginBottom: "0.25rem",
                }}
              >
                <EditableText id="invite-honour" tag="span" defaultContent="The honour of your presence" />
              </p>
              <p
                style={{
                  fontFamily: "Cinzel, serif",
                  fontSize: "0.58rem",
                  letterSpacing: "0.18em",
                  textTransform: "lowercase",
                  color: "hsl(var(--stone))",
                  marginBottom: "2.5rem",
                }}
              >
                <EditableText id="invite-requested" tag="span" defaultContent="is requested at the marriage of" />
              </p>

              <EditableText
                id="invite-bride"
                tag="p"
                className="font-display italic text-burg"
                style={{ fontSize: "clamp(2rem, 8vw, 3rem)", fontWeight: 400, lineHeight: 1.1 }}
                defaultContent="McKenna Myers"
              />
              <p
                style={{
                  fontFamily: "Cinzel, serif",
                  fontSize: "0.55rem",
                  letterSpacing: "0.35em",
                  textTransform: "lowercase",
                  color: "hsl(var(--stone))",
                  margin: "1rem 0",
                }}
              >
                and
              </p>
              <EditableText
                id="invite-groom"
                tag="p"
                className="font-display italic text-burg"
                style={{ fontSize: "clamp(2rem, 8vw, 3rem)", fontWeight: 400, lineHeight: 1.1 }}
                defaultContent="Jordan Bradley"
              />

              <div className="mx-auto my-8" style={{ width: 40, height: 1, background: "rgba(184,154,106,0.5)" }} />

              <p
                style={{
                  fontFamily: "Cinzel, serif",
                  fontSize: "0.6rem",
                  letterSpacing: "0.22em",
                  textTransform: "lowercase",
                  color: "hsl(var(--ink-mid))",
                  marginBottom: "0.25rem",
                }}
              >
                <EditableText id="invite-date-line1" tag="span" defaultContent="Thursday, the Twenty-Second of May" />
              </p>
              <p
                style={{
                  fontFamily: "Cinzel, serif",
                  fontSize: "0.6rem",
                  letterSpacing: "0.22em",
                  textTransform: "lowercase",
                  color: "hsl(var(--ink-mid))",
                  marginBottom: "2rem",
                }}
              >
                <EditableText id="invite-date-line2" tag="span" defaultContent="Two Thousand and Twenty-Seven" />
              </p>

              <EditableText
                id="invite-time"
                tag="p"
                className="font-display italic"
                style={{ fontSize: "1.4rem", fontWeight: 400, color: "hsl(var(--ink-mid))" }}
                defaultContent="at six o'clock in the evening"
              />
              <EditableText
                id="invite-sub"
                tag="p"
                className="font-body text-xs italic"
                style={{ color: "hsl(var(--stone))", letterSpacing: "0.06em", marginTop: "0.25rem", marginBottom: "2rem" }}
                defaultContent="Dinner and dancing to follow"
              />

              <div className="mx-auto my-2" style={{ width: 40, height: 1, background: "rgba(184,154,106,0.5)" }} />
              <EditableText
                id="invite-venue"
                tag="p"
                className="font-display italic text-burg mt-6"
                style={{ fontSize: "1.7rem", fontWeight: 400 }}
                defaultContent="Villa Grabau"
              />
              <EditableText
                id="invite-location"
                tag="p"
                className="kicker mt-2 mb-10"
                style={{ color: "hsl(var(--stone))", textTransform: "lowercase" }}
                defaultContent="Lucca · Tuscany · Italy"
              />

              {/* Bottom rule */}
              <div className="flex items-center gap-4 mb-10">
                <div className="flex-1 h-px" style={{ background: "rgba(184,154,106,0.35)" }} />
                <div className="w-1 h-1 rounded-full" style={{ background: "hsl(var(--gold))" }} />
                <div className="flex-1 h-px" style={{ background: "rgba(184,154,106,0.35)" }} />
              </div>

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

  // ── Envelope Scene ───────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 px-6"
      style={{ background: BG }}
    >
      {/* Kicker / branding above envelope */}
      <div
        className="text-center mb-12 transition-all duration-700"
        style={{
          opacity: isOpening ? 0 : 1,
          transform: isOpening ? "translateY(-10px)" : "none",
          pointerEvents: isOpening ? "none" : "auto",
        }}
      >
        <EditableText
          id="envelope-title"
          tag="p"
          className="font-script"
          style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", color: "rgba(184,154,106,0.82)", lineHeight: 1 }}
          defaultContent="Becoming Bradley"
        />
        <EditableText
          id="envelope-date-kicker"
          tag="p"
          className="kicker mt-3"
          style={{ color: "rgba(250,248,242,0.3)" }}
          defaultContent="May 22, 2027 · Lucca, Italy"
        />
      </div>

      {/* The Envelope */}
      <div
        style={{
          width: "min(520px, calc(100vw - 48px))",
          aspectRatio: "520 / 330",
          position: "relative",
          cursor: stage === "idle" ? "pointer" : "default",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.3), 0 16px 48px rgba(0,0,0,0.6), 0 50px 90px rgba(0,0,0,0.3), 0 0 0 1px rgba(200,170,110,0.12)",
        }}
        onClick={() => stage === "idle" && setStage("opening")}
      >
        {/* SVG envelope body — crisp geometry, no CSS border tricks */}
        <svg
          viewBox="0 0 520 330"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
        >
          <defs>
            <linearGradient id="envBody" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%"   stopColor="#FDFBF6" />
              <stop offset="55%"  stopColor="#FAF8F2" />
              <stop offset="100%" stopColor="#F3EDE3" />
            </linearGradient>
          </defs>
          {/* Body */}
          <rect x="0" y="0" width="520" height="330" fill="url(#envBody)" />
          {/* Left fold shadow */}
          <polygon points="0,0 260,185 0,330"    fill="rgba(0,0,0,0.032)" />
          {/* Right fold shadow */}
          <polygon points="520,0 260,185 520,330" fill="rgba(0,0,0,0.032)" />
          {/* Bottom fold shadow — slightly darker (front-facing) */}
          <polygon points="0,330 520,330 260,185" fill="rgba(0,0,0,0.052)" />
          {/* Hairline fold lines — barely perceptible, just like real paper */}
          <line x1="0"   y1="0"   x2="260" y2="185" stroke="rgba(0,0,0,0.065)" strokeWidth="0.6" />
          <line x1="520" y1="0"   x2="260" y2="185" stroke="rgba(0,0,0,0.065)" strokeWidth="0.6" />
          <line x1="0"   y1="330" x2="260" y2="185" stroke="rgba(0,0,0,0.09)"  strokeWidth="0.6" />
          <line x1="520" y1="330" x2="260" y2="185" stroke="rgba(0,0,0,0.09)"  strokeWidth="0.6" />
        </svg>

        {/* Rising card — visible during opening animation */}
        {isOpening && (
          <div
            className="card-rising"
            style={{
              position: "absolute",
              bottom: "8%",
              left: "9%",
              right: "9%",
              zIndex: 5,
            }}
          >
            <div
              style={{
                padding: "1.35rem 1.25rem",
                textAlign: "center",
                background: "#FAF8F2",
                border: "1px solid rgba(184,154,106,0.22)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
              }}
            >
              <p className="kicker mb-1">Becoming Bradley</p>
              <p
                className="font-display italic"
                style={{ fontSize: "1.4rem", color: "hsl(var(--burg))", fontWeight: 300 }}
              >
                McKenna &amp; Jordan
              </p>
              <p
                className="font-body"
                style={{ fontSize: "0.72rem", color: "hsl(var(--stone))", letterSpacing: "0.14em", marginTop: "0.25rem" }}
              >
                May 22, 2027 · Lucca, Italy
              </p>
            </div>
          </div>
        )}

        {/* Envelope flap — clip-path triangle, crisp edges, animated open */}
        <div
          className={isOpening ? "flap-opening" : ""}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "56.1%", // 185 / 330 = fold point
            background: "linear-gradient(178deg, #F7F2EA 0%, #EDE6D8 100%)",
            clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
            transformOrigin: "top center",
            zIndex: isOpening ? 2 : 10,
          }}
        />

        {/* Wax seal — sits on envelope body below fold line */}
        <div
          style={{
            position: "absolute",
            top: "calc(60% - 34px)",
            left: "calc(50% - 34px)",
            width: 68,
            height: 68,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 38% 32%, hsl(350,50%,32%) 0%, hsl(350,70%,18%) 50%, hsl(350,72%,13%) 100%)",
            boxShadow:
              "0 2px 6px rgba(0,0,0,0.45), 0 6px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.18)",
            border: "1.5px solid rgba(184,154,106,0.48)",
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            className="font-script"
            style={{
              fontSize: 34,
              color: "hsl(var(--gold-light))",
              lineHeight: 1,
              textShadow: "0 1px 4px rgba(0,0,0,0.35)",
            }}
          >
            B
          </span>
        </div>
      </div>

      {/* Prompt below envelope */}
      <div
        className="mt-12 text-center transition-all duration-700"
        style={{
          opacity: isOpening ? 0 : 1,
          transform: isOpening ? "translateY(10px)" : "none",
          pointerEvents: isOpening ? "none" : "auto",
        }}
      >
        <EditableText
          id="envelope-invite-prompt"
          tag="p"
          className="font-body italic mb-5"
          style={{ color: "rgba(250,248,242,0.32)", fontSize: "0.875rem" }}
          defaultContent="You have been cordially invited"
        />
        <button
          onClick={() => setStage("opening")}
          className="kicker transition-all"
          style={{ color: "rgba(184,154,106,0.72)" }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(184,154,106,1)")}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(184,154,106,0.72)")}
        >
          Open Invitation
        </button>
      </div>
    </div>
  );
}
