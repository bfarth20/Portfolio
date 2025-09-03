"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type Props = {
  src: string; // e.g. "/media/projects/prepmyweek.mp4"
  poster?: string; // e.g. "/media/projects/prepmyweek.jpg"
  caption?: string;
  className?: string; // wrapper <figure> classes
  orientation?: "portrait" | "landscape"; // NEW
  maxPortraitWidthClassName?: string; // optional override
};

export function FilmReel({
  src,
  poster,
  caption,
  className,
  orientation = "landscape",
  maxPortraitWidthClassName = "max-w-[360px]", // tweak to taste
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { margin: "0px 0px -25% 0px" });

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // lazy set src the first time we need it
    if (inView && !v.src) {
      v.src = src;
      v.load();
    }

    const playIfPossible = async () => {
      try {
        if (inView && !reduceMotion) await v.play();
        else v.pause();
      } catch {
        /* autoplay can be blocked; ignore */
      }
    };

    playIfPossible();
    return () => v.pause();
  }, [inView, reduceMotion, src]);

  // Aspect ratio handling
  const aspect = orientation === "portrait" ? "9 / 16" : "16 / 9";
  const widthClass =
    orientation === "portrait"
      ? `${maxPortraitWidthClassName} w-full`
      : "w-full";

  return (
    <motion.figure
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.3, once: true }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={className}
    >
      <div
        className={`relative mx-auto ${widthClass}`}
        style={{ aspectRatio: aspect }}
      >
        <video
          ref={ref}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          controls
          className="absolute inset-0 h-full w-full rounded-xl shadow-xl object-cover bg-black/50"
          aria-label={caption ?? "Project demo video"}
        />
      </div>
      {caption ? <figcaption className="sr-only">{caption}</figcaption> : null}
    </motion.figure>
  );
}
