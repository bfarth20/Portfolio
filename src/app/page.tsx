"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { DaylightBackground } from "@/components/DaylightBackground";
import { StarryNightBackground } from "@/components/StarryNightBackground";

type Mode = "light" | "dark";

export default function Home() {
  const reduceMotion = useReducedMotion();

  // theme detection
  const [mode, setMode] = useState<Mode | null>(null);

  // sequence state
  const [showWelcome, setShowWelcome] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showDetected, setShowDetected] = useState(false);
  const [bgVisible, setBgVisible] = useState(false);
  const [bioVisible, setBioVisible] = useState(false);

  // detect prefers-color-scheme
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => setMode(mq.matches ? "dark" : "light");
    apply();

    const listener = (e: MediaQueryListEvent) =>
      setMode(e.matches ? "dark" : "light");
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  // Orchestrate sequence AFTER we know the mode
  useEffect(() => {
    if (!mode) return;

    const base = reduceMotion ? 0 : 200; // tiny delay scaler if motion allowed
    const timers: number[] = [];

    // Step 1: welcome
    timers.push(window.setTimeout(() => setShowWelcome(true), 100 + base));

    // Step 2: name
    timers.push(window.setTimeout(() => setShowName(true), 900 + base));

    // Step 3: detected
    timers.push(window.setTimeout(() => setShowDetected(true), 2000 + base));

    // Step 4: fade out detected
    timers.push(window.setTimeout(() => setShowDetected(false), 3000 + base));

    // Step 5: reveal background
    timers.push(window.setTimeout(() => setBgVisible(true), 3200 + base));

    return () => timers.forEach(clearTimeout);
  }, [mode, reduceMotion]);

  useEffect(() => {
    if (!bgVisible) return;
    const t = setTimeout(() => setBioVisible(true), reduceMotion ? 0 : 250);
    return () => clearTimeout(t);
  }, [bgVisible, reduceMotion]);

  // initial black backdrop until bgVisible
  const containerStyle = useMemo<React.CSSProperties>(() => {
    return { backgroundColor: "black" };
  }, []);

  // common timings
  const fadeIn = { duration: 0.6, ease: "easeOut" as const };
  const fadeOut = { duration: 0.4, ease: "easeIn" as const };

  return (
    <div
      className="min-h-screen w-full text-white relative overflow-hidden"
      style={containerStyle}
    >
      {/* Backgrounds, only once it's time */}
      <AnimatePresence>
        {bgVisible && mode === "light" && (
          <motion.div
            key="bg-day"
            initial={reduceMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? {} : fadeIn}
            className="absolute inset-0"
          >
            <DaylightBackground />
          </motion.div>
        )}

        {bgVisible && mode === "dark" && (
          <motion.div
            key="bg-night"
            initial={reduceMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? {} : fadeIn}
            className="absolute inset-0"
          >
            <StarryNightBackground />
          </motion.div>
        )}
      </AnimatePresence>

      {/* optional overlay for legibility once bg is visible */}
      {bgVisible && (
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      )}

      {/* Foreground copy + float-to-top hero */}
      <main className="relative z-10 min-h-screen px-6">
        {/* This spacer keeps the hero from overlapping the top content after it floats */}
        <div className="h-[10vh] sm:h-[12vh] md:h-[14vh]" />

        <motion.div
          // The hero block starts centered, then floats up when bg is visible
          initial={false}
          animate={
            bgVisible
              ? reduceMotion
                ? { y: 0 }
                : { y: "-35vh", scale: 0.96 }
              : { y: 0, scale: 1 }
          }
          transition={
            reduceMotion
              ? {}
              : { type: "spring", stiffness: 120, damping: 20, mass: 0.8 }
          }
          className="flex flex-col items-center text-center"
          style={{ willChange: "transform" }}
        >
          {/* line 1: welcome (always mounted, no layout shift) */}
          <motion.p
            initial={false}
            animate={showWelcome ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={reduceMotion ? {} : { duration: 0.6, ease: "easeOut" }}
            className="text-lg sm:text-xl md:text-2xl text-white/80"
            aria-hidden={!showWelcome}
          >
            welcome to the profile of
          </motion.p>

          <div className="h-3" />

          {/* line 2: name */}
          <motion.h1
            initial={false}
            animate={showName ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={reduceMotion ? {} : { duration: 0.6, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
            aria-hidden={!showName}
            style={{ willChange: "opacity, transform" }}
          >
            <span className="text-[#d95c23]">Benjamin Farthing</span>
          </motion.h1>

          <div className="h-4" />

          {/* line 3: detected (fades out before background) */}
          <motion.p
            initial={false}
            animate={
              showDetected ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }
            }
            transition={
              reduceMotion ? {} : { duration: 0.4, ease: "easeInOut" }
            }
            className="text-base sm:text-lg md:text-xl bg-white/10 px-3 py-1.5 rounded"
            aria-hidden={!showDetected}
            style={{ willChange: "opacity, transform" }}
          >
            Screen detected — <strong>{mode}</strong>
          </motion.p>
        </motion.div>

        {/* Reveal the Bio section underneath once bg is visible */}
        <AnimatePresence>
          {bioVisible && (
            <motion.section
              key="bio"
              initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={
                reduceMotion ? {} : { duration: 0.5, ease: "easeOut" }
              }
              className="mx-auto max-w-3xl mt-[42vh] sm:mt-[44vh] md:mt-[46vh] text-left"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Bio</h2>
              <p className="text-white/90 leading-7">
                I’m a backend-leaning full-stack developer in Atlanta with a
                prior career in film sound. I build production-ready apps like
                PrepMyWeek (meal planning), Appalachian Trail Weather (iOS), and
                sensor-driven tools in Swift/React Native. I care about
                performance, accessibility, and clean, maintainable code.
              </p>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
