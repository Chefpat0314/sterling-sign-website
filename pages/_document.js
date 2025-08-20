import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Optional: preload logo for quick paint */}
        <link rel="preload" as="image" href="/images/logo.svg" />
        {/* Lightly hint the browser a video will load (no blocking) */}
        <link rel="preload" as="video" href="/videos/hero.mp4" />
      </Head>
      <body className="bg-white text-slate-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
