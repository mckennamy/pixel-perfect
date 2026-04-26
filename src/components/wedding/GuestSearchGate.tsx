import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Guest {
  id: string;
  full_name: string;
  invite_tier: string;
}

interface Props {
  onUnlock: (guest: Guest) => void;
}

export default function GuestSearchGate({ onUnlock }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Guest[]>([]);
  const [searching, setSearching] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const handle = setTimeout(async () => {
      const { data, error } = await supabase
        .from("guests")
        .select("id, full_name, invite_tier")
        .ilike("full_name", `%${query.trim()}%`)
        .limit(8);
      if (!error && data) setResults(data as Guest[]);
      setSearching(false);
      setTouched(true);
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  const handleSelect = (g: Guest) => {
    sessionStorage.setItem(
      "wedding_guest",
      JSON.stringify({ id: g.id, name: g.full_name, tier: g.invite_tier })
    );
    onUnlock(g);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: "hsl(42 35% 97%)" }}
    >
      <div className="min-h-full flex items-center justify-center px-6 py-16">
        <div
          className="w-full"
          style={{
            maxWidth: 480,
            opacity: 1,
            animation: "invitationIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          <div
            style={{
              background: "#FAF8F2",
              border: "1px solid rgba(184,154,106,0.28)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.08), 0 28px 80px rgba(0,0,0,0.12)",
              padding: "2.5rem 2rem",
              textAlign: "center",
            }}
          >
            <p
              className="kicker mb-4"
              style={{ color: "hsl(var(--burg) / 0.7)" }}
            >
              Becoming Bradley
            </p>
            <p
              className="font-script mb-2"
              style={{
                fontSize: "clamp(1.8rem, 5vw, 2.4rem)",
                color: "hsl(var(--burg))",
                lineHeight: 1.05,
              }}
            >
              Find Your Invitation
            </p>
            <span className="rule mt-4 mb-6 block" />

            <p
              className="font-display italic mb-6"
              style={{
                fontSize: "0.95rem",
                color: "hsl(var(--ink-mid))",
                lineHeight: 1.5,
              }}
            >
              Please search for your name to view your formal invitation.
            </p>

            <div
              style={{
                border: "1px solid hsl(var(--gold) / 0.4)",
                background: "white",
                padding: "0.85rem 1rem",
                marginBottom: "1rem",
                textAlign: "left",
              }}
            >
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type your full name…"
                className="w-full"
                style={{
                  fontFamily: "EB Garamond, serif",
                  fontSize: "1rem",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "hsl(var(--ink))",
                }}
              />
            </div>

            {/* Results */}
            {query.trim().length >= 2 && (
              <div
                style={{
                  textAlign: "left",
                  marginTop: "1rem",
                  maxHeight: 280,
                  overflowY: "auto",
                }}
              >
                {searching && (
                  <p
                    className="font-body italic text-sm"
                    style={{ color: "hsl(var(--stone))", textAlign: "center" }}
                  >
                    Searching…
                  </p>
                )}
                {!searching && results.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {results.map((g) => (
                      <li key={g.id}>
                        <button
                          onClick={() => handleSelect(g)}
                          className="w-full text-left p-3 transition-colors"
                          style={{
                            border: "1px solid hsl(var(--border))",
                            background: "white",
                            marginBottom: 6,
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.borderColor =
                              "hsl(var(--burg))";
                            (e.currentTarget as HTMLButtonElement).style.background =
                              "hsl(var(--burg-pale))";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.borderColor =
                              "hsl(var(--border))";
                            (e.currentTarget as HTMLButtonElement).style.background =
                              "white";
                          }}
                        >
                          <p
                            className="font-display italic"
                            style={{
                              fontSize: "1.05rem",
                              color: "hsl(var(--burg))",
                              lineHeight: 1.2,
                            }}
                          >
                            {g.full_name}
                          </p>
                          <p
                            className="kicker"
                            style={{
                              color: "hsl(var(--gold))",
                              fontSize: "0.5rem",
                              marginTop: 2,
                            }}
                          >
                            View Invitation →
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {!searching && touched && results.length === 0 && (
                  <p
                    className="font-body italic text-sm"
                    style={{
                      color: "hsl(var(--stone))",
                      textAlign: "center",
                      padding: "0.75rem",
                    }}
                  >
                    We couldn't find that name. Please double-check the spelling
                    or reach out to McKenna directly.
                  </p>
                )}
              </div>
            )}

            <p
              className="kicker mt-8"
              style={{ color: "hsl(var(--stone))", fontSize: "0.5rem" }}
            >
              Lucca · May 22, 2027
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}