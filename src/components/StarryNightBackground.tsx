"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  brightness: number;
}

interface Meteor {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
}

export function StarryNightBackground() {
  const reduceMotion = useReducedMotion();

  // scale down on small screens
  const { starCount, meteorCount, dustCount } = useMemo(() => {
    if (typeof window === "undefined")
      return { starCount: 150, meteorCount: 5, dustCount: 30 };
    const w = window.innerWidth;
    if (w < 480) return { starCount: 90, meteorCount: 3, dustCount: 18 };
    if (w < 768) return { starCount: 120, meteorCount: 4, dustCount: 24 };
    return { starCount: 150, meteorCount: 5, dustCount: 30 };
  }, []);

  const [stars, setStars] = useState<Star[]>([]);
  const [meteors, setMeteors] = useState<Meteor[]>([]);

  useEffect(() => {
    // stars
    const s: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      s.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 0.5,
        twinkleSpeed: Math.random() * 3 + 1,
        brightness: Math.random() * 0.8 + 0.2,
      });
    }
    setStars(s);

    // meteors
    const m: Meteor[] = [];
    for (let i = 0; i < meteorCount; i++) {
      m.push({
        id: i,
        x: Math.random() * 120 - 20,
        y: Math.random() * 120 - 20,
        angle: Math.random() * 60 + 30,
        speed: Math.random() * 2 + 1,
        length: Math.random() * 60 + 40,
      });
    }
    setMeteors(m);
  }, [starCount, meteorCount]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Deep space gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={
          reduceMotion
            ? {
                background:
                  "radial-gradient(ellipse at center, #0f1419 0%, #0a0a0f 100%)",
              }
            : {
                background: [
                  "radial-gradient(ellipse at top, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #0f1419 100%)",
                  "radial-gradient(ellipse at center, #16213e 0%, #0f3460 25%, #1a1a2e 50%, #000000 100%)",
                  "radial-gradient(ellipse at bottom, #0f3460 0%, #16213e 25%, #1a1a2e 50%, #0a0a0f 100%)",
                ],
              }
        }
        transition={
          reduceMotion
            ? undefined
            : { duration: 40, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* Nebula effects */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(138, 43, 226, 0.1) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(75, 0, 130, 0.08) 0%, transparent 50%)",
        }}
        animate={reduceMotion ? { opacity: 0.4 } : { opacity: [0.3, 0.6, 0.3] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 20, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* Additional nebula layer */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 60% 20%, rgba(72, 61, 139, 0.06) 0%, transparent 60%), radial-gradient(circle at 30% 80%, rgba(25, 25, 112, 0.08) 0%, transparent 40%)",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.35 }
            : {
                opacity: [0.2, 0.5, 0.2],
                transform: ["scale(1)", "scale(1.05)", "scale(1)"],
              }
        }
        transition={
          reduceMotion
            ? undefined
            : { duration: 30, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* Twinkling stars */}
      {!reduceMotion &&
        stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.brightness,
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.5)`,
            }}
            animate={{
              opacity: [
                star.brightness * 0.3,
                star.brightness,
                star.brightness * 0.3,
              ],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: star.twinkleSpeed,
              repeat: Infinity,
              ease: "easeInOut",
              delay: star.id * 0.05,
            }}
          />
        ))}

      {/* Shooting meteors */}
      {!reduceMotion &&
        meteors.map((meteor) => (
          <motion.div
            key={meteor.id}
            className="absolute"
            style={{
              left: `${meteor.x}%`,
              top: `${meteor.y}%`,
              width: `${meteor.length}px`,
              height: "2px",
              background:
                "linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(173, 216, 230, 0.6) 50%, transparent 100%)",
              transformOrigin: "left",
              transform: `rotate(${meteor.angle}deg)`,
              filter: "blur(0.5px)",
            }}
            animate={{ x: [0, 200], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 3 + meteor.speed,
              repeat: Infinity,
              ease: "easeOut",
              delay: meteor.id * 4,
              repeatDelay: 8,
            }}
          />
        ))}

      {/* Cosmic dust */}
      {!reduceMotion &&
        [...Array(dustCount)].map((_, i) => (
          <motion.div
            key={`dust-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 0.5}px`,
              height: `${Math.random() * 2 + 0.5}px`,
              background: "rgba(255, 255, 255, 0.3)",
              filter: "blur(1px)",
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 8 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}

      {/* Constellations (SVG) */}
      {!reduceMotion && (
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient
              id="constellation"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "rgba(255,255,255,0.2)", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "rgba(255,255,255,0.1)", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>

          <motion.polyline
            points="15,25 20,20 25,15 30,18 35,12 40,16 45,14"
            fill="none"
            stroke="url(#constellation)"
            strokeWidth="0.5"
            transform="scale(5,5)"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.polyline
            points="60,40 65,35 70,45 75,42 68,50 72,55 65,58"
            fill="none"
            stroke="url(#constellation)"
            strokeWidth="0.5"
            transform="scale(5,5)"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
          />
        </svg>
      )}

      {/* Moon */}
      <motion.div
        className="absolute"
        style={{
          right: "10%",
          top: "15%",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, rgba(220, 220, 220, 0.08) 50%, rgba(200, 200, 200, 0.04) 100%)",
          filter: "blur(0.5px)",
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
        }}
        animate={reduceMotion ? { opacity: 0.7 } : { opacity: [0.6, 0.8, 0.6] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 25, repeat: Infinity, ease: "easeInOut" }
        }
      />
    </div>
  );
}
