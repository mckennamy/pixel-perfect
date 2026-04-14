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
  const fileRef = useRef<HTMLInputElement>(null);
  const storageKey = id ? `bb_photo_${id}` : null;

  useEffect(() => {
    if (!storageKey) return;
    // Fast cache from localStorage
    const cached = localStorage.getItem(storageKey);
    if (cached) setSrc(cached);
    // Then load from cloud
    loadEdit(storageKey).then((saved) => {
      if (saved) setSrc(saved);
    });
  }, [storageKey]);

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

  const activeSrc = src || staticSrc;
  const isEditable = !!id;

  return (
    <figure className="w-full">
      <div
        className={`photo-slot ${aspectMap[aspect]} ${activeSrc ? "has-photo" : ""}`}
        style={{ cursor: isEditable ? "pointer" : "default" }}
        onMouseEnter={() => isEditable && setHovering(true)}
        onMouseLeave={() => isEditable && setHovering(false)}
        onClick={() => isEditable && !loading && fileRef.current?.click()}
      >
        {activeSrc && <img src={activeSrc} alt={alt} />}
        {isEditable && (hovering || loading) && (
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
