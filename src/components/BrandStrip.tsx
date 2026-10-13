"use client";

import { BRANDS, brandLogoUrl } from "@/lib/brands";

type Props = {
  variant?: "hero" | "compact";
  onSelect?: (make: string) => void;
  selected?: string;
};

export function BrandStrip({ variant = "hero", onSelect, selected }: Props) {
  if (variant === "compact") {
    return (
      <div className="flex flex-wrap gap-2">
        {BRANDS.map((b) => {
          const active =
            selected &&
            (selected.toLowerCase() === b.name.toLowerCase() ||
              selected.toLowerCase() === b.id);
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelect?.(b.name)}
              className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                active
                  ? "border-[var(--accent)] bg-[var(--accent)]/15 text-white"
                  : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-white/20 hover:text-white"
              }`}
              title={b.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brandLogoUrl(b.icon, "ffffff")}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 opacity-90"
                loading="lazy"
              />
              {b.name}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="border-y border-[var(--border)] bg-[var(--card)]/50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="mb-5 text-center text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
          Specialist care for premium European marques
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {BRANDS.map((b) => (
            <div
              key={b.id}
              className="group flex flex-col items-center gap-2 opacity-70 transition hover:opacity-100"
              title={b.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brandLogoUrl(b.icon, "e8eef7")}
                alt={b.name}
                width={36}
                height={36}
                className="h-8 w-8 sm:h-9 sm:w-9 object-contain grayscale group-hover:grayscale-0 transition"
                loading="lazy"
              />
              <span className="text-[10px] font-medium text-[var(--muted)] group-hover:text-white">
                {b.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
