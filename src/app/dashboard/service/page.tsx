"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { VehicleForm, emptyVehicle } from "@/components/VehicleForm";
import {
  saveRecord,
  newId,
  type ServiceRecord,
  type VehicleInfo,
} from "@/lib/storage";
import { generateRoNumber, suggestServices } from "@/lib/automation";
import {
  SERVICE_CATALOG,
  formatMoney,
  sumServices,
  toLineItems,
  priceFor,
} from "@/lib/pricing";

const DEFAULT_LABOR_RATE = 165;

export default function ServiceOrderPage() {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<VehicleInfo>(emptyVehicle());
  const [tech, setTech] = useState("");
  const [roNumber, setRoNumber] = useState(() => generateRoNumber());
  const [selected, setSelected] = useState<string[]>([]);
  const [laborHours, setLaborHours] = useState("");
  const [laborRate, setLaborRate] = useState(String(DEFAULT_LABOR_RATE));
  const [partsNotes, setPartsNotes] = useState("");
  const [partsAmount, setPartsAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<ServiceRecord["status"]>("open");
  const [saving, setSaving] = useState(false);

  const servicesSubtotal = useMemo(() => sumServices(selected), [selected]);
  const hours = parseFloat(laborHours) || 0;
  const rate = parseFloat(laborRate) || 0;
  const laborTotal = hours * rate;
  const parts = parseFloat(partsAmount) || 0;
  const grandTotal = servicesSubtotal + laborTotal + parts;

  const toggle = (item: string) => {
    setSelected((s) =>
      s.includes(item) ? s.filter((x) => x !== item) : [...s, item]
    );
  };

  const handleSave = () => {
    setSaving(true);
    const lineItems = toLineItems(selected);
    const record: ServiceRecord = {
      id: newId(),
      type: "service",
      createdAt: new Date().toISOString(),
      vehicle,
      tech,
      roNumber,
      services: selected,
      lineItems,
      subtotal: servicesSubtotal,
      laborHours,
      laborRate: rate || undefined,
      laborTotal: laborTotal || undefined,
      partsNotes,
      partsAmount: parts || undefined,
      notes,
      status,
      total: grandTotal,
    };
    saveRecord(record);
    setSaving(false);
    router.push("/dashboard/records");
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Service Order</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {selected.length} service{selected.length !== 1 ? "s" : ""} selected
            {grandTotal > 0 ? ` · ${formatMoney(grandTotal)} total` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Service Order"}
        </button>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div>
          <label className="block text-xs font-medium text-[var(--muted)] mb-1">RO / Invoice #</label>
          <input value={roNumber} onChange={(e) => setRoNumber(e.target.value)} className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)]" placeholder="RO-1001" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--muted)] mb-1">Technician</label>
          <input value={tech} onChange={(e) => setTech(e.target.value)} className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)]" placeholder="Tech name" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--muted)] mb-1">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as ServiceRecord["status"])} className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)]">
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <VehicleForm value={vehicle} onChange={setVehicle} />
      </div>

      {suggestServices(vehicle.mileage, vehicle.make).length > 0 && (
        <div className="mb-6 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h3 className="text-sm font-semibold text-white">
              Smart suggestions for {vehicle.mileage || "—"} mi
            </h3>
            <button type="button" onClick={() => { const s = suggestServices(vehicle.mileage, vehicle.make); setSelected((prev) => [...new Set([...prev, ...s])]); }} className="text-xs font-semibold text-[var(--accent)] hover:underline">
              Apply all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestServices(vehicle.mileage, vehicle.make).map((s) => (
              <button key={s} type="button" onClick={() => setSelected((prev) => prev.includes(s) ? prev : [...prev, s])} className={`rounded-full border px-3 py-1 text-xs transition ${selected.includes(s) ? "border-[var(--accent)] bg-[var(--accent)]/20 text-white" : "border-[var(--border)] text-[var(--muted)] hover:text-white"}`}>
                + {s} <span className="opacity-70">{priceFor(s) > 0 ? formatMoney(priceFor(s)) : "quote"}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden mb-6">
        <div className="border-b border-[var(--border)] bg-[var(--background)] px-4 py-2.5 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Services & pricing</h3>
          <span className="text-xs text-[var(--muted)]">Subtotal {formatMoney(servicesSubtotal)}</span>
        </div>
        <div className="grid gap-1 p-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATALOG.map((item) => {
            const checked = selected.includes(item.name);
            return (
              <label key={item.name} className={`flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition ${checked ? "bg-[var(--accent)]/10 text-white" : "text-[var(--muted)] hover:bg-white/5"}`}>
                <span className="flex items-center gap-2.5 min-w-0">
                  <input type="checkbox" checked={checked} onChange={() => toggle(item.name)} className="h-4 w-4 shrink-0 rounded border-[var(--border)] accent-[var(--accent)]" />
                  <span className="truncate">{item.name}{item.note ? <span className="text-[10px] opacity-60"> · {item.note}</span> : null}</span>
                </span>
                <span className={`shrink-0 text-xs font-medium tabular-nums ${checked ? "text-emerald-400" : "text-[var(--muted)]"}`}>
                  {item.price > 0 ? formatMoney(item.price) : "Quote"}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <label className="block text-sm font-semibold text-white mb-2">Extra labor hours</label>
          <input value={laborHours} onChange={(e) => setLaborHours(e.target.value)} className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)]" placeholder="e.g. 1.5" />
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <label className="block text-sm font-semibold text-white mb-2">Labor rate ($/hr)</label>
          <input value={laborRate} onChange={(e) => setLaborRate(e.target.value)} className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)]" placeholder="165" />
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <label className="block text-sm font-semibold text-white mb-2">Extra parts ($)</label>
          <input value={partsAmount} onChange={(e) => setPartsAmount(e.target.value)} className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)]" placeholder="0" />
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 mb-6">
        <label className="block text-sm font-semibold text-white mb-2">Parts notes</label>
        <input value={partsNotes} onChange={(e) => setPartsNotes(e.target.value)} className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)]" placeholder="Parts used, part numbers, quantities…" />
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 mb-6">
        <label className="block text-sm font-semibold text-white mb-2">Additional notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)]" placeholder="Work performed, findings, customer concerns…" />
      </div>

      <div className="mb-6 rounded-xl border border-[var(--accent)]/40 bg-[var(--card)] p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Estimate total</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-[var(--muted)]">
            <span>Services package</span>
            <span className="tabular-nums text-white">{formatMoney(servicesSubtotal)}</span>
          </div>
          <div className="flex justify-between text-[var(--muted)]">
            <span>Extra labor{hours > 0 ? ` (${hours}h × ${formatMoney(rate)})` : ""}</span>
            <span className="tabular-nums text-white">{formatMoney(laborTotal)}</span>
          </div>
          <div className="flex justify-between text-[var(--muted)]">
            <span>Extra parts</span>
            <span className="tabular-nums text-white">{formatMoney(parts)}</span>
          </div>
          <div className="border-t border-[var(--border)] pt-2 flex justify-between font-semibold text-white">
            <span>Grand total</span>
            <span className="tabular-nums text-lg text-emerald-400">{formatMoney(grandTotal)}</span>
          </div>
        </div>
        <p className="mt-3 text-[10px] text-[var(--muted)]">
          Typical independent Euro-specialty shop estimates (USD). Actual price may vary by vehicle and parts. Quote items need a written estimate.
        </p>
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={handleSave} disabled={saving} className="rounded-md bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-50">
          {saving ? "Saving…" : "Save Service Order"}
        </button>
      </div>
    </div>
  );
}
