import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Image
              src="/logo.png"
              alt="EuroSpec Systems"
              width={160}
              height={40}
              className="h-9 w-auto mb-4"
            />
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Precision Automotive Technology. Expert care for European vehicles
              with factory-level diagnostics and craftsmanship.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-white transition">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li>Email: service@eurospec.systems</li>
              <li>Phone: (555) 123-4567</li>
              <li className="pt-2 text-xs">
                Hours: Mon–Fri 8am–6pm · Sat 9am–2pm
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} EuroSpec Systems. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
