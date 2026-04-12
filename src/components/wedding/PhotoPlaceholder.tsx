interface PhotoPlaceholderProps {
  aspect?: "video" | "square" | "portrait" | "wide" | "banner";
  src?: string;
  alt?: string;
  caption?: string;
}

const aspectMap = {
  video:    "aspect-video",
  square:   "aspect-square",
  portrait: "aspect-[3/4]",
  wide:     "aspect-[21/9]",
  banner:   "aspect-[4/1]",
};

export default function PhotoPlaceholder({
  aspect = "video",
  src,
  alt = "Wedding photo",
  caption,
}: PhotoPlaceholderProps) {
  return (
    <figure className="w-full">
      <div className={`photo-slot ${aspectMap[aspect]}`}>
        {src && <img src={src} alt={alt} />}
      </div>
      {caption && (
        <figcaption className="mt-3 text-center font-body text-xs italic text-stone-light">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
