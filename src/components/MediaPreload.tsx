import Head from "next/head";

const videos = [
  "/media/projects/prepmyweek.mp4",
  "/media/projects/atweather.mp4",
  "/media/projects/ghosttds.mp4",
  // Ideally convert this to .mp4; keeping for demo:
  "/media/projects/maportfolio.mov",
];

function guessMime(src: string) {
  if (src.endsWith(".mp4")) return "video/mp4";
  if (src.endsWith(".webm")) return "video/webm";
  if (src.endsWith(".mov")) return "video/quicktime";
  return undefined; // let browser figure it out
}

export default function MediaPreload() {
  return (
    <Head>
      {videos.map((src) => {
        const type = guessMime(src);
        return (
          <link
            key={src}
            rel="preload"
            as="video"
            href={src}
            {...(type ? { type } : {})}
            // If you ever host on a different origin, add: crossOrigin="anonymous"
            // You can also hint priority (Chrome): fetchpriority="high"
          />
        );
      })}
    </Head>
  );
}
