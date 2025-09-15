"use client";

import { FilmReel } from "@/components/FilmReel";
import { InfoPager, PagerPage } from "@/components/InfoPager";

type Project = {
  title: string;
  summary?: string;
  video: { src: string; poster?: string; label?: string };
  pages?: PagerPage[]; // when present, we render InfoPager
  links?: {
    web?: string; // e.g. https://prepmyweek.com
    ios?: string; // e.g. https://apps.apple.com/us/app/idXXXXXXXXX
    android?: string; // e.g. https://play.google.com/store/apps/details?id=com.example
    github?: string; // optional
  };
};

function ProjectLinks({ links }: { links?: Project["links"] }) {
  if (!links) return null;
  const btn =
    "rounded-full bg-white/12 hover:bg-white/20 px-3.5 py-2 text-sm font-medium ring-1 ring-white/15";
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {links.web && (
        <a
          className={btn}
          href={links.web}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Web Application"
        >
          Web Application
        </a>
      )}
      {links.ios && (
        <a
          className={btn}
          href={links.ios}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open on the iOS App Store"
        >
          iOS App Store
        </a>
      )}
      {links.android && (
        <a
          className={btn}
          href={links.android}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open on Google Play"
        >
          Google Play
        </a>
      )}
      {links.github && (
        <a
          className={btn}
          href={links.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open GitHub repository"
        >
          GitHub
        </a>
      )}
    </div>
  );
}

const prepMyWeekPages: PagerPage[] = [
  {
    heading: "Problem",
    bullets: [
      "Most meal planners ignore a basic constraint: you want to shop at one store. Mixing recipes that require ingredients from multiple chains means extra trips or substitutions. I built PrepMyWeek as a store-first planner: pick your preferred chain, see only recipes whose ingredients are available there, then get a section ordered grocery list.",
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

const maPortfolioPages: PagerPage[] = [
  {
    heading: "Problem",
    bullets: [
      "Build a custom portfolio that the client can update without recurring CMS fees or calling a developer.",
      "Use a familiar tool (Notion) as the content source for text, images, and simple metadata.",
      "Handle portrait-heavy artwork: avoid whitespace on desktop while keeping mobile layouts pretty.",
      "Add basic curation features (role filter, featured slideshow) driven by Notion fields.",
      "Keep the stack fast to ship and cheap to run: Next.js + Vercel with a custom domain (monica-alexander.com).",
    ],
  },
  {
    heading: "Headless CMS implementation",
    bullets: [
      "Hooked the site to Notion as the single source of truth: **Site KV**, **Works**, and **Assets** databases.",
      "Site KV powers page copy & settings (e.g., `about_bio`, `contact_message`, social links) with `whitespace-pre-wrap` for clean line breaks.",
      "Works DB drives the portfolio grid & featured slideshow: title/slug/year, **Role (select)**, **Featured** flag, thumbnail + image gallery.",
      "Assets DB resolves named media via a helper (`getAssetUrl(name)`), e.g., `headshot`, `headshot_clients`, `headshot_charity`.",
      "Server components fetch via Notion Data Sources API; pages use **ISR (`revalidate = 600`)** so Notion edits publish automatically ~10 min later—no CMS fees.",
      "Type-safe mapping with graceful fallbacks; `next/image` optimizes remote Notion/S3 URLs (hosts whitelisted in `next.config`).",
      "URL-driven role filter (`?role=Illustration`) enables easy curation while keeping all content edits inside Notion.",
    ],
  },
  {
    heading: "Reusable components & filters",
    bullets: [
      "FeaturedSlideshow: drop-in hero that uses mobile contain / desktop cover, pauses on hover/hidden tab, load-gated auto-advance, optional per-slide `objectPosition`, and typed props for `intervalMs`, `optimize`, and aspect classes.",
      "ArtworkCard: lightweight, reusable image card (`src`, `fullSrc`, `title`, `alt`) using `next/image` for optimization; clean rounded styling and hover affordances, ready to slot into any grid.",
      "RoleFilter: single-select chip bar powered by Notion’s `Role` (select); syncs with URL via `?role=...`, uses accessible `aria-pressed`, and works behind a page-level `<Suspense>`.",
      "Portfolio grid: responsive 2-column on mobile, 3-column on tablet/desktop; filters apply client-side from the URL—no extra requests or page reloads.",
      "Composability: all pieces are prop-driven and type-safe, so future portfolio sites can reuse them by swapping only the data mapper from Notion.",
    ],
  },
];

const projects: Project[] = [
  {
    title: "PrepMyWeek",
    video: { src: "/media/projects/prepmyweek.mp4", label: "PrepMyWeek demo" },
    pages: prepMyWeekPages,
    links: {
      web: "https://prepmyweek.com",
      ios: "https://apps.apple.com/us/app/prepmyweeklite/id6748859377",
      android:
        "https://play.google.com/store/apps/details?id=com.benfarthing.prepmyweek&pcampaignid=web_share",
      github: "https://github.com/bfarth20/prepmyweek",
    },
  },
  {
    title: "Appalachian Trail Weather",
    video: {
      src: "/media/projects/atweather.mp4",
      label: "AT Weather walkthrough",
    },
    pages: atWeatherPages,
    links: {
      ios: "https://apps.apple.com/us/app/appalachian-trail-weather/id6751362485",
    },
  },
  {
    title: "GhostTDS",
    video: { src: "/media/projects/ghosttds.mp4", label: "GhostTDS preview" },
    pages: ghostTdsPages,
    links: {
      ios: "https://apps.apple.com/us/app/ghosttds/id6751655398",
    },
  },
  {
    title: "Artist Portfolio Headless CMS",
    pages: maPortfolioPages,
    video: {
      src: "/media/projects/maportfolio.mov",
      label: "Monica Alexander site walkthrough",
    },
    links: {
      web: "https://monica-alexander.com",
      github: "https://github.com/bfarth20/malexanderportfolio",
    },
  },
];

export function PortfolioSection() {
  return (
    <section
      id="portfolio"
      className="mx-auto max-w-6xl pt-8 sm:pt-12 !opacity-100"
    >
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Portfolio</h2>
        <p className="mt-2 text-white/80">
          Here are some featured projects showcasing various coding skills.
        </p>
      </div>

      <div className="space-y-12">
        {projects.map((p, idx) => {
          const reverse = idx % 2 === 1;
          return (
            <article
              key={p.title}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-sm md:items-stretch items-start !opacity-100"
            >
              <FilmReel
                src={p.video.src}
                poster={p.video.poster}
                caption={p.video.label ?? p.title}
                orientation="portrait"
                className={`w-full ${reverse ? "md:order-2" : "md:order-1"}`}
              />

              <div
                className={`flex flex-col ${
                  reverse ? "md:order-1" : "md:order-2"
                } h-full`}
              >
                {p.pages ? (
                  <InfoPager
                    title={p.title}
                    pages={p.pages}
                    className="h-full"
                  />
                ) : (
                  <>
                    <h3 className="text-xl sm:text-2xl font-semibold">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-white/80 leading-7">{p.summary}</p>
                  </>
                )}
                <ProjectLinks links={p.links} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
