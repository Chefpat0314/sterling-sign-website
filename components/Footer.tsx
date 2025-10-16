export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-gray-500 md:flex-row">
        <p>© {new Date().getFullYear()} Sterling Sign Solutions</p>
        <div className="flex items-center gap-4">
          <a
            className="hover:underline hover:underline-offset-4"
            href="/request-a-quote"
          >
            Request a Quote
          </a>
          <a
            className="hover:underline hover:underline-offset-4"
            href="/services"
          >
            Services
          </a>
        </div>
      </div>
    </footer>
  );
}
