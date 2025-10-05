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
        <noscript>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fef3c7',
            borderBottom: '2px solid #f59e0b',
            padding: '1rem',
            textAlign: 'center',
            zIndex: 9999
          }}>
            <p style={{ margin: 0, color: '#92400e' }}>
              <strong>JavaScript Required:</strong> This website requires JavaScript to function properly. 
              Please enable JavaScript in your browser or contact us directly at{' '}
              <a href="tel:+1234567890" style={{ color: '#92400e', textDecoration: 'underline' }}>
                (123) 456-7890
              </a>
            </p>
          </div>
        </noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
