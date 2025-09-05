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
  crossOrigin?: "anonymous" | "use-credentials"; // only if serving from another domain
};

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

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
  crossOrigin,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { margin: "1000px 0px 0px 0px" });

  // Idle warm-up fetch (helps when <link rel="preload"> is ignored)
  useEffect(() => {
    const info = getNetworkInfo();
    const saveData = !!info?.saveData;
    const slow =
      info?.effectiveType === "slow-2g" || info?.effectiveType === "2g";
    if (saveData || slow) return;

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
        await fetch(src, { cache: "force-cache" });
        if (poster) await fetch(poster, { cache: "force-cache" });
      } catch {
        /* ignore */
      }
    });
    return () => cancel(id);
  }, [src, poster]);

  // Pause when tab goes background (battery-friendly)
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const onVis = () => {
      if (document.hidden) v.pause();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduceMotion) return;

    if (inView) {
      const absolute = new URL(
        src,
        typeof window !== "undefined" ? window.location.origin : "https://local"
      ).toString();
      if (v.src !== absolute) {
        v.src = src;
        v.setAttribute("preload", "auto");
        v.load();
      }
    }

    const playIfPossible = async () => {
      try {
        if (inView && !reduceMotion) await v.play();
        else v.pause();
      } catch {
        /* autoplay may be blocked */
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
          preload="metadata"
          {...(crossOrigin ? { crossOrigin } : {})}
          controls={false}
          controlsList="nodownload noplaybackrate noremoteplayback"
          disablePictureInPicture
          className="absolute inset-0 h-full w-full rounded-xl shadow-xl object-cover bg-black/50"
          aria-label={caption ?? "Project demo video"}
        />
      </div>
      {caption ? <figcaption className="sr-only">{caption}</figcaption> : null}
    </motion.figure>
  );
}
