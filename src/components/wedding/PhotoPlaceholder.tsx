import { useRef, useState, useEffect } from "react";
import { loadEdit, saveEdit } from "@/lib/siteEdits";

interface PhotoPlaceholderProps {
  id?: string;
  aspect?: "video" | "square" | "portrait" | "wide" | "banner";
  src?: string;
  alt?: string;
  caption?: string;
}

const aspectMap: Record<string, string> = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  wide: "aspect-[21/9]",
  banner: "aspect-[4/1]",
};

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1400;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width >= height) { height = Math.round(height * MAX / width); width = MAX; }
          else { width = Math.round(width * MAX / height); height = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.88));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PhotoPlaceholder({
  id,
  aspect = "video",
  src: staticSrc,
  alt = "Wedding photo",
  caption,
}: PhotoPlaceholderProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adjusting, setAdjusting] = useState(false);
  const [posY, setPosY] = useState<number>(50); // 0 = top, 100 = bottom
  const fileRef = useRef<HTMLInputElement>(null);
  const storageKey = id ? `bb_photo_${id}` : null;
  const posKey = id ? `bb_photo_pos_${id}` : null;

  useEffect(() => {
    if (!storageKey) return;
    const cached = localStorage.getItem(storageKey);
    if (cached) setSrc(cached);
    loadEdit(storageKey).then((saved) => {
      if (saved) setSrc(saved);
    });
  }, [storageKey]);

  useEffect(() => {
    if (!posKey) return;
    const cached = localStorage.getItem(posKey);
    if (cached) {
      const n = Number(cached);
      if (!Number.isNaN(n)) setPosY(n);
    }
    loadEdit(posKey).then((saved) => {
      if (saved) {
        const n = Number(saved);
        if (!Number.isNaN(n)) setPosY(n);
      }
    });
  }, [posKey]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const dataUrl = await compressImage(file);
      setSrc(dataUrl);
      if (storageKey) saveEdit(storageKey, dataUrl);
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const raw = ev.target?.result as string;
        setSrc(raw);
        if (storageKey) saveEdit(storageKey, raw);
      };
      reader.readAsDataURL(file);
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handlePosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setPosY(v);
    if (posKey) {
      localStorage.setItem(posKey, String(v));
      saveEdit(posKey, String(v));
    }
  };

  const activeSrc = src || staticSrc;
  const isEditable = !!id;

  return (
    <figure className="w-full">
      <div
        className={`photo-slot ${aspectMap[aspect]} ${activeSrc ? "has-photo" : ""}`}
        style={{ cursor: isEditable && !adjusting ? "pointer" : "default", position: "relative" }}
        onMouseEnter={() => isEditable && setHovering(true)}
        onMouseLeave={() => isEditable && setHovering(false)}
        onClick={(e) => {
          if (!isEditable || loading || adjusting) return;
          // Don't trigger upload if clicking on the adjust controls
          if ((e.target as HTMLElement).closest("[data-adjust-control]")) return;
          fileRef.current?.click();
        }}
      >
        {activeSrc && (
          <img
            src={activeSrc}
            alt={alt}
            style={{ objectFit: "cover", objectPosition: `center ${posY}%`, width: "100%", height: "100%" }}
          />
        )}
        {isEditable && activeSrc && (hovering || adjusting) && !loading && (
          <button
            type="button"
            data-adjust-control
            onClick={(e) => {
              e.stopPropagation();
              setAdjusting((v) => !v);
            }}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 30,
              background: "rgba(0,0,0,0.65)",
              color: "rgba(250,248,242,0.95)",
              border: "1px solid rgba(250,248,242,0.25)",
              borderRadius: 4,
              padding: "6px 10px",
              fontFamily: "Cinzel, serif",
              fontSize: "0.55rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            {adjusting ? "Done" : "Adjust ↕"}
          </button>
        )}
        {isEditable && adjusting && activeSrc && (
          <div
            data-adjust-control
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              right: 12,
              top: 56,
              bottom: 12,
              zIndex: 30,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              background: "rgba(0,0,0,0.55)",
              padding: "12px 8px",
              borderRadius: 4,
            }}
          >
            <span style={{ color: "rgba(250,248,242,0.85)", fontFamily: "Cinzel, serif", fontSize: "0.5rem", letterSpacing: "0.2em" }}>↑</span>
            <input
              type="range"
              min={0}
              max={100}
              value={posY}
              onChange={handlePosChange}
              {...({ orient: "vertical" } as Record<string, string>)}
              style={{
                writingMode: "vertical-lr" as never,
                WebkitAppearance: "slider-vertical" as never,
                width: 8,
                height: "100%",
                accentColor: "hsl(var(--gold))",
              }}
            />
            <span style={{ color: "rgba(250,248,242,0.85)", fontFamily: "Cinzel, serif", fontSize: "0.5rem", letterSpacing: "0.2em" }}>↓</span>
          </div>
        )}
        {isEditable && (hovering || loading) && !adjusting && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              background: loading ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.42)",
              transition: "background 0.2s",
              pointerEvents: "none",
            }}
          >
            <p className="kicker" style={{ color: "rgba(250,248,242,0.9)", fontSize: "0.58rem" }}>
              {loading ? "Processing…" : activeSrc ? "Change Photo" : "Add Photo"}
            </p>
            {!loading && (
              <p className="font-body italic" style={{ color: "rgba(250,248,242,0.5)", fontSize: "0.7rem" }}>
                Click to upload
              </p>
            )}
          </div>
        )}
        {isEditable && (
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-center font-body text-xs italic" style={{ color: "hsl(var(--stone-light))" }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
