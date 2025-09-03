"use client";

import { motion } from "framer-motion";

const skills = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind",
  "Framer Motion",
  "Node.js",
  "Express",
  "Prisma",
  "PostgreSQL",
  "React Native / Expo",
  "Swift / SwiftUI",
  "CoreMotion",
  "JWT / Auth",
  "Zod",
  "CI/CD",
  "Vercel",
];

export function SkillsSection() {
  return (
    <motion.section
      id="skills"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto max-w-6xl pt-16 sm:pt-20"
    >
      <h2 className="text-2xl sm:text-3xl font-bold">Skills & Tools</h2>
      <p className="mt-2 text-white/80">A snapshot of my day-to-day toolkit.</p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {skills.map((s) => (
          <li
            key={s}
            className="rounded-full bg-white/10 px-3.5 py-1.5 text-sm text-white/90 ring-1 ring-white/15"
          >
            {s}
          </li>
        ))}
      </ul>
    </motion.section>
  );
}
