import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { href: "/our-story",     label: "Our Story",       desc: "The beginning of us" },
  { href: "/accommodations",label: "Accommodations",  desc: "Where you will stay in Tuscany" },
  { href: "/travel",        label: "Travel",          desc: "Getting to Villa Grabau" },
  { href: "/finer-details", label: "Finer Details",   desc: "What to wear and expect" },
  { href: "/excursions",    label: "Excursions",      desc: "Explore Tuscany together" },
  { href: "/faq",           label: "FAQ",             desc: "Every question answered" },
  { href: "/reservations",  label: "Reservations",    desc: "Secure your place with us" },
];

const BG = `radial-gradient(ellipse at 50% 60%, hsl(350,65%,19%) 0%, hsl(350,72%,12%) 45%, hsl(350,80%,8%) 100%)`;

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
          background: "hsl(68, 40%, 93%)",   /* chartreuse-pale — Friday's free-day colour */
          borderBottom: "1px solid hsl(68, 28%, 82%)",
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
              fontSize: "0.56rem",
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color: "hsl(var(--burg))",
            }}
          >
            Becoming
          </span>
          <div style={{ width: 3, height: 3, borderRadius: "50%", background: "hsl(var(--burg-mid))", opacity: 0.4 }} />
          <span
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "0.56rem",
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color: "hsl(var(--burg))",
            }}
          >
            Bradley
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

      {/* ── Full-screen overlay ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: BG,
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: open ? "auto" : "none",
          overflow: "hidden",
        }}
      >
        {/* Giant ghost script watermark — two-line "Becoming Bradley" */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            userSelect: "none",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Great Vibes, cursive",
              fontSize: "clamp(5rem, 22vw, 17rem)",
              color: "rgba(184,154,106,0.048)",
              display: "block",
              whiteSpace: "nowrap",
              lineHeight: 1.05,
            }}
          >
            Becoming
          </span>
          <span
            style={{
              fontFamily: "Great Vibes, cursive",
              fontSize: "clamp(5rem, 22vw, 17rem)",
              color: "rgba(184,154,106,0.048)",
              display: "block",
              whiteSpace: "nowrap",
              lineHeight: 1.05,
              marginTop: "-0.1em",
            }}
          >
            Bradley
          </span>
        </div>

        {/* Nav content */}
        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "5rem clamp(1.5rem, 10vw, 6rem)",
            paddingTop: "5.5rem",
          }}
        >
          {navItems.map((item, i) => {
            const isActive  = pathname === item.href;
            const isHovered = hovered === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={close}
                onMouseEnter={() => setHovered(item.href)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "clamp(1rem, 3vw, 2.5rem)",
                  padding: "clamp(0.6rem, 1.2vh, 1rem) 0",
                  borderBottom: "1px solid rgba(250,248,242,0.07)",
                  textDecoration: "none",
                  opacity: open ? 1 : 0,
                  transform: open
                    ? `translateX(${isHovered ? 14 : 0}px)`
                    : "translateX(-24px)",
                  transition: [
                    `opacity 0.55s ease ${0.32 + i * 0.055}s`,
                    `transform 0.55s cubic-bezier(0.16,1,0.3,1) ${0.32 + i * 0.055}s`,
                  ].join(", "),
                }}
              >
                {/* Number */}
                <span
                  style={{
                    fontFamily: "Cinzel, serif",
                    fontSize: "0.52rem",
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    color: isActive || isHovered
                      ? "rgba(138,158,20,0.7)"
                      : "rgba(250,248,242,0.2)",
                    width: "2rem",
                    flexShrink: 0,
                    transition: "color 0.2s",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Link name */}
                <span
                  style={{
                    fontFamily: "Cormorant Garamond, Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: "clamp(1.7rem, 4.5vw, 3rem)",
                    lineHeight: 1.05,
                    color: isActive
                      ? "hsl(var(--chart-mid))"
                      : isHovered
                      ? "hsl(var(--chart-mid))"
                      : "rgba(250,248,242,0.9)",
                    transition: "color 0.2s",
                  }}
                >
                  {item.label}
                </span>

                {/* Description — hidden on small screens */}
                <span
                  style={{
                    fontFamily: "EB Garamond, Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "0.85rem",
                    color: isHovered
                      ? "rgba(250,248,242,0.45)"
                      : "rgba(250,248,242,0.2)",
                    marginLeft: "auto",
                    transition: "color 0.2s",
                    display: "none",
                  }}
                  className="md:block"
                >
                  {item.desc}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Footer signature */}
        <div
          style={{
            position: "absolute",
            bottom: "1.75rem",
            width: "100%",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <p
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "0.48rem",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "rgba(250,248,242,0.18)",
            }}
          >
            Becoming Bradley &nbsp;·&nbsp; May 22, 2027 &nbsp;·&nbsp; Villa Grabau, Lucca
          </p>
        </div>
      </div>
    </>
  );
}
