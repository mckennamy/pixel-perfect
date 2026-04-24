import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { href: "/our-story",      label: "Our Story",      it: "La Nostra Storia",   desc: "Where two souls became one" },
  { href: "/accommodations", label: "Accommodations", it: "Dove Dormire",       desc: "Villas, vineyards & rest" },
  { href: "/travel",         label: "Travel",         it: "Il Viaggio",         desc: "Your passage to Tuscany" },
  { href: "/finer-details",  label: "Finer Details",  it: "I Dettagli",         desc: "Attire, etiquette & charm" },
  { href: "/excursions",     label: "Excursions",     it: "Le Avventure",       desc: "Wander hills & ancient streets" },
  { href: "/faq",            label: "FAQ",            it: "Domande",            desc: "Every wonder, answered" },
  { href: "/reservations",   label: "Reservations",   it: "La Conferma",        desc: "Take your seat at our table" },
];

/* Layered cinematic background — deep oxblood velvet with subtle vignette */
const BG = `
  radial-gradient(ellipse at 30% 20%, hsl(350,55%,18%) 0%, transparent 55%),
  radial-gradient(ellipse at 70% 80%, hsl(350,45%,14%) 0%, transparent 55%),
  linear-gradient(135deg, hsl(350,60%,8%) 0%, hsl(350,55%,12%) 50%, hsl(350,60%,6%) 100%)
`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    document.dispatchEvent(new CustomEvent(open ? "bb:nav:open" : "bb:nav:close"));
  }, [open]);

  if (pathname === "/") return null;

  const close = () => setOpen(false);

  return (
    <>
      {/* ── Navbar bar ── */}
      <nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          height: 64,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2.5rem",
          background: "hsl(42 35% 97%)",   /* warm cream — high contrast for burgundy logo */
          borderBottom: "1px solid hsl(36 25% 82%)",
        }}
      >
        {/* Logo — burgundy on chartreuse-pale */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.65")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <span
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "0.7rem",
              letterSpacing: "0.36em",
              fontWeight: 500,
              textTransform: "uppercase",
              color: "hsl(var(--burg))",
            }}
          >
            B
          </span>
          <div style={{ width: 3, height: 3, borderRadius: "50%", background: "hsl(var(--gold))", opacity: 0.8 }} />
          <span
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "0.7rem",
              letterSpacing: "0.36em",
              fontWeight: 500,
              textTransform: "uppercase",
              color: "hsl(var(--burg))",
            }}
          >
            B
          </span>
        </Link>

        {/* Menu trigger — burgundy lines on pale green */}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          style={{
            width: 40,
            height: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            background: "transparent",
            border: `1px solid ${open ? "hsl(var(--burg))" : "hsl(var(--burg) / 0.3)"}`,
            cursor: "pointer",
            flexShrink: 0,
            transition: "border-color 0.35s",
          }}
        >
          <span
            style={{
              display: "block",
              width: 14,
              height: 1,
              background: open ? "hsl(var(--burg))" : "hsl(var(--burg) / 0.65)",
              transform: open ? "translateY(4px) rotate(45deg)" : "none",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
          <span
            style={{
              display: "block",
              width: 14,
              height: 1,
              background: open ? "hsl(var(--burg))" : "hsl(var(--burg) / 0.65)",
              transform: open ? "translateY(-4px) rotate(-45deg)" : "none",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </button>
      </nav>

      {/* ════════════════════════════════════════════════════════════
          CINEMATIC NAVIGATION OVERLAY
          Two curtain panels split apart, revealing a velvet stage
          with ornamental gold framework and serif Italian typography.
      ═════════════════════════════════════════════════════════════ */}

      {/* TOP CURTAIN — slides up */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          height: "50vh",
          zIndex: 39,
          background: "linear-gradient(180deg, hsl(350,65%,6%) 0%, hsl(350,55%,12%) 100%)",
          transform: open ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.95s cubic-bezier(0.77, 0, 0.175, 1)",
          pointerEvents: "none",
          boxShadow: open ? "0 6px 40px rgba(0,0,0,0.6)" : "none",
        }}
      />
      {/* BOTTOM CURTAIN — slides down */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          bottom: 0, left: 0, right: 0,
          height: "50vh",
          zIndex: 39,
          background: "linear-gradient(0deg, hsl(350,65%,6%) 0%, hsl(350,55%,12%) 100%)",
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.95s cubic-bezier(0.77, 0, 0.175, 1)",
          pointerEvents: "none",
          boxShadow: open ? "0 -6px 40px rgba(0,0,0,0.6)" : "none",
        }}
      />

      {/* CONTENT LAYER — fades + lifts in once curtains meet */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: BG,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: `opacity 0.5s ease ${open ? "0.5s" : "0s"}`,
          overflow: "hidden",
        }}
      >
        {/* Subtle film grain / paper texture */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.18,
            mixBlendMode: "overlay",
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.7  0 0 0 0 0.6  0 0 0 0 0.4  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            pointerEvents: "none",
          }}
        />

        {/* Gold ornamental top frame */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            opacity: open ? 1 : 0,
            transition: `opacity 0.6s ease ${open ? "0.85s" : "0s"}`,
          }}
        >
          <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, hsl(var(--gold)/0.6))" }} />
          <span
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "0.55rem",
              letterSpacing: "0.6em",
              textTransform: "uppercase",
              color: "hsl(var(--gold-light))",
              paddingLeft: "0.6em",
            }}
          >
            Bradley · MMXXVII
          </span>
          <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, hsl(var(--gold)/0.6), transparent)" }} />
        </div>

        {/* Massive ghost watermark — That's Amore in script */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: open ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(1.08)",
            pointerEvents: "none",
            userSelect: "none",
            textAlign: "center",
            opacity: open ? 1 : 0,
            transition: `opacity 1s ease ${open ? "0.7s" : "0s"}, transform 1.4s cubic-bezier(0.16,1,0.3,1) ${open ? "0.6s" : "0s"}`,
          }}
        >
          <span
            style={{
              fontFamily: "Great Vibes, cursive",
              fontSize: "clamp(5rem, 22vw, 18rem)",
              background: "linear-gradient(180deg, hsl(36,55%,68%) 0%, hsl(36,40%,40%) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              opacity: 0.085,
              display: "block",
              whiteSpace: "nowrap",
              lineHeight: 0.95,
              filter: "blur(0.5px)",
            }}
          >
            That's Amore
          </span>
        </div>

        {/* Two-column layout — Index list + Cinematic stage */}
        <div
          style={{
            position: "relative",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "1fr",
            paddingTop: "6.5rem",
            paddingBottom: "4rem",
          }}
          className="nav-grid"
        >
          {/* The Index — vertical menu */}
          <div
            style={{
              padding: "0 clamp(1.5rem, 8vw, 5rem)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Section eyebrow */}
            <div
              style={{
                marginBottom: "2rem",
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(12px)",
                transition: `all 0.6s ease ${open ? "0.9s" : "0s"}`,
              }}
            >
              <span
                style={{
                  fontFamily: "Cinzel, serif",
                  fontSize: "0.5rem",
                  letterSpacing: "0.55em",
                  textTransform: "uppercase",
                  color: "hsl(var(--gold)/0.7)",
                }}
              >
                ❦ &nbsp; L'Indice &nbsp; · &nbsp; The Index &nbsp; ❦
              </span>
            </div>

            {navItems.map((item, i) => {
              const isActive  = pathname === item.href;
              const isHovered = hovered === item.href;
              const lit = isActive || isHovered;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={close}
                  onMouseEnter={() => setHovered(item.href)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    position: "relative",
                    display: "grid",
                    gridTemplateColumns: "2.4rem 1fr auto",
                    alignItems: "baseline",
                    columnGap: "clamp(0.8rem, 2.5vw, 2rem)",
                    padding: "clamp(0.55rem, 1.1vh, 0.95rem) 0",
                    borderBottom: "1px solid rgba(184,154,106,0.12)",
                    textDecoration: "none",
                    opacity: open ? 1 : 0,
                    transform: open
                      ? `translateX(${isHovered ? 18 : 0}px)`
                      : "translateY(20px)",
                    transition: [
                      `opacity 0.65s ease ${1.0 + i * 0.07}s`,
                      `transform 0.7s cubic-bezier(0.16,1,0.3,1) ${1.0 + i * 0.07}s, color 0.3s`,
                    ].join(", "),
                  }}
                >
                  {/* Roman numeral / index */}
                  <span
                    style={{
                      fontFamily: "Cinzel, serif",
                      fontSize: "0.55rem",
                      letterSpacing: "0.32em",
                      textTransform: "uppercase",
                      color: lit ? "hsl(var(--gold-light))" : "rgba(184,154,106,0.35)",
                      fontVariantNumeric: "tabular-nums",
                      transition: "color 0.3s",
                      alignSelf: "center",
                    }}
                  >
                    {["I","II","III","IV","V","VI","VII"][i]}
                  </span>

                  {/* Italian + English stack */}
                  <span style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                    <span
                      style={{
                        fontFamily: "Great Vibes, cursive",
                        fontSize: "clamp(1.4rem, 3.2vw, 2.4rem)",
                        lineHeight: 1,
                        color: lit ? "hsl(36,60%,78%)" : "rgba(184,154,106,0.55)",
                        transition: "color 0.3s, transform 0.3s",
                        transform: lit ? "translateX(4px)" : "none",
                      }}
                    >
                      {item.it}
                    </span>
                    <span
                      style={{
                        fontFamily: "Cormorant Garamond, Georgia, serif",
                        fontStyle: "italic",
                        fontWeight: 300,
                        fontSize: "clamp(2rem, 5.5vw, 3.8rem)",
                        lineHeight: 1,
                        color: lit ? "hsl(42,45%,95%)" : "rgba(250,248,242,0.78)",
                        transition: "color 0.3s",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {item.label}
                    </span>
                  </span>

                  {/* Right side: description + arrow */}
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      opacity: isHovered ? 1 : 0.35,
                      transition: "opacity 0.3s",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "EB Garamond, Georgia, serif",
                        fontStyle: "italic",
                        fontSize: "0.82rem",
                        color: "rgba(250,248,242,0.55)",
                        textAlign: "right",
                        maxWidth: "16rem",
                      }}
                      className="hidden lg:inline"
                    >
                      {item.desc}
                    </span>
                    <span
                      style={{
                        fontFamily: "Cinzel, serif",
                        fontSize: "1.1rem",
                        color: lit ? "hsl(var(--gold-light))" : "hsl(var(--gold)/0.5)",
                        transform: isHovered ? "translateX(6px)" : "translateX(0)",
                        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), color 0.3s",
                      }}
                    >
                      →
                    </span>
                  </span>

                  {/* Hover gold underline */}
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      bottom: -1,
                      left: 0,
                      height: 1,
                      width: isHovered ? "100%" : "0%",
                      background: "linear-gradient(90deg, hsl(var(--gold-light)), hsl(var(--gold)/0.3) 60%, transparent)",
                      transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer signature with ornamental flourish */}
        <div
          style={{
            position: "absolute",
            bottom: "1.5rem",
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.6rem",
            pointerEvents: "none",
            opacity: open ? 1 : 0,
            transition: `opacity 0.6s ease ${open ? "1.5s" : "0s"}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, hsl(var(--gold)/0.5))" }} />
            <span style={{ color: "hsl(var(--gold)/0.7)", fontSize: "0.5rem" }}>✦</span>
            <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, hsl(var(--gold)/0.5), transparent)" }} />
          </div>
          <p
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "0.48rem",
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color: "rgba(184,154,106,0.55)",
              margin: 0,
            }}
          >
            Villa Grabau &nbsp;·&nbsp; Lucca, Toscana &nbsp;·&nbsp; XXII Maggio MMXXVII
          </p>
        </div>
      </div>
    </>
  );
}
