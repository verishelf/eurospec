"use client";

import { useEffect, useState } from "react";
import {
  getRecords,
  deleteRecord,
  saveRecord,
  type JobRecord,
  type ServiceRecord,
} from "@/lib/storage";

export default function RecordsPage() {
  const [records, setRecords] = useState<JobRecord[]>([]);
  const [filter, setFilter] = useState<"all" | "inspection" | "service">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const refresh = () => setRecords(getRecords());

  useEffect(() => {
    refresh();
  }, []);

  const filtered =
    filter === "all" ? records : records.filter((r) => r.type === filter);

  const handleDelete = (id: string) => {
    if (!confirm("Delete this record?")) return;
    deleteRecord(id);
    refresh();
    if (expanded === id) setExpanded(null);
  };

  const setStatus = (r: ServiceRecord, status: ServiceRecord["status"]) => {
    saveRecord({ ...r, status });
    refresh();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Records</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {filtered.length} record{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          {(["all", "inspection", "service"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition ${
                filter === f
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--card)] text-[var(--muted)] border border-[var(--border)] hover:text-white"
              }`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-12 text-center text-sm text-[var(--muted)]">
          No records found. Create an inspection or service order to get started.
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((r) => {
            const open = expanded === r.id;
            return (
              <li key={r.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpanded(open ? null : r.id)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-white/[0.02]"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {r.vehicle.year} {r.vehicle.make} {r.vehicle.model}
                      {r.vehicle.customer ? ` — ${r.vehicle.customer}` : ""}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {r.type === "inspection" ? "Inspection" : "Service"} · RO:{" "}
                      {r.roNumber || "—"} · Tech: {r.tech || "—"} ·{" "}
                      {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.type === "service" && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        r.status === "completed"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : r.status === "in_progress"
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-blue-500/15 text-blue-400"
                      }`}>
                        {r.status.replace("_", " ")}
                      </span>
                    )}
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      r.type === "inspection"
                        ? "bg-blue-500/15 text-blue-400"
                        : "bg-emerald-500/15 text-emerald-400"
                    }`}>
                      {r.type}
                    </span>
                    <span className="text-[var(--muted)] text-xs">{open ? "▲" : "▼"}</span>
                  </div>
                </button>

                {open && (
                  <div className="border-t border-[var(--border)] px-4 py-4 space-y-3 text-sm">
                    <div className="grid gap-2 sm:grid-cols-2 text-[var(--muted)]">
                      <p><span className="text-white/70">VIN:</span> {r.vehicle.vin || "—"}</p>
                      <p><span className="text-white/70">Mileage:</span> {r.vehicle.mileage || "—"}</p>
                      <p><span className="text-white/70">Phone:</span> {r.vehicle.phone || "—"}</p>
                      <p><span className="text-white/70">Engine:</span> {r.vehicle.engine || "—"}</p>
                    </div>

                    {r.type === "inspection" && (
                      <>
                        {(() => {
                          const checked = Object.entries(r.checks)
                            .filter(([, v]) => v)
                            .map(([k]) => k);
                          if (checked.length === 0) {
                            return (
                              <p className="text-[var(--muted)]">
                                <span className="text-white/70">Checked items:</span> none
                              </p>
                            );
                          }
                          const groups: { [section: string]: string[] } = {};
                          for (const key of checked) {
                            const idx = key.indexOf(":");
                            const section = idx >= 0 ? key.slice(0, idx) : "Other";
                            const item = idx >= 0 ? key.slice(idx + 1) : key;
                            if (!groups[section]) groups[section] = [];
                            groups[section].push(item);
                          }
                          return (
                            <div>
                              <p className="text-white/70 mb-2">
                                Checked items ({checked.length})
                              </p>
                              <div className="space-y-3">
                                {Object.entries(groups).map(([section, items]) => (
                                  <div key={section}>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] mb-1">
                                      {section}
                                    </p>
                                    <ul className="grid gap-0.5 sm:grid-cols-2 list-none">
                                      {items.map((item) => (
                                        <li
                                          key={item}
                                          className="flex items-center gap-2 text-[var(--muted)]"
                                        >
                                          <span className="text-emerald-400 text-xs">✓</span>
                                          {item}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                        {r.notes && (
                          <p className="text-[var(--muted)]">
                            <span className="text-white/70">Notes:</span> {r.notes}
                          </p>
                        )}
                        {r.recommendations && (
                          <p className="text-[var(--muted)]">
                            <span className="text-white/70">Recommendations:</span>{" "}
                            {r.recommendations}
                          </p>
                        )}
                      </>
                    )}

                    {r.type === "service" && (
                      <>
                        <div>
                          <p className="text-white/70 mb-1">Services:</p>
                          <ul className="list-disc list-inside text-[var(--muted)]">
                            {r.services.map((s) => (
                              <li key={s}>{s}</li>
                            ))}
                          </ul>
                        </div>
                        {r.laborHours && (
                          <p className="text-[var(--muted)]">
                            <span className="text-white/70">Labor:</span> {r.laborHours} hrs
                          </p>
                        )}
                        {r.partsNotes && (
                          <p className="text-[var(--muted)]">
                            <span className="text-white/70">Parts:</span> {r.partsNotes}
                          </p>
                        )}
                        {r.notes && (
                          <p className="text-[var(--muted)]">
                            <span className="text-white/70">Notes:</span> {r.notes}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {(["open", "in_progress", "completed"] as const).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setStatus(r, st)}
                              className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize ${
                                r.status === st
                                  ? "bg-[var(--accent)] text-white"
                                  : "border border-[var(--border)] text-[var(--muted)] hover:text-white"
                              }`}
                            >
                              {st.replace("_", " ")}
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="pt-2">
                      <button type="button" onClick={() => handleDelete(r.id)} className="text-xs text-red-400 hover:text-red-300">
                        Delete record
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
