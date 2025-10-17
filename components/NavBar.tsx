"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/industries", label: "Industries" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/request-a-quote", label: "Request a Quote" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <Link href="/" className="text-lg font-semibold">
          Sterling Sign Solutions
        </Link>

        <button
          className="rounded border px-3 py-1 text-sm md:hidden"
          onClick={() => setOpen((s) => !s)}
          aria-label="Toggle menu"
        >
          Menu
        </button>

        <nav className="hidden gap-6 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm hover:text-gray-900 ${
                  active ? "text-gray-900 font-medium" : "text-gray-600"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden">
          <ul className="space-y-1 border-t border-gray-200 px-4 py-3">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded px-2 py-2 text-sm ${
                      active
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
