// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Preload the actual logo you use */}
        <link rel="preload" as="image" href="/images/logo.png" />
        {/* Remove or keep this only if you actually use a hero video */}
        {/* <link rel="preload" as="video" href="/videos/hero.mp4" /> */}
      </Head>
      <body className="bg-white text-slate-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
