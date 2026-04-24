import { useState } from "react";
import { useLocation } from "react-router-dom";

const EXCLUDED = new Set(["/"]);

export default function ReloadLatestButton() {
  const { pathname } = useLocation();
  const [busy, setBusy] = useState(false);

  if (EXCLUDED.has(pathname)) return null;

  const handleClick = () => {
    if (busy) return;
    setBusy(true);
    try {
      // Clear all editable-text caches (text + font size overrides)
      const toRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("bb_text_") || key.startsWith("bb_fs_"))) {
          toRemove.push(key);
        }
      }
      toRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore — we'll still reload
    }
    // Hard reload, bypassing cache where supported
    window.location.reload();
  };

  return (
    <button
      onClick={handleClick}
      title="Clear local cached edits and load the latest content from the server"
      style={{
        position: "fixed",
        bottom: "1.25rem",
        right: "1.25rem",
        zIndex: 9998,
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.55rem 0.95rem",
        background: "hsl(var(--burg, 138 26% 11%))",
        color: "hsl(var(--cream, 36 33% 96%))",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 999,
        fontFamily: "Cinzel, serif",
        fontSize: "0.55rem",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        cursor: busy ? "wait" : "pointer",
        boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
        opacity: busy ? 0.7 : 1,
        transition: "transform 0.15s ease, opacity 0.15s ease",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)")}
    >
      <span aria-hidden style={{ fontSize: "0.75rem", letterSpacing: 0 }}>↻</span>
      {busy ? "Reloading…" : "Reload Latest Content"}
    </button>
  );
}