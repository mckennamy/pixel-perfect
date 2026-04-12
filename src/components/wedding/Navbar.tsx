import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { href: "/our-story",     label: "Our Story" },
  { href: "/accommodations",label: "Accommodations" },
  { href: "/travel",        label: "Travel" },
  { href: "/finer-details", label: "Finer Details" },
  { href: "/excursions",    label: "Excursions" },
  { href: "/faq",           label: "FAQ" },
  { href: "/reservations",  label: "Reserve" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  if (pathname === "/") return null;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{
          background: "hsl(var(--moss))",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="font-kicker text-[0.58rem] tracking-[0.38em] uppercase transition-opacity hover:opacity-70"
            style={{ color: "hsl(var(--chart-mid))" }}
          >
            Becoming Bradley
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="font-kicker text-[0.55rem] tracking-[0.28em] uppercase transition-colors"
                style={{
                  color: pathname === l.href
                    ? "hsl(var(--chart-mid))"
                    : "rgba(250,248,242,0.55)",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "hsl(var(--chart-mid))")}
                onMouseLeave={e => {
                  e.currentTarget.style.color = pathname === l.href
                    ? "hsl(var(--chart-mid))"
                    : "rgba(250,248,242,0.55)";
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <span
              className="block w-5 h-px transition-all duration-300"
              style={{
                background: "rgba(250,248,242,0.6)",
                transform: open ? "translateY(5px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block w-5 h-px transition-all duration-300"
              style={{
                background: "rgba(250,248,242,0.6)",
                opacity: open ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-px transition-all duration-300"
              style={{
                background: "rgba(250,248,242,0.6)",
                transform: open ? "translateY(-5px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 flex"
          onClick={() => setOpen(false)}
        >
          <div
            className="ml-auto w-72 h-full pt-20 px-10 flex flex-col gap-7"
            style={{ background: "hsl(var(--moss))" }}
            onClick={e => e.stopPropagation()}
          >
            {navLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setOpen(false)}
                className="font-kicker text-[0.6rem] tracking-[0.32em] uppercase transition-colors"
                style={{
                  color: pathname === l.href
                    ? "hsl(var(--chart-mid))"
                    : "rgba(250,248,242,0.55)",
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
