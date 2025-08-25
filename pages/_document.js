// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;

  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preload" as="image" href="/images/logo.png" />

        {/* Google Analytics 4 */}
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
      </Head>
      <body className="bg-white text-slate-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
