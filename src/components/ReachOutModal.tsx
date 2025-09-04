"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  delayMs?: number;
  email?: string;
  storageKey?: string;
  suppressDays?: number;
};

export function ReachOutModal({
  delayMs = 12000,
  email = "benjamin.farthing@gmail.com",
  storageKey = "reachout_dismissed_at",
  suppressDays = 30,
}: Props) {
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ts = localStorage.getItem(storageKey);
    if (ts) {
      const last = Number(ts);
      const ms = suppressDays * 24 * 60 * 60 * 1000;
      if (Date.now() - last < ms) return;
    }
    const t = setTimeout(() => setOpen(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs, storageKey, suppressDays]);

  const close = () => {
    localStorage.setItem(storageKey, String(Date.now()));
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={close}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md rounded-2xl bg-white/90 text-black p-5 dark:bg-zinc-900/95 dark:text-white ring-1 ring-black/10 dark:ring-white/10 backdrop-blur"
          >
            <h3 className="text-xl font-semibold">Like what you see?</h3>
            <p className="mt-2 text-black/80 dark:text-white/80">
              Reach out to Benjamin for more information.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`mailto:${email}`}
                className="rounded-full bg-black/90 text-white dark:bg-white/10 dark:text-white px-4 py-2 text-sm font-medium hover:opacity-90"
              >
                Email Benjamin
              </a>
              <button
                ref={closeBtnRef}
                onClick={() => {
                  navigator.clipboard.writeText(email).catch(() => {});
                }}
                className="rounded-full bg-black/10 dark:bg-white/10 px-4 py-2 text-sm font-medium hover:opacity-90"
              >
                Copy Email
              </button>
              <button
                onClick={close}
                className="ml-auto rounded-full bg-black/10 dark:bg-white/10 px-4 py-2 text-sm font-medium hover:opacity-90"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
