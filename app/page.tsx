export default function Home() {
  return (
    <main className="min-h-screen px-6 py-16 bg-white">
      <h1 className="text-4xl font-bold text-gray-900">
        Sterling Sign Solutions
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Commercial signage — design, manufacture, and installation.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <a href="/industries" className="rounded-xl border border-gray-200 p-4 hover:bg-gray-50">
          Industries
        </a>
        <a href="/services" className="rounded-xl border border-gray-200 p-4 hover:bg-gray-50">
          Services
        </a>
        <a href="/portfolio" className="rounded-xl border border-gray-200 p-4 hover:bg-gray-50">
          Portfolio
        </a>
        <a href="/request-a-quote" className="rounded-xl border border-gray-200 p-4 hover:bg-gray-50">
          Request a Quote
        </a>
      </div>

      <footer className="mt-16 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
        <a className="hover:underline hover:underline-offset-4" href="https://nextjs.org/docs" target="_blank" rel="noreferrer">
          Docs
        </a>
        <a className="hover:underline hover:underline-offset-4" href="https://vercel.com/templates/next.js" target="_blank" rel="noreferrer">
          Templates
        </a>
        <a className="hover:underline hover:underline-offset-4" href="https://github.com/vercel/next.js/tree/canary/examples" target="_blank" rel="noreferrer">
          Examples
        </a>
      </footer>
    </main>
  );
}
