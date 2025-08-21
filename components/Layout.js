import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({
  title = 'Sterling Sign Solutions',
  description = 'High-quality custom signage — design, fabrication, installation, and maintenance for businesses across industries.',
  children,
}) {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${baseUrl}${router.asPath === '/' ? '' : router.asPath}`;
  const ogImage = `${baseUrl}/og-image.png`;
  const siteName = 'Sterling Sign Solutions';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />

        {/* Favicon */}
        <link rel="icon" href="/favicon.png" />

        {/* Canonical */}
        <link rel="canonical" href={url} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:alt" content="Sterling Sign Solutions" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="inline-flex items-center">
            <img
              src="/images/logo.png"
              alt="Sterling Sign Solutions"
              width="160"
              height="40"
              style={{ display: 'block' }}
            />
          </Link>

          <nav className="ml-auto flex items-center gap-6 text-sm">
            <Link href="/products" className="hover:underline">Products</Link>
            <Link href="/request-a-quote" className="hover:underline">Request a Quote</Link>
            <Link href="/about" className="hover:underline">About</Link>
          </nav>
        </div>
      </header>

      <main className="min-h-screen">{children}</main>

      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-gray-600">
          © {new Date().getFullYear()} Sterling Sign Solutions
        </div>
      </footer>
    </>
  );
}
