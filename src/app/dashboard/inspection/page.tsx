"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VehicleForm, emptyVehicle } from "@/components/VehicleForm";
import {
  saveRecord,
  newId,
  type InspectionRecord,
  type VehicleInfo,
} from "@/lib/storage";
import { generateRoNumber, suggestInspectionFocus } from "@/lib/automation";

const SECTIONS: { title: string; items: string[] }[] = [
  {
    title: "Fluids",
    items: [
      "Engine Oil & Filter",
      "Engine Coolant",
      "Brake Fluid",
      "Transmission Fluid",
      "Power Steering Fluid",
      "Differential / Transfer Case",
      "Washer Fluid",
      "A/C Refrigerant",
    ],
  },
  {
    title: "Filters & Service Items",
    items: [
      "Engine Air Filter",
      "Cabin / Pollen Filter",
      "Fuel Filter",
      "Spark Plugs",
      "Serpentine / Accessory Belt",
      "Timing Belt / Chain",
      "Battery",
      "Wiper Blades",
    ],
  },
  {
    title: "Brakes",
    items: [
      "Front pads",
      "Rear pads",
      "Front rotors",
      "Rear rotors",
      "Brake hoses & lines",
      "Calipers & hardware",
      "Parking brake",
      "Brake fluid condition",
    ],
  },
  {
    title: "Tires & Wheels",
    items: [
      "Tread depth",
      "Tire pressure / TPMS",
      "Tire condition",
      "Wheel condition",
      "Spare tire",
      "Wheel bearings",
      "Tire rotation",
      "Alignment needed",
    ],
  },
  {
    title: "Underhood",
    items: [
      "Oil leaks",
      "Coolant leaks",
      "Drive belts",
      "Hoses",
      "Air intake",
      "PCV system",
      "Engine mounts",
      "Wiring / connectors",
    ],
  },
  {
    title: "Under Vehicle",
    items: [
      "Exhaust system",
      "Driveshaft / CV boots",
      "Suspension components",
      "Shocks / struts",
      "Steering rack / linkage",
      "Fuel lines & tank",
      "Underbody corrosion",
      "Transmission / diff seals",
    ],
  },
  {
    title: "Electrical & Controls",
    items: [
      "Headlights / exterior lights",
      "Brake / turn signals",
      "Horn",
      "Wipers & washers",
      "Power windows / locks",
      "HVAC operation",
      "OBD scan / codes",
      "Warning lights",
    ],
  },
  {
    title: "Road Test",
    items: [
      "Engine performance / idle",
      "Transmission shifts",
      "Brake feel",
      "Steering response",
      "Noises / vibrations",
      "A/C & heater",
    ],
  },
];

export default function InspectionPage() {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<VehicleInfo>(emptyVehicle());
  const [tech, setTech] = useState("");
  const [roNumber, setRoNumber] = useState(() => generateRoNumber());
  const [checks, setChecks] = useState<{ [key: string]: boolean }>({});
  const [notes, setNotes] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [saving, setSaving] = useState(false);

  const toggle = (key: string) =>
    setChecks((c) => ({ ...c, [key]: !c[key] }));

  const checkedCount = Object.values(checks).filter(Boolean).length;
  const totalItems = SECTIONS.reduce((n, s) => n + s.items.length, 0);

  const handleSave = () => {
    setSaving(true);
    const record: InspectionRecord = {
      id: newId(),
      type: "inspection",
      createdAt: new Date().toISOString(),
      vehicle,
      tech,
      roNumber,
      checks,
      notes,
      recommendations,
    };
    saveRecord(record);
    setSaving(false);
    router.push("/dashboard/records");
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Multi-Point Inspection</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {checkedCount} of {totalItems} items checked
          </p>
        </div>
        <button type="button" onClick={handleSave} disabled={saving} className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-50">
          {saving ? "Saving…" : "Save Inspection"}
        </button>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div>
          <label className="block text-xs font-medium text-[var(--muted)] mb-1">RO / Invoice #</label>
          <input value={roNumber} onChange={(e) => setRoNumber(e.target.value)} className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)]" placeholder="RO-1001" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--muted)] mb-1">Technician</label>
          <input value={tech} onChange={(e) => setTech(e.target.value)} className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)]" placeholder="Tech name" />
        </div>
      </div>

      <div className="mb-6">
        <VehicleForm value={vehicle} onChange={setVehicle} />
      </div>

      {suggestInspectionFocus(vehicle.mileage).length > 0 && (
        <div className="mb-6 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-4">
          <h3 className="text-sm font-semibold text-white mb-2">
            Priority checks at {vehicle.mileage || "—"} mi
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestInspectionFocus(vehicle.mileage).map((item) => (
              <span
                key={item}
                className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs text-[var(--muted)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {SECTIONS.map((section) => (
          <div key={section.title} className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
            <div className="border-b border-[var(--border)] bg-[var(--background)] px-4 py-2.5">
              <h3 className="text-sm font-semibold text-white">{section.title}</h3>
            </div>
            <div className="grid gap-1 p-3 sm:grid-cols-2">
              {section.items.map((item) => {
                const key = `${section.title}:${item}`;
                const checked = !!checks[key];
                return (
                  <label key={key} className={`flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition ${checked ? "bg-[var(--accent)]/10 text-white" : "text-[var(--muted)] hover:bg-white/5"}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggle(key)} className="h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]" />
                    {item}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <label className="block text-sm font-semibold text-white mb-2">Technician Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)]" placeholder="Observations, measurements, concerns…" />
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <label className="block text-sm font-semibold text-white mb-2">Recommendations</label>
          <textarea value={recommendations} onChange={(e) => setRecommendations(e.target.value)} rows={4} className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)]" placeholder="Recommended services or follow-up…" />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button type="button" onClick={handleSave} disabled={saving} className="rounded-md bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-50">
          {saving ? "Saving…" : "Save Inspection"}
        </button>
      </div>
    </div>
  );
}
