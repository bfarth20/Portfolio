// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://YOUR-SITE.vercel.app"), // update after deploy (or when you add a custom domain)
  title: {
    default: "Benjamin Farthing — Full-Stack Developer",
    template: "%s | Benjamin Farthing",
  },
  description:
    "Full-stack developer in Atlanta building production-grade web and mobile apps. Projects: PrepMyWeek, Appalachian Trail Weather, GhostTDS.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    url: "https://YOUR-SITE.vercel.app",
    title: "Benjamin Farthing — Full-Stack Developer",
    description:
      "Backend-leaning full-stack developer in Atlanta. See projects, stack, and app demos.",
    siteName: "Benjamin Farthing Portfolio",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Benjamin Farthing — Portfolio Preview",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Benjamin Farthing — Full-Stack Developer",
    description:
      "Backend-leaning full-stack developer in Atlanta. See projects, stack, and app demos.",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Script
          id="ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Benjamin Farthing",
              jobTitle: "Software Developer",
              description: "Full-stack developer building web and mobile apps.",
              url: "https://YOUR-SITE.vercel.app",
              sameAs: [
                "www.linkedin.com/in/benjamin-farthing-397a3064",
                "https://github.com/bfarth20",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
