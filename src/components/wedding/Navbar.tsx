import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/our-story", label: "Our Story" },
  { href: "/accommodations", label: "Accommodations" },
  { href: "/travel", label: "Travel" },
  { href: "/finer-details", label: "Finer Details" },
  { href: "/excursions", label: "Excursions" },
  { href: "/faq", label: "FAQ" },
  { href: "/reservations", label: "Reserve Your Spot" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  if (location.pathname === "/") return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-moss-dark/96 backdrop-blur-md border-b border-chartreuse/20">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-kicker text-chartreuse text-xs tracking-[0.3em] uppercase hover:text-chartreuse-mid transition-colors"
        >
          Becoming Bradley
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`font-body text-[0.82rem] tracking-wide transition-colors ${
                location.pathname === link.href
                  ? "text-chartreuse"
                  : "text-white/75 hover:text-chartreuse"
              } ${link.href === "/reservations" ? "border border-chartreuse/50 px-3 py-1 rounded-sm hover:bg-chartreuse/10" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-white/75 hover:text-chartreuse transition-colors p-1"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden bg-moss-dark border-t border-chartreuse/20 px-6 py-5 flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              className={`font-body text-sm tracking-wide transition-colors ${
                location.pathname === link.href
                  ? "text-chartreuse"
                  : "text-white/75 hover:text-chartreuse"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
