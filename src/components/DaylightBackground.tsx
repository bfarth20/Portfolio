"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

type Props = {
  particles?: number; // default 20
  dimOverlay?: boolean; // adds a soft dark overlay to improve legibility
};

export function DaylightBackground({
  particles = 20,
  dimOverlay = true,
}: Props) {
  const reduceMotion = useReducedMotion();
  const [pts, setPts] = useState<Particle[]>([]);

  // Scale particle count a bit on small screens
  const particleCount = useMemo(() => {
    if (typeof window === "undefined") return particles;
    const w = window.innerWidth;
    if (w < 480) return Math.max(8, Math.floor(particles * 0.5));
    if (w < 768) return Math.max(12, Math.floor(particles * 0.75));
    return particles;
  }, [particles]);

  useEffect(() => {
    const arr: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      arr.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }
    setPts(arr);
  }, [particleCount]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient sky */}
      <motion.div
        className="absolute inset-0"
        animate={
          reduceMotion
            ? {
                background:
                  "linear-gradient(135deg, #87CEEB 0%, #ADD8E6 60%, #F0F8FF 100%)",
              }
            : {
                background: [
                  "linear-gradient(135deg, #87CEEB 0%, #FFE4B5 50%, #F0E68C 100%)", // Dawn
                  "linear-gradient(135deg, #87CEEB 0%, #B0E0E6 30%, #F0F8FF 70%, #FFFAF0 100%)", // Morning
                  "linear-gradient(135deg, #87CEEB 0%, #ADD8E6 40%, #F0F8FF 100%)", // Midday
                  "linear-gradient(135deg, #FFB347 0%, #FFD700 40%, #FFA500 70%, #FF8C00 100%)", // Evening
                  "linear-gradient(135deg, #4B0082 0%, #8B008B 30%, #FF1493 70%, #FF6347 100%)", // Sunset
                  "linear-gradient(135deg, #191970 0%, #4B0082 50%, #2F4F4F 100%)", // Night
                ],
              }
        }
        transition={
          reduceMotion
            ? undefined
            : { duration: 30, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* Light rays */}
      {!reduceMotion &&
        [...Array(5)].map((_, i) => (
          <motion.div
            key={`ray-${i}`}
            className="absolute"
            style={{
              left: `${20 + i * 15}%`,
              top: "-20%",
              width: "2px",
              height: "120%",
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
              transformOrigin: "top",
            }}
            animate={{ rotate: [0, 5, -5, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          />
        ))}

      {/* Floating particles */}
      {!reduceMotion &&
        pts.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.sin(p.id) * 10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + p.speed,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.id * 0.2,
            }}
          />
        ))}

      {/* Soft depth overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
        }}
        animate={
          reduceMotion ? { opacity: 0.35 } : { opacity: [0.3, 0.6, 0.3] }
        }
        transition={
          reduceMotion
            ? undefined
            : { duration: 12, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* Clouds */}
      {!reduceMotion &&
        [...Array(3)].map((_, i) => (
          <motion.div
            key={`cloud-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${60 + i * 20}px`,
              height: `${30 + i * 10}px`,
              background: "rgba(255, 255, 255, 0.1)",
              filter: "blur(20px)",
              left: `${10 + i * 30}%`,
              top: `${20 + i * 15}%`,
            }}
            animate={{
              x: [0, 50, 0],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 3,
            }}
          />
        ))}

      {/* optional dim overlay to help foreground text readability */}
      {dimOverlay && <div className="absolute inset-0 bg-black/20" />}
    </div>
  );
}
