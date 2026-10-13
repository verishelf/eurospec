"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRecords, type JobRecord } from "@/lib/storage";

export default function DashboardOverview() {
  const [records, setRecords] = useState<JobRecord[]>([]);

  useEffect(() => {
    setRecords(getRecords());
  }, []);

  const inspections = records.filter((r) => r.type === "inspection").length;
  const services = records.filter((r) => r.type === "service").length;
  const open = records.filter(
    (r) => r.type === "service" && r.status !== "completed"
  ).length;

  const recent = records.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Manage inspections, service orders, and customer records.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Inspections", value: inspections, color: "text-blue-400" },
          { label: "Service Orders", value: services, color: "text-emerald-400" },
          { label: "Open Jobs", value: open, color: "text-amber-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
              {s.label}
            </p>
            <p className={`mt-1 text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/inspection"
          className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:border-[var(--accent)]/50"
        >
          <div className="text-2xl mb-2">🔍</div>
          <h2 className="font-semibold text-white group-hover:text-[var(--accent)]">
            New Multi-Point Inspection
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Fill out a full vehicle inspection checklist for a customer.
          </p>
        </Link>
        <Link
          href="/dashboard/service"
          className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:border-[var(--accent)]/50"
        >
          <div className="text-2xl mb-2">🔧</div>
          <h2 className="font-semibold text-white group-hover:text-[var(--accent)]">
            New Service Order
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Create a service order with selected work items and notes.
          </p>
        </Link>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
          <h2 className="text-sm font-semibold text-white">Recent Records</h2>
          <Link
            href="/dashboard/records"
            className="text-xs text-[var(--accent)] hover:underline"
          >
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-[var(--muted)]">
            No records yet. Start with an inspection or service order.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {recent.map((r) => (
              <li key={r.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-white">
                    {r.vehicle.year} {r.vehicle.make} {r.vehicle.model}
                    {r.vehicle.customer ? ` — ${r.vehicle.customer}` : ""}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {r.type === "inspection" ? "Inspection" : "Service"} ·{" "}
                    {new Date(r.createdAt).toLocaleDateString()}
                    {r.type === "service" ? ` · ${r.status}` : ""}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    r.type === "inspection"
                      ? "bg-blue-500/15 text-blue-400"
                      : "bg-emerald-500/15 text-emerald-400"
                  }`}
                >
                  {r.type}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
