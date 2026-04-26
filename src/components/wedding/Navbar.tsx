import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const baseNavItems = [
  { href: "/our-story",        label: "Our Story",         it: "La Nostra Storia" },
  { href: "/accommodations",   label: "Accommodations",    it: "Dove Dormire" },
  { href: "/travel",           label: "Travel",            it: "Il Viaggio" },
  { href: "/finer-details",    label: "Finer Details",     it: "I Dettagli" },
  { href: "/excursions",       label: "Excursions",        it: "Le Avventure" },
  { href: "/faq",              label: "FAQ",               it: "Domande" },
  { href: "/reservations",     label: "Reservations",      it: "La Conferma" },
];
const rehearsalItem = { href: "/rehearsal-dinner", label: "Rehearsal Dinner", it: "La Cena di Prova" };

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [showRehearsal, setShowRehearsal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    document.dispatchEvent(new CustomEvent(open ? "bb:nav:open" : "bb:nav:close"));
  }, [open]);

  useEffect(() => {
    // Show rehearsal tab only for guests on the rehearsal tier
    const stored = sessionStorage.getItem("wedding_guest");
    if (stored) {
      try {
        const g = JSON.parse(stored);
        setShowRehearsal(g?.tier === "rehearsal");
      } catch { /* ignore */ }
    }
  }, [open, pathname]);

  // Show "Admin" link only when signed in as the wedding organizer
  useEffect(() => {
    const checkAdmin = async (userId: string) => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    };
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) checkAdmin(session.user.id);
      else setIsAdmin(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) checkAdmin(session.user.id);
      else setIsAdmin(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (pathname === "/") return null;

  const adminItem = { href: "/admin", label: "Admin", it: "Pannello Privato" };
  let navItems = showRehearsal
    ? [...baseNavItems.slice(0, 6), rehearsalItem, baseNavItems[6]]
    : baseNavItems;
  if (isAdmin) navItems = [...navItems, adminItem];

  const close = () => setOpen(false);

  return (
    <>
      {/* ── Top bar ── */}
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
          background: "hsl(42 35% 97%)",
          borderBottom: "1px solid hsl(36 25% 82%)",
        }}
      >
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
          <span style={{ fontFamily: "Cinzel, serif", fontSize: "0.7rem", letterSpacing: "0.36em", fontWeight: 500, textTransform: "uppercase", color: "hsl(var(--burg))" }}>B</span>
          <div style={{ width: 3, height: 3, borderRadius: "50%", background: "hsl(var(--gold))", opacity: 0.8 }} />
          <span style={{ fontFamily: "Cinzel, serif", fontSize: "0.7rem", letterSpacing: "0.36em", fontWeight: 500, textTransform: "uppercase", color: "hsl(var(--burg))" }}>B</span>
        </Link>

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
          <span style={{ display: "block", width: 14, height: 1, background: open ? "hsl(var(--burg))" : "hsl(var(--burg) / 0.65)", transform: open ? "translateY(4px) rotate(45deg)" : "none", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }} />
          <span style={{ display: "block", width: 14, height: 1, background: open ? "hsl(var(--burg))" : "hsl(var(--burg) / 0.65)", transform: open ? "translateY(-4px) rotate(-45deg)" : "none", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }} />
        </button>
      </nav>

      {/* ── Overlay — soft cream, generous space, single chic column ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "hsl(42 35% 97%)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
        }}
      >
      <div
        style={{
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "6rem 1.5rem 4rem",
          boxSizing: "border-box",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.9rem",
            marginBottom: "3rem",
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(-8px)",
            transition: "all 0.7s ease 0.15s",
          }}
        >
          <div style={{ width: 32, height: 1, background: "hsl(var(--burg) / 0.3)" }} />
          <span style={{ fontFamily: "Cinzel, serif", fontSize: "0.55rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "hsl(var(--burg) / 0.65)" }}>
            Menu
          </span>
          <div style={{ width: 32, height: 1, background: "hsl(var(--burg) / 0.3)" }} />
        </div>

        {/* Nav list */}
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.4rem",
            width: "100%",
            maxWidth: "32rem",
          }}
        >
          {navItems.map((item, i) => {
            const isActive  = pathname === item.href;
            const isHovered = hovered === item.href;
            const lit = isActive || isHovered;

            return (
              <li key={item.href} style={{ width: "100%", textAlign: "center" }}>
                <Link
                  to={item.href}
                  onClick={close}
                  onMouseEnter={() => setHovered(item.href)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: "inline-flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "0.65rem 1rem",
                    textDecoration: "none",
                    opacity: open ? 1 : 0,
                    transform: open ? "translateY(0)" : "translateY(14px)",
                    transition: [
                      `opacity 0.55s ease ${0.25 + i * 0.06}s`,
                      `transform 0.55s cubic-bezier(0.16,1,0.3,1) ${0.25 + i * 0.06}s`,
                    ].join(", "),
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Cormorant Garamond, Georgia, serif",
                      fontStyle: "italic",
                      fontWeight: 300,
                      fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                      lineHeight: 1.1,
                      color: lit ? "hsl(var(--burg))" : "hsl(var(--burg) / 0.78)",
                      transition: "color 0.3s",
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "Great Vibes, cursive",
                      fontSize: "clamp(0.95rem, 1.6vw, 1.15rem)",
                      color: lit ? "hsl(var(--gold))" : "hsl(var(--gold) / 0.55)",
                      marginTop: "0.05rem",
                      transition: "color 0.3s",
                      lineHeight: 1,
                    }}
                  >
                    {item.it}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div
          style={{
            marginTop: "3rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.6rem",
            opacity: open ? 1 : 0,
            transition: `opacity 0.6s ease ${open ? "0.75s" : "0s"}`,
          }}
        >
          <span style={{ color: "hsl(var(--gold) / 0.7)", fontSize: "0.5rem" }}>✦</span>
          <p
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "0.5rem",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "hsl(var(--burg) / 0.5)",
              margin: 0,
            }}
          >
            Villa Grabau &nbsp;·&nbsp; Lucca &nbsp;·&nbsp; May 22, 2027
          </p>
        </div>
      </div>
      </div>
    </>
  );
}
