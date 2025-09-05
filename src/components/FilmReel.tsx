"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type Props = {
  src: string;
  poster?: string;
  caption?: string;
  className?: string;
  orientation?: "portrait" | "landscape";
  maxPortraitWidthClassName?: string;
};

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string; // "slow-2g" | "2g" | "3g" | "4g"
};

function getNetworkInfo(): NetworkInformation | undefined {
  if (typeof navigator === "undefined") return undefined;
  const anyNav = navigator as Navigator & { connection?: NetworkInformation };
  return anyNav.connection;
}

export function FilmReel({
  src,
  poster,
  caption,
  className,
  orientation = "landscape",
  maxPortraitWidthClassName = "max-w-[360px]",
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  // Attach a little earlier so it’s primed by the time it appears
  const inView = useInView(ref, { margin: "200px 0px 0px 0px" });

  // Idle warm-up fetch (helps if rel=preload is ignored on some iOS builds)
  useEffect(() => {
    // Respect Data Saver
    const info = getNetworkInfo();
    const saveData = !!info?.saveData;
    const slow =
      info?.effectiveType === "slow-2g" || info?.effectiveType === "2g";
    if (saveData || slow) return; // skip warmup

    const ric =
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) =>
        window.setTimeout(
          () => cb({ didTimeout: false, timeRemaining: () => 0 }),
          200
        ));

    const cancel =
      window.cancelIdleCallback ?? ((id: number) => clearTimeout(id));

    const id = ric(async () => {
      try {
        await fetch(src, { cache: "force-cache", mode: "no-cors" });
        if (poster)
          await fetch(poster, { cache: "force-cache", mode: "no-cors" });
      } catch {
        // ignore
      }
    });
    return () => cancel(id);
  }, [src, poster]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // Attach src the first time it comes near view
    if (inView && !v.src) {
      v.src = src;
      // keep it light: first get metadata; browser should hit warm cache
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
          preload="metadata" // light until src is attached
          className="absolute inset-0 h-full w-full rounded-xl shadow-xl object-cover bg-black/50"
          aria-label={caption ?? "Project demo video"}
        />
      </div>
      {caption ? <figcaption className="sr-only">{caption}</figcaption> : null}
    </motion.figure>
  );
}
