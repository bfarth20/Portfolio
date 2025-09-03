"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export type PagerPage = {
  heading: string;
  bullets: string[];
};

type Props = {
  title: string;
  pages: PagerPage[];
  className?: string; // pass "h-full" from parent to fill the grid cell
};

export function InfoPager({ title, pages, className }: Props) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  const go = (dir: -1 | 1) => {
    setIndex((i) => {
      const next = i + dir;
      if (next < 0) return 0;
      if (next >= pages.length) return pages.length - 1;
      return next;
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const variants = {
    enter: (dir: number) =>
      reduceMotion ? { opacity: 0 } : { x: dir > 0 ? 24 : -24, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: (dir: number) =>
      reduceMotion ? { opacity: 0 } : { x: dir > 0 ? -24 : 24, opacity: 0 },
  };

  return (
    <div
      className={`h-full rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-sm ${
        className ?? ""
      }`}
      aria-label={`${title} details`}
    >
      <div className="flex h-full flex-col p-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl sm:text-2xl font-semibold">{title}</h3>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/15 transition disabled:opacity-40"
              disabled={index === 0}
              aria-label="Previous page"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/15 transition disabled:opacity-40"
              disabled={index === pages.length - 1}
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </div>

        <div className="mt-3 text-white/80 text-sm">
          Page {index + 1} of {pages.length}
        </div>

        {/* Slide container fills remaining height */}
        <div className="relative mt-4 flex-1 min-h-0">
          <AnimatePresence custom={index} mode="popLayout">
            <motion.div
              key={index}
              custom={index}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={
                reduceMotion
                  ? { duration: 0.2 }
                  : { duration: 0.28, ease: "easeOut" }
              }
              className="absolute inset-0 overflow-auto pr-2"
            >
              <h4 className="text-lg font-medium">{pages[index].heading}</h4>
              <ul className="mt-3 list-disc pl-5 space-y-2 text-white/85">
                {pages[index].bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots pinned at bottom */}
        <div className="mt-5 flex justify-center gap-2 shrink-0">
          {pages.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to page ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                i === index ? "bg-white/90" : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
