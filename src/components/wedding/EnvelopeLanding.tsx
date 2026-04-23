import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditableText from "@/components/wedding/EditableText";
import villaPhoto from "@/assets/villa-grabau-photo.png";

type Stage = "idle" | "opening" | "risen" | "invitation" | "exit";

// Background used for both stages — deep burgundy radial spotlight
const BG = `radial-gradient(ellipse at 50% 42%, hsl(350,65%,19%) 0%, hsl(350,72%,12%) 45%, hsl(350,80%,8%) 100%)`;

export default function EnvelopeLanding() {
  const [stage, setStage] = useState<Stage>("idle");
  const navigate = useNavigate();

  useEffect(() => {
    if (stage === "opening") {
      // flap finishes ripping up, then card slides into view
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
        style={{ background: BG }}
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
            {/* The invitation card */}
            <div
              style={{
                background: "#FAF8F2",
                border: "1px solid rgba(184,154,106,0.28)",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.4), 0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(184,154,106,0.08)",
                padding: "1.75rem 2.25rem 3rem",
                textAlign: "center",
              }}
            >
              {/* Villa photo with torn-paper edges */}
              <img
                src={villaPhoto}
                alt="Villa Grabau, Lucca, Italy"
                style={{
                  display: "block",
                  width: "calc(100% + 1rem)",
                  marginLeft: "-0.5rem",
                  marginRight: "-0.5rem",
                  marginBottom: "1.75rem",
                  height: "auto",
                }}
              />

              <EditableText
                id="invite-together"
                tag="p"
                className="font-body"
                style={{
                  fontSize: "1.05rem",
                  color: "hsl(var(--ink-mid))",
                  fontStyle: "normal",
                  marginBottom: "1.25rem",
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
                  color: "hsl(var(--moss))",
                }}
                defaultContent="McKenna Danielle Myers"
              />
              <p
                className="font-script"
                style={{
                  fontSize: "clamp(1.6rem, 6vw, 2rem)",
                  color: "hsl(var(--moss))",
                  margin: "0.1rem 0",
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
                  color: "hsl(var(--moss))",
                  marginBottom: "1.5rem",
                }}
                defaultContent="Jordan Christopher Bradley"
              />

              <EditableText
                id="invite-request-line1"
                tag="p"
                className="font-body"
                style={{ fontSize: "1rem", color: "hsl(var(--ink-mid))", lineHeight: 1.5 }}
                defaultContent="request the pleasure of your company"
              />
              <EditableText
                id="invite-request-line2"
                tag="p"
                className="font-body"
                style={{ fontSize: "1rem", color: "hsl(var(--ink-mid))", lineHeight: 1.5, marginBottom: "1.25rem" }}
                defaultContent="at their wedding celebration"
              />

              <EditableText
                id="invite-on"
                tag="p"
                className="font-body"
                style={{ fontSize: "1rem", color: "hsl(var(--ink-mid))", marginBottom: "0.4rem" }}
                defaultContent="on"
              />
              <EditableText
                id="invite-date-line1"
                tag="p"
                className="font-body"
                style={{ fontSize: "1rem", color: "hsl(var(--ink-mid))", lineHeight: 1.5 }}
                defaultContent="Saturday, the twenty-second of May"
              />
              <EditableText
                id="invite-date-line2"
                tag="p"
                className="font-body"
                style={{ fontSize: "1rem", color: "hsl(var(--ink-mid))", lineHeight: 1.5 }}
                defaultContent="two thousand twenty-seven"
              />
              <EditableText
                id="invite-time"
                tag="p"
                className="font-body"
                style={{ fontSize: "1rem", color: "hsl(var(--ink-mid))", lineHeight: 1.5, marginBottom: "0.75rem" }}
                defaultContent="at four o'clock in the afternoon"
              />

              <EditableText
                id="invite-at"
                tag="p"
                className="font-body"
                style={{ fontSize: "1rem", color: "hsl(var(--ink-mid))", marginBottom: "0.4rem" }}
                defaultContent="at"
              />
              <EditableText
                id="invite-venue"
                tag="p"
                className="font-body"
                style={{ fontSize: "1rem", color: "hsl(var(--ink-mid))", marginBottom: "2rem" }}
                defaultContent="Villa Grabau in Lucca, Italy"
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
          style={{ fontSize: "clamp(2.6rem, 7vw, 3.75rem)", color: "rgba(184,154,106,0.82)", lineHeight: 1 }}
          defaultContent="Becoming Bradley"
        />
        <EditableText
          id="envelope-date-kicker"
          tag="p"
          className="kicker mt-4"
          style={{ color: "rgba(250,248,242,0.4)", fontSize: "0.78rem", letterSpacing: "0.42em" }}
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

        {/* Sliding invitation card — emerges from envelope after the flap rips up */}
        {isOpening && (
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
                style={{ fontSize: "0.72rem", color: "hsl(var(--stone))", letterSpacing: "0.14em", marginTop: "0.25rem" }}
              >
                May 22, 2027 · Lucca, Italy
              </p>
            </div>
          </div>
        )}

        {/* Envelope flap (with seal attached) — rips upward when opened */}
        <div
          className={isOpening ? "flap-rip" : ""}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "56.1%", // 185 / 330 = fold point
            background: "linear-gradient(178deg, #F7F2EA 0%, #EDE6D8 100%)",
            clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
            transformOrigin: "top center",
            zIndex: 10,
          }}
        >
          {/* Wax seal — sits on the flap and rides with it as it rips up */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "62%",
              transform: "translate(-50%, -50%)",
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
          style={{ color: "rgba(250,248,242,0.45)", fontSize: "1.15rem" }}
          defaultContent="You have been cordially invited"
        />
        <button
          onClick={() => setStage("opening")}
          className="kicker transition-all"
          style={{ color: "rgba(184,154,106,0.85)", fontSize: "0.78rem", letterSpacing: "0.42em" }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(184,154,106,1)")}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(184,154,106,0.85)")}
        >
          Click to Open
        </button>
      </div>
    </div>
  );
}
