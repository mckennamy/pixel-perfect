import { useState } from "react";
import PhotoPlaceholder from "./PhotoPlaceholder";

interface PhotoCarouselProps {
  ids: string[];
  aspect?: "video" | "square" | "portrait" | "wide" | "banner";
  defaults?: Record<string, string>;
  caption?: string;
  alt?: string;
}

export default function PhotoCarousel({ ids, aspect = "video", defaults, caption, alt }: PhotoCarouselProps) {
  const [idx, setIdx] = useState(0);
  const count = ids.length;
  const go = (n: number) => setIdx(((n % count) + count) % count);

  const activeId = ids[idx];

  return (
    <div style={{ position: "relative" }}>
      <PhotoPlaceholder
        key={activeId}
        id={activeId}
        aspect={aspect}
        src={defaults?.[activeId]}
        alt={alt}
        caption={caption}
      />
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(idx - 1)}
            aria-label="Previous photo"
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 25,
              background: "rgba(0,0,0,0.45)",
              color: "rgba(250,248,242,0.95)",
              border: "1px solid rgba(250,248,242,0.3)",
              width: 36,
              height: 36,
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "1rem",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(idx + 1)}
            aria-label="Next photo"
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 25,
              background: "rgba(0,0,0,0.45)",
              color: "rgba(250,248,242,0.95)",
              border: "1px solid rgba(250,248,242,0.3)",
              width: 36,
              height: 36,
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "1rem",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ›
          </button>
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: 0,
              right: 0,
              zIndex: 25,
              display: "flex",
              justifyContent: "center",
              gap: 6,
              pointerEvents: "none",
            }}
          >
            {ids.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to photo ${i + 1}`}
                style={{
                  pointerEvents: "auto",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  border: "1px solid rgba(250,248,242,0.85)",
                  background: i === idx ? "rgba(250,248,242,0.95)" : "rgba(0,0,0,0.35)",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}