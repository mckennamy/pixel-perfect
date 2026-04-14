import { useLayoutEffect, useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

interface EditableTextProps {
  id: string;
  defaultContent: string;
  tag?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";
  className?: string;
  style?: React.CSSProperties;
}

const HEADING_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

const btnStyle: React.CSSProperties = {
  fontFamily: "Cinzel, serif",
  fontSize: "0.6rem",
  letterSpacing: "0.04em",
  color: "rgba(250,248,242,0.85)",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "3px 7px",
  lineHeight: 1.4,
  minWidth: 26,
  transition: "background 0.12s",
};

export default function EditableText({
  id,
  defaultContent,
  tag = "span",
  className = "",
  style,
}: EditableTextProps) {
  const ref = useRef<HTMLElement>(null);
  const textKey = `bb_text_${id}`;
  const sizeKey  = `bb_fs_${id}`;

  const [focused, setFocused] = useState(false);
  const [tbPos, setTbPos]     = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  // ── Restore content + font size before first paint ──
  useLayoutEffect(() => {
    if (!ref.current) return;
    const saved = localStorage.getItem(textKey);
    ref.current.innerHTML = saved !== null ? saved : "";
    if (saved === null) ref.current.textContent = defaultContent;
    const savedSize = localStorage.getItem(sizeKey);
    if (savedSize) ref.current.style.fontSize = savedSize;
  }, [textKey, sizeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Keep toolbar aligned on scroll / resize ──
  const reposition = useCallback(() => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setTbPos({
      top:  Math.max(4, r.top - 38),
      left: Math.max(4, Math.min(r.left, window.innerWidth - 220)),
    });
  }, []);

  useEffect(() => {
    if (!focused) return;
    reposition();
    window.addEventListener("scroll",  reposition, true);
    window.addEventListener("resize",  reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [focused, reposition]);

  const save = () => {
    try { localStorage.setItem(textKey, ref.current?.innerHTML ?? ""); } catch {}
  };

  const resizeFont = (e: React.MouseEvent, delta: number) => {
    e.preventDefault();
    if (!ref.current) return;
    const cur  = parseFloat(window.getComputedStyle(ref.current).fontSize) || 16;
    const next = Math.max(8, Math.min(128, cur + delta));
    ref.current.style.fontSize = `${next}px`;
    try { localStorage.setItem(sizeKey, `${next}px`); } catch {}
    reposition();
  };

  const exec = (e: React.MouseEvent, cmd: string) => {
    e.preventDefault();
    ref.current?.focus();
    document.execCommand(cmd);
    save();
  };

  const resetSize = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!ref.current) return;
    ref.current.style.fontSize = "";
    try { localStorage.removeItem(sizeKey); } catch {}
  };

  const Tag = tag as any;

  const toolbar = focused && createPortal(
    <div
      style={{
        position:   "fixed",
        top:        tbPos.top,
        left:       tbPos.left,
        zIndex:     9999,
        display:    "flex",
        alignItems: "center",
        background: "hsl(138, 26%, 11%)",
        border:     "1px solid rgba(255,255,255,0.1)",
        boxShadow:  "0 4px 18px rgba(0,0,0,0.55)",
        borderRadius: 3,
        padding:    "2px 3px",
        gap:        1,
        userSelect: "none",
      }}
      // Prevent toolbar clicks from blurring the editable element
      onMouseDown={e => e.preventDefault()}
    >
      {/* Font size */}
      <button style={btnStyle} title="Smaller text"
        onMouseDown={e => resizeFont(e, -2)}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >A−</button>
      <button style={btnStyle} title="Larger text"
        onMouseDown={e => resizeFont(e, 2)}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >A+</button>
      <button style={{ ...btnStyle, fontSize: "0.48rem", opacity: 0.45 }} title="Reset size"
        onMouseDown={e => resetSize(e)}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >↺</button>

      {/* Divider */}
      <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.15)", margin: "0 2px" }} />

      {/* Format */}
      <button style={{ ...btnStyle, fontFamily: "Georgia, serif", fontWeight: 700 }} title="Bold"
        onMouseDown={e => exec(e, "bold")}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >B</button>
      <button style={{ ...btnStyle, fontFamily: "Georgia, serif", fontStyle: "italic" }} title="Italic"
        onMouseDown={e => exec(e, "italic")}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >I</button>
      <button style={{ ...btnStyle, textDecoration: "underline" }} title="Underline"
        onMouseDown={e => exec(e, "underline")}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >U</button>
    </div>,
    document.body
  );

  return (
    <>
      {toolbar}
      <Tag
        // @ts-ignore — ref type varies per tag
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className={`editable-text ${className}`}
        style={style}
        onFocus={() => { setFocused(true); reposition(); }}
        onBlur={() => { setFocused(false); save(); }}
        onKeyDown={(e: any) => {
          if (e.key === "Enter" && HEADING_TAGS.has(tag)) {
            e.preventDefault();
            (e.currentTarget as HTMLElement).blur();
          }
        }}
      />
    </>
  );
}
