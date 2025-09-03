"use client";

import { motion } from "framer-motion";
import { FilmReel } from "@/components/FilmReel";
import { InfoPager, PagerPage } from "@/components/InfoPager";

type Project = {
  title: string;
  summary?: string;
  video: { src: string; poster?: string; label?: string };
  pages?: PagerPage[]; // when present, we render InfoPager
};

const prepMyWeekPages: PagerPage[] = [
  {
    heading: "Problem",
    bullets: [
      "Most meal planners ignore a basic constraint: you want to shop at one store. Mixing recipes that require ingredients from multiple chains means extra trips or substitutions. I built PrepMyWeek as a store-first planner: pick your preferred chain, see only recipes whose ingredients are available there, then get an aisle-ordered grocery list.",
      "Many international grocery stores are fun to shop at, but without knowledge of certain ingredients and where to find them in store, many shoppers feel intimidated to do their full week's shopping in an unfamiliar store.",
    ],
  },
  {
    heading: "What I Built",
    bullets: [
      "Web app (Next.js + Tailwind) for planning; API (Node/Express + Prisma over SQL) for data and auth.",
      "Companion React Native app (iOS/Android) that uses the same API so your list travels with you.",
      "A list builder that normalizes units, merges duplicates across recipes, and sorts items by store section.",
    ],
  },
  {
    heading: "Auth & Sessions",
    bullets: [
      "JWT auth with short-lived access tokens and rotating refresh tokens.",
      "Tokens are stored in HttpOnly cookies; refresh rotation invalidates stolen tokens (server tracks the latest valid token per user).",
      "Express middleware guards protected routes and injects req.user for downstream handlers.",
    ],
  },
  {
    heading: "Data & Guardrails",
    bullets: [
      "Express server with modular routers: /auth, /recipes, /stores, /lists.",
      "Prisma ORM with a SQL backend (PostgreSQL in prod):",
      "User, Recipe, Ingredient, RecipeIngredient (qty + unit), Store, StoreItem (ingredient availability + section), Selection (user’s chosen recipes for the week).",
      "Canonical ingredients + unit normalization; map to store + section.",
      "Schema validation with Zod on all recipe submissions (title length, steps, ingredient array shape, etc.).",
    ],
  },
  {
    heading: "List Builder",
    bullets: [
      "Given a user’s weekly Selection:",
      "Expand to RecipeIngredient[].",
      "Normalize each to base unit (e.g., 2 tbsp → 30 ml) using the conversion table.",
      "Group by canonical ingredient and sum quantities.",
      "Sort by section, then by name; return a nested payload the UI renders as an aisle-ordered list.",
    ],
  },
  {
    heading: "Companion App",
    bullets: [
      "React Native uses the same JWT flow; stores the refresh token securely and refreshes on app open.",
      "Simplified Ui where users can only select recipes and view grocery list",
      "Offline cache of the current grocery list; re-syncs when back online.",
      "Approved on both Apple and Google Play Store",
    ],
  },
];

const atWeatherPages: PagerPage[] = [
  {
    heading: "Problem",
    bullets: [
      "Hikers along the Appalachian Trail need accurate weather forcasts to stay safe and aware.",
      "Town forecasts are valley-biased; shelters sit on ridgelines with different elevation/weather.",
      "Day hikers need this ridge specific data to plan their trips more effectively.",
      "Conditions change fast, hikers need shelter-specific data.",
      "Connectivity is spotty; the app must use minimal data and keep the last forecast offline.",
    ],
  },
  {
    heading: "Serverless Fetch",
    bullets: [
      "No backend: client calls public NWS JSON endpoints directly (CORS-enabled).",
      "Typed fetch wrapper with abort/retry/backoff; trims payload to essentials.",
      "Zero infra cost + fewer failure points; per-shelter debounce/rate-limit.",
    ],
  },
  {
    heading: "UX & Caching",
    bullets: [
      "System theme + manual light/dark toggle (persisted).",
      "Caches the latest forecast per shelter in AsyncStorage with expiry (e.g., 12h).",
      "Shelter list shows a • dot when cached; opens instantly, then background refresh.",
    ],
  },
];

const ghostTdsPages: PagerPage[] = [
  {
    heading: "Problem",
    bullets: [
      "Create a niche, showpiece app for the ghost-hunting market.",
      "Use built-in iPhone sensors; keep latency low and visuals punchy.",
      "Write it in Swift/SwiftUI to demonstrate fast ramp-up (with AI assist).",
    ],
  },
  {
    heading: "Sensors & Sensitivity",
    bullets: [
      "CoreMotion accelerometer sampling with lightweight smoothing.",
      "Raised sensitivity: small table taps register as clear spikes.",
      "Spike detection with thresholds + short debounce to avoid chatter.",
    ],
  },
  {
    heading: "UI & Aesthetic",
    bullets: [
      "1980s ‘detector’ vibe: CRT scanlines, subtle phosphor glow.",
      "Graph flashes + indicator lights on significant responses.",
      "Minimal controls; readable in low-light with dark theme.",
    ],
  },
];

const projects: Project[] = [
  {
    title: "PrepMyWeek",
    video: { src: "/media/projects/prepmyweek.mp4", label: "PrepMyWeek demo" },
    pages: prepMyWeekPages,
  },
  {
    title: "Appalachian Trail Weather",
    video: {
      src: "/media/projects/atweather.mp4",
      label: "AT Weather walkthrough",
    },
    pages: atWeatherPages,
  },
  {
    title: "GhostTDS",
    video: { src: "/media/projects/ghosttds.mp4", label: "GhostTDS preview" },
    pages: ghostTdsPages,
  },
];

export function PortfolioSection() {
  return (
    <motion.section
      id="portfolio"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto max-w-6xl pt-16 sm:pt-20"
    >
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">Portfolio</h2>
        <p className="mt-2 text-white/80">
          Here are some featured projects showcasing various coding skills.
        </p>
      </div>

      <div className="space-y-12">
        {projects.map((p, idx) => {
          const reverse = idx % 2 === 1;
          return (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-sm md:items-stretch items-start"
            >
              {/* Video (portrait) */}
              <FilmReel
                src={p.video.src}
                poster={p.video.poster}
                caption={p.video.label ?? p.title}
                orientation="portrait"
                className={`w-full ${reverse ? "md:order-2" : "md:order-1"}`}
              />

              {/* Text / Pager */}
              <div
                className={`flex flex-col ${
                  reverse ? "md:order-1" : "md:order-2"
                }`}
              >
                {p.pages ? (
                  <InfoPager title={p.title} pages={p.pages} />
                ) : (
                  <>
                    <h3 className="text-xl sm:text-2xl font-semibold">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-white/80 leading-7">{p.summary}</p>
                  </>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
}
