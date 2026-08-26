"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useCallback } from "react";
import { Photo } from "./Photo";
import type { VenuePhoto } from "@/lib/images";

export function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: VenuePhoto[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (index === null) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % photos.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + photos.length) % photos.length);
    },
    [index, onClose, onNavigate, photos.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  useEffect(() => {
    document.body.style.overflow = index !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [index]);

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-charcoal/97 flex items-center justify-center"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 md:top-8 md:right-8 text-ivory/80 hover:text-ivory z-10 p-2"
            aria-label="Close"
          >
            <X size={26} />
          </button>

          <button
            onClick={() => onNavigate((index - 1 + photos.length) % photos.length)}
            className="absolute left-2 md:left-6 text-ivory/70 hover:text-ivory z-10 p-3"
            aria-label="Previous"
          >
            <ChevronLeft size={30} />
          </button>
          <button
            onClick={() => onNavigate((index + 1) % photos.length)}
            className="absolute right-2 md:right-6 text-ivory/70 hover:text-ivory z-10 p-3"
            aria-label="Next"
          >
            <ChevronRight size={30} />
          </button>

          <motion.div
            key={photos[index].id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="max-w-[90vw] max-h-[82vh] flex flex-col items-center"
          >
            <Photo
              src={photos[index].url}
              alt={photos[index].alt}
              fit="contain"
              className="max-w-[90vw] max-h-[74vh] w-auto h-auto"
              label={photos[index].alt}
            />
            <p className="mt-4 text-ivory/60 text-sm tracking-wide text-center">{photos[index].alt}</p>
            <p className="mt-1 text-ivory/30 text-xs">
              {index + 1} / {photos.length}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
