"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useInView,
  useMotionValueEvent,
} from "framer-motion";
import { DaylightBackground } from "@/components/DaylightBackground";
import { StarryNightBackground } from "@/components/StarryNightBackground";
import { FilmReel } from "@/components/FilmReel";
import { PortfolioSection } from "@/components/PortfolioSection";
import { EducationSection } from "@/components/EducationSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ReachOutModal } from "@/components/ReachOutModal";
import { ResumeCta } from "@/components/ResumeCta";

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
  const [heroDismissed, setHeroDismissed] = useState(false);
  const { scrollY } = useScroll();

  // Hide the hero as soon as the user starts scrolling a few pixels
  useMotionValueEvent(scrollY, "change", (latest) => {
    setHeroDismissed(latest > 50); // tweak threshold to taste
  });

  const portfolioTriggerRef = useRef<HTMLDivElement>(null);
  const portfolioReady = useInView(portfolioTriggerRef, {
    margin: "0px 0px -10% 0px",
    once: true,
  });

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

      {/* Foreground layers */}
      {/* Foreground layers */}
      <main className="relative z-10 px-6">
        {/* HERO SECTION: in-flow; animates height & fades on scroll */}
        <motion.section
          id="hero"
          initial={false}
          animate={
            heroDismissed
              ? { opacity: 0, height: 0, marginTop: 0 }
              : bgVisible
              ? { opacity: 1, height: "28vh", marginTop: 0 }
              : { opacity: 1, height: "100vh", marginTop: 0 }
          }
          transition={
            reduceMotion
              ? {}
              : { type: "spring", stiffness: 120, damping: 20, mass: 0.8 }
          }
          className="w-full overflow-hidden"
          style={{ willChange: "height, opacity, transform" }}
        >
          <div
            className={`h-full flex ${
              bgVisible ? "items-start pt-6 sm:pt-8" : "items-center"
            } justify-center text-center`}
          >
            <div className="flex flex-col items-center">
              {/* line 1 */}
              <motion.p
                initial={false}
                animate={
                  showWelcome ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
                }
                transition={
                  reduceMotion ? {} : { duration: 0.6, ease: "easeOut" }
                }
                className="text-lg sm:text-xl md:text-2xl text-white/80"
                aria-hidden={!showWelcome}
              >
                Welcome to the Portfolio of
              </motion.p>

              <div className="h-3" />

              {/* line 2 */}
              <motion.h1
                initial={false}
                animate={
                  showName ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                }
                transition={
                  reduceMotion ? {} : { duration: 0.6, ease: "easeOut" }
                }
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
                aria-hidden={!showName}
                style={{ willChange: "opacity, transform" }}
              >
                <span>Benjamin Farthing</span>
              </motion.h1>

              <div className="h-4" />

              {/* line 3 */}
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
            </div>
          </div>
        </motion.section>

        {/* BIO SECTION */}
        <AnimatePresence>
          {bioVisible && (
            <motion.section
              key="bio"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={
                reduceMotion
                  ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
                  : {
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          duration: 0.5,
                          ease: "easeOut",
                          staggerChildren: 0.12,
                        },
                      },
                    }
              }
              className="mx-auto max-w-6xl"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">Bio</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                {/* Text column */}
                <motion.div
                  variants={
                    reduceMotion
                      ? { show: { opacity: 1 } }
                      : {
                          hidden: { opacity: 0, y: 12 },
                          show: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.45 },
                          },
                        }
                  }
                  className="text-white/90 leading-7"
                >
                  <p>
                    For 15 years I worked as a Boom Operator and Sound
                    Technician in the film industry, bringing creativity and
                    collaboration to every project. Now I’m channeling that
                    experience into software: crafting clean, thoughtful code
                    and building tools that solve real problems.
                  </p>
                  <p className="mt-4">
                    I studied sound programming and design at Savannah College
                    of Art and Design (Magna Cum Laude), then moved to Atlanta
                    where I built a career on union sets. As the industry
                    landscape shifted, longer hours, lower pay, fewer
                    opportunities, I chose a new chapter that offers safer
                    conditions, stability, and fresh technical challenges.
                  </p>
                  <p className="mt-4">
                    In the beginning of 2025, I took the leap into a full stack
                    bootcamp, spent three intense months coding 10 hours a day,
                    and finished at the top of my class. I shipped{" "}
                    <em>PrepMyWeek</em>, a fully functional meal planning app,
                    now live and growing, proof that I can deliver thoughtful,
                    scalable software end to end. Since that app was shipped I
                    have continued pushing forward, delivering multiple apps for
                    various needs.
                  </p>
                </motion.div>

                {/* Video column */}
                <FilmReel
                  src="/media/FilmReel.mp4"
                  className="w-full"
                  caption="Highlights from 15 years on set"
                />
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Spacer that keeps Bio on screen a bit */}
        <div
          ref={portfolioTriggerRef}
          className="h-[12vh] sm:h-[14vh] md:h-[16vh]"
        />

        {/* Portfolio + following sections reveal when spacer enters view */}
        <AnimatePresence>
          {portfolioReady && (
            <motion.div
              key="portfolio-block"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <PortfolioSection />
              <SkillsSection />
              <EducationSection />
              <ResumeCta
                resumePath="/resume/Benjamin-Farthing-Resume.pdf"
                email="benjamin.farthing@gmail.com"
                linkedin="https://www.linkedin.com/in/benjamin-farthing-397a3064"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keep the timed modal outside the gate so it can still appear */}
        <ReachOutModal
          delayMs={20000}
          email="benjamin.farthing@gmail.com"
          suppressDays={0}
        />
      </main>
    </div>
  );
}
