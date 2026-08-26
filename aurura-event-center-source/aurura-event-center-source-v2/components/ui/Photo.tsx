"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export function Photo({
  src,
  alt,
  className,
  label,
  fit = "cover",
}: {
  src: string;
  alt: string;
  className?: string;
  label?: string;
  fit?: "cover" | "contain";
}) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // The <img> is server-rendered, so on a fast failure (e.g. a 404) the
  // native `error` event can fire before hydration attaches our onError
  // listener. Catch that race by checking `complete`/`naturalWidth` once
  // mounted, in addition to handling later failures via onError below.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) {
      setFailed(true);
    }
  }, [src]);

  if (failed) {
    return (
      <div className={clsx("photo-fallback flex items-end justify-end p-4", className)}>
        <span className="font-serif-display text-ivory/35 text-[11px] italic text-right">{label ?? alt}</span>
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={clsx(fit === "cover" ? "object-cover" : "object-contain", className)}
    />
  );
}
