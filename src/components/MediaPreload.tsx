// components/MediaPreload.tsx
import Head from "next/head";

const videos = [
  "/media/projects/prepmyweek.mp4",
  "/media/projects/atweather.mp4",
  "/media/projects/ghosttds.mp4",
  "/media/projects/maportfolio.mov",
];

export default function MediaPreload() {
  return (
    <Head>
      {videos.map((src) => (
        <link key={src} rel="preload" as="video" href={src} type="video/mp4" />
      ))}
    </Head>
  );
}
