"use client";

import { motion } from "framer-motion";

type Edu = {
  school: string,
  credential: string,
  meta?: string,
  years?: string,
};

const education: Edu[] = [
  {
    school: "Savannah College of Art and Design",
    credential: "BFA, Sound Design — Magna Cum Laude",
    years: "—",
    meta: "Focused on audio engineering, on-set workflow, and post-production.",
  },
  {
    school: "Full-Stack Web Development Bootcamp",
    credential: "Certificate, Top of Class",
    years: "—",
    meta: "Three months, ~10 hrs/day — JS/TS, React/Next.js, Node/Express, SQL/Prisma.",
  },
];

export function EducationSection() {
  return (
    <motion.section
      id="education"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto max-w-6xl pt-16 sm:pt-20"
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Education</h2>

      <ol className="space-y-4">
        {education.map((e) => (
          <li
            key={e.school}
            className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur-sm"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg sm:text-xl font-semibold">{e.school}</h3>
              <span className="text-white/60 text-sm">{e.years}</span>
            </div>
            <p className="mt-1 font-medium">{e.credential}</p>
            {e.meta && <p className="mt-2 text-white/80">{e.meta}</p>}
          </li>
        ))}
      </ol>
    </motion.section>
  );
}
