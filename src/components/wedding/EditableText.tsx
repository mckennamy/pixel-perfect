import { useLayoutEffect, useRef } from "react";

/**
 * EditableText — click any instance to edit inline.
 * - Enter creates a new line in body text; blurs in headings.
 * - Content (including line-breaks) saved to localStorage by `id`.
 * - Subtle chartreuse dashed outline on hover/focus shows editability.
 */
interface EditableTextProps {
  id: string;
  defaultContent: string;
  tag?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";
  className?: string;
  style?: React.CSSProperties;
}

const HEADING_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

export default function EditableText({
  id,
  defaultContent,
  tag = "span",
  className = "",
  style,
}: EditableTextProps) {
  const ref = useRef<HTMLElement>(null);
  const key = `bb_text_${id}`;

  // Set content before browser paints — no flash of stale/empty content
  useLayoutEffect(() => {
    if (!ref.current) return;
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      ref.current.innerHTML = saved;
    } else {
      // textContent is safe for initial default (no HTML injection risk)
      ref.current.textContent = defaultContent;
    }
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  const Tag = tag as any;

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      className={`editable-text ${className}`}
      style={style}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        try {
          // Save innerHTML so <br> line-breaks survive reload
          localStorage.setItem(key, e.currentTarget.innerHTML);
        } catch {
          // localStorage quota exceeded — silently continue
        }
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        // Blur on Enter in headings; allow natural newline in body/div/span
        if (e.key === "Enter" && HEADING_TAGS.has(tag)) {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
    />
    // No children — content is set imperatively in useLayoutEffect
    // This prevents React from overwriting user edits on re-render
  );
}
