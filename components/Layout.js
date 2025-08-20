import Head from 'next/head';
import Link from 'next/link';

export default function Layout({ title = 'Sterling Sign Solutions', children }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="inline-flex items-center">
            {/* Use two-segment path to bypass pages/[slug].js */}
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

      <main className="min-h-screen">
        {children}
      </main>

      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-gray-600">
          © {new Date().getFullYear()} Sterling Sign Solutions
        </div>
      </footer>
    </>
  );
}
