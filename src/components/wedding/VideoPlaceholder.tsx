import { useState, useRef, useEffect } from "react";

interface VideoPlaceholderProps {
  id: string;
  caption?: string;
}

type VideoSource = { kind: "youtube"; videoId: string } | { kind: "vimeo"; videoId: string } | { kind: "file"; url: string } | null;

function parseVideoUrl(raw: string): VideoSource {
  const url = raw.trim();
  // YouTube
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (yt) return { kind: "youtube", videoId: yt[1] };
  // Vimeo
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { kind: "vimeo", videoId: vm[1] };
  return null;
}

export default function VideoPlaceholder({ id, caption }: VideoPlaceholderProps) {
  const [source, setSource] = useState<VideoSource>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const key = `bb_video_${id}`;

  // Load persisted URL (YouTube / Vimeo only — blob URLs can't be persisted)
  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = parseVideoUrl(saved);
      if (parsed) setSource(parsed);
    }
  }, [key]);

  const handleUrlSubmit = () => {
    const parsed = parseVideoUrl(urlInput);
    if (parsed) {
      setSource(parsed);
      localStorage.setItem(key, urlInput.trim());
      setEditing(false);
      setUrlInput("");
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("video/")) return;
    const url = URL.createObjectURL(file);
    setBlobUrl(url);
    setSource({ kind: "file", url });
    setEditing(false);
    // Note: blob URLs don't survive reload — for persistence, upload to a host and use a URL
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const clear = () => {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlobUrl(null);
    setSource(null);
    localStorage.removeItem(key);
  };

  // Cleanup blob URL on unmount
  useEffect(() => () => { if (blobUrl) URL.revokeObjectURL(blobUrl); }, [blobUrl]);

  const aspect = { position: "relative" as const, paddingBottom: "56.25%", background: "hsl(var(--parchment))", overflow: "hidden" };

  // ── Render active video ──
  if (source && !editing) {
    return (
      <div style={{ position: "relative" }}>
        <div style={aspect}>
          {source.kind === "youtube" && (
            <iframe
              src={`https://www.youtube.com/embed/${source.videoId}?rel=0&modestbranding=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
            />
          )}
          {source.kind === "vimeo" && (
            <iframe
              src={`https://player.vimeo.com/video/${source.videoId}?title=0&byline=0&portrait=0`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
            />
          )}
          {source.kind === "file" && (
            <video
              src={source.url}
              controls
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </div>
        {/* Controls overlay */}
        <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", display: "flex", gap: "0.4rem", zIndex: 2 }}>
          <button
            onClick={() => setEditing(true)}
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "0.48rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              background: "rgba(0,0,0,0.55)",
              color: "rgba(250,248,242,0.85)",
              border: "none",
              padding: "0.3rem 0.6rem",
              cursor: "pointer",
              backdropFilter: "blur(4px)",
            }}
          >
            Change
          </button>
          <button
            onClick={clear}
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "0.48rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              background: "rgba(80,10,10,0.65)",
              color: "rgba(250,248,242,0.85)",
              border: "none",
              padding: "0.3rem 0.6rem",
              cursor: "pointer",
              backdropFilter: "blur(4px)",
            }}
          >
            Remove
          </button>
        </div>
        {caption && (
          <p
            style={{
              fontFamily: "EB Garamond, serif",
              fontStyle: "italic",
              fontSize: "0.8rem",
              color: "hsl(var(--stone))",
              textAlign: "center",
              marginTop: "0.6rem",
            }}
          >
            {caption}
          </p>
        )}
      </div>
    );
  }

  // ── URL input mode ──
  if (editing || source === null) {
    return (
      <div>
        <div
          style={{
            ...aspect,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.25rem",
            border: dragOver ? "2px dashed hsl(var(--chart))" : "2px dashed hsl(var(--border))",
            cursor: "pointer",
            transition: "border-color 0.2s",
            paddingBottom: 0,
            height: 240,
            position: "relative",
          }}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !editing && setEditing(true)}
        >
          {/* Play icon */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              border: "1.5px solid hsl(var(--burg) / 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontFamily: "serif", fontSize: "1.3rem", color: "hsl(var(--burg))", marginLeft: 3 }}>▶</span>
          </div>

          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "Cinzel, serif", fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "hsl(var(--stone))", marginBottom: "0.25rem" }}>
              Add a video
            </p>
            <p style={{ fontFamily: "EB Garamond, serif", fontStyle: "italic", fontSize: "0.8rem", color: "hsl(var(--stone-light))" }}>
              Paste a YouTube or Vimeo link, or drag a video file
            </p>
          </div>

          {/* URL input */}
          <div
            style={{ width: "min(360px, 90%)", display: "flex", gap: "0.5rem" }}
            onClick={e => e.stopPropagation()}
          >
            <input
              type="text"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleUrlSubmit()}
              placeholder="youtube.com/watch?v=… or vimeo.com/…"
              style={{
                flex: 1,
                fontFamily: "EB Garamond, serif",
                fontSize: "0.85rem",
                padding: "0.5rem 0.75rem",
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--cream))",
                color: "hsl(var(--ink))",
                outline: "none",
              }}
              autoFocus={editing}
            />
            <button
              onClick={handleUrlSubmit}
              style={{
                fontFamily: "Cinzel, serif",
                fontSize: "0.48rem",
                letterSpacing: "0.2em",
                padding: "0.5rem 0.75rem",
                background: "hsl(var(--burg))",
                color: "hsl(var(--cream))",
                border: "none",
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              Add
            </button>
          </div>

          {/* File upload trigger */}
          <button
            onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "0.48rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              background: "transparent",
              border: "1px solid hsl(var(--border))",
              color: "hsl(var(--stone))",
              padding: "0.4rem 0.8rem",
              cursor: "pointer",
            }}
          >
            Upload video file
          </button>

          {editing && (
            <button
              onClick={e => { e.stopPropagation(); setEditing(false); setUrlInput(""); }}
              style={{
                position: "absolute",
                top: "0.75rem",
                right: "0.75rem",
                fontFamily: "Cinzel, serif",
                fontSize: "0.48rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                background: "transparent",
                border: "none",
                color: "hsl(var(--stone))",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          style={{ display: "none" }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />

        {caption && (
          <p style={{ fontFamily: "EB Garamond, serif", fontStyle: "italic", fontSize: "0.8rem", color: "hsl(var(--stone))", textAlign: "center", marginTop: "0.6rem" }}>
            {caption}
          </p>
        )}
      </div>
    );
  }

  return null;
}
