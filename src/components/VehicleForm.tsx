"use client";

import type { VehicleInfo } from "@/lib/storage";

type Props = {
  value: VehicleInfo;
  onChange: (v: VehicleInfo) => void;
};

const empty: VehicleInfo = {
  customer: "",
  phone: "",
  email: "",
  year: "",
  make: "",
  model: "",
  vin: "",
  mileage: "",
  license: "",
  engine: "",
  transmission: "",
  drivetrain: "",
};

export function emptyVehicle(): VehicleInfo {
  return { ...empty };
}

export function VehicleForm({ value, onChange }: Props) {
  const set = (key: keyof VehicleInfo, val: string) =>
    onChange({ ...value, [key]: val });

  const field = (
    label: string,
    key: keyof VehicleInfo,
    placeholder = "",
    className = ""
  ) => (
    <div className={className}>
      <label className="block text-xs font-medium text-[var(--muted)] mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value[key]}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
      />
    </div>
  );

  return (
    <div className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-white">Customer & Vehicle</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {field("Customer", "customer", "Full name")}
        {field("Phone", "phone", "(555) 000-0000")}
        {field("Email", "email", "email@example.com")}
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        {field("Year", "year", "2015")}
        {field("Make", "make", "Audi")}
        {field("Model", "model", "A4 Quattro")}
        {field("Mileage", "mileage", "135000")}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {field("VIN", "vin", "WAU...")}
        {field("License Plate", "license")}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {field("Engine / Fuel", "engine", "2.0 TFSI Flex")}
        {field("Transmission", "transmission", "8-Spd Tiptronic")}
        {field("Drivetrain", "drivetrain", "Quattro AWD")}
      </div>
    </div>
  );
}
