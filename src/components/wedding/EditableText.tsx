import { useLayoutEffect, useRef } from "react";

/**
 * EditableText — click any instance to edit text inline.
 * Changes are saved to localStorage by `id` and persist across page loads.
 * A subtle dashed outline appears on hover/focus to indicate editability.
 */
interface EditableTextProps {
  id: string;
  defaultContent: string;
  tag?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";
  className?: string;
  style?: React.CSSProperties;
}

export default function EditableText({
  id,
  defaultContent,
  tag = "span",
  className = "",
  style,
}: EditableTextProps) {
  const ref = useRef<HTMLElement>(null);
  const key = `bb_text_${id}`;

  // Set content before first paint (no flash of default content)
  useLayoutEffect(() => {
    if (!ref.current) return;
    const saved = localStorage.getItem(key);
    if (saved !== null) ref.current.textContent = saved;
  }, [key]);

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
          localStorage.setItem(key, e.currentTarget.textContent || "");
        } catch {
          // localStorage quota exceeded — silently ignore
        }
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        // Prevent Enter from inserting newlines in single-line contexts
        if (e.key === "Enter" && tag !== "div") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
    >
      {defaultContent}
    </Tag>
  );
}
