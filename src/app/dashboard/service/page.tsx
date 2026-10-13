"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VehicleForm, emptyVehicle } from "@/components/VehicleForm";
import {
  saveRecord,
  newId,
  type ServiceRecord,
  type VehicleInfo,
} from "@/lib/storage";

const SERVICE_OPTIONS = [
  "Oil & Filter Change",
  "Cabin Air Filter",
  "Engine Air Filter",
  "Brake Fluid Flush",
  "Coolant Service",
  "Transmission Fluid Service",
  "Differential Fluid Service",
  "Spark Plugs",
  "Brake Pads (Front)",
  "Brake Pads (Rear)",
  "Brake Rotors",
  "Battery Replacement",
  "Serpentine Belt",
  "Timing Chain Inspection",
  "Carbon Cleaning",
  "Wheel Alignment",
  "Tire Rotation",
  "Tire Replacement",
  "Suspension Repair",
  "Diagnostic Scan",
  "Electrical Diagnosis",
  "A/C Service",
  "Other (see notes)",
];

export default function ServiceOrderPage() {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<VehicleInfo>(emptyVehicle());
  const [tech, setTech] = useState("");
  const [roNumber, setRoNumber] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [laborHours, setLaborHours] = useState("");
  const [partsNotes, setPartsNotes] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<ServiceRecord["status"]>("open");
  const [saving, setSaving] = useState(false);

  const toggle = (item: string) => {
    setSelected((s) =>
      s.includes(item) ? s.filter((x) => x !== item) : [...s, item]
    );
  };

  const handleSave = () => {
    setSaving(true);
    const record: ServiceRecord = {
      id: newId(),
      type: "service",
      createdAt: new Date().toISOString(),
      vehicle,
      tech,
      roNumber,
      services: selected,
      laborHours,
      partsNotes,
      notes,
      status,
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
          </p>
        </div>
        <button type="button" onClick={handleSave} disabled={saving} className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-50">
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

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden mb-6">
        <div className="border-b border-[var(--border)] bg-[var(--background)] px-4 py-2.5">
          <h3 className="text-sm font-semibold text-white">Services Performed</h3>
        </div>
        <div className="grid gap-1 p-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_OPTIONS.map((item) => {
            const checked = selected.includes(item);
            return (
              <label key={item} className={`flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition ${checked ? "bg-[var(--accent)]/10 text-white" : "text-[var(--muted)] hover:bg-white/5"}`}>
                <input type="checkbox" checked={checked} onChange={() => toggle(item)} className="h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]" />
                {item}
              </label>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <label className="block text-sm font-semibold text-white mb-2">Labor Hours</label>
          <input value={laborHours} onChange={(e) => setLaborHours(e.target.value)} className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)]" placeholder="e.g. 2.5" />
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 sm:col-span-2">
          <label className="block text-sm font-semibold text-white mb-2">Parts Notes</label>
          <input value={partsNotes} onChange={(e) => setPartsNotes(e.target.value)} className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)]" placeholder="Parts used, part numbers, quantities…" />
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 mb-6">
        <label className="block text-sm font-semibold text-white mb-2">Additional Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)]" placeholder="Work performed, findings, customer concerns…" />
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={handleSave} disabled={saving} className="rounded-md bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-50">
          {saving ? "Saving…" : "Save Service Order"}
        </button>
      </div>
    </div>
  );
}
