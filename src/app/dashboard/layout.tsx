"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/inspection", label: "Inspection Form", icon: "🔍" },
  { href: "/dashboard/service", label: "Service Order", icon: "🔧" },
  { href: "/dashboard/records", label: "Records", icon: "📁" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      <aside className="hidden w-56 shrink-0 border-r border-[var(--border)] bg-[var(--card)] md:block">
        <div className="sticky top-16 p-4">
          <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Dashboard
          </p>
          <nav className="flex flex-col gap-1">
            {nav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                      : "text-[var(--muted)] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 border-t border-[var(--border)] pt-4">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--muted)] hover:text-white"
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </aside>

      <div className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-[var(--border)] bg-[var(--card)] md:hidden">
        {nav.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
                active ? "text-[var(--accent)]" : "text-[var(--muted)]"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label.split(" ")[0]}
            </Link>
          );
        })}
      </div>

      <div className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
