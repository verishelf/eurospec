"use client";

import { useEffect, useState } from "react";
import {
  getRecords,
  deleteRecord,
  saveRecord,
  type JobRecord,
  type ServiceRecord,
} from "@/lib/storage";
import { downloadRecordPdf } from "@/lib/pdf";
import { formatMoney, priceFor } from "@/lib/pricing";

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
                      {r.type === "service" && r.total != null
                        ? ` · ${formatMoney(r.total)}`
                        : ""}
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
                                        <li key={item} className="flex items-center gap-2 text-[var(--muted)]">
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
                            <span className="text-white/70">Recommendations:</span> {r.recommendations}
                          </p>
                        )}
                      </>
                    )}

                    {r.type === "service" && (
                      <>
                        <div>
                          <p className="text-white/70 mb-1">Services:</p>
                          <ul className="space-y-1 text-[var(--muted)]">
                            {(r.lineItems && r.lineItems.length
                              ? r.lineItems
                              : r.services.map((s) => ({
                                  name: s,
                                  price: priceFor(s),
                                }))
                            ).map((item) => (
                              <li key={item.name} className="flex justify-between gap-4 text-sm">
                                <span>{item.name}</span>
                                <span className="tabular-nums text-white/80">
                                  {item.price > 0 ? formatMoney(item.price) : "Quote"}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {(r.subtotal != null || r.laborTotal || r.partsAmount || r.total != null) && (
                          <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 space-y-1 text-sm">
                            {r.subtotal != null && (
                              <div className="flex justify-between text-[var(--muted)]">
                                <span>Services subtotal</span>
                                <span className="tabular-nums text-white">{formatMoney(r.subtotal)}</span>
                              </div>
                            )}
                            {!!r.laborTotal && (
                              <div className="flex justify-between text-[var(--muted)]">
                                <span>
                                  Extra labor
                                  {r.laborHours
                                    ? ` (${r.laborHours}h${r.laborRate ? ` × ${formatMoney(r.laborRate)}` : ""})`
                                    : ""}
                                </span>
                                <span className="tabular-nums text-white">{formatMoney(r.laborTotal)}</span>
                              </div>
                            )}
                            {!!r.partsAmount && (
                              <div className="flex justify-between text-[var(--muted)]">
                                <span>Extra parts</span>
                                <span className="tabular-nums text-white">{formatMoney(r.partsAmount)}</span>
                              </div>
                            )}
                            {r.total != null && (
                              <div className="flex justify-between font-semibold text-white border-t border-[var(--border)] pt-1 mt-1">
                                <span>Total</span>
                                <span className="tabular-nums text-emerald-400">{formatMoney(r.total)}</span>
                              </div>
                            )}
                          </div>
                        )}
                        {r.partsNotes && (
                          <p className="text-[var(--muted)]">
                            <span className="text-white/70">Parts notes:</span> {r.partsNotes}
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

                    <div className="pt-2 flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        onClick={() => downloadRecordPdf(r)}
                        className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--accent-hover)]"
                      >
                        Download PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
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
