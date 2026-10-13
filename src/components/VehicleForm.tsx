"use client";

import { useState } from "react";
import type { VehicleInfo } from "@/lib/storage";
import { BrandStrip } from "@/components/BrandStrip";
import { decodeVin, applyVinToVehicle } from "@/lib/automation";
import { matchBrand, brandLogoUrl } from "@/lib/brands";

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
  const [decoding, setDecoding] = useState(false);
  const [vinMsg, setVinMsg] = useState<string | null>(null);

  const set = (key: keyof VehicleInfo, val: string) =>
    onChange({ ...value, [key]: val });

  const brand = matchBrand(value.make);

  const handleDecode = async () => {
    setVinMsg(null);
    setDecoding(true);
    const result = await decodeVin(value.vin);
    setDecoding(false);
    if (result.error) {
      setVinMsg(result.error);
      return;
    }
    onChange(applyVinToVehicle(value, result));
    setVinMsg(
      `Decoded: ${result.year} ${result.make} ${result.model}${
        result.bodyClass ? ` · ${result.bodyClass}` : ""
      }`
    );
  };

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
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-white">Customer & Vehicle</h3>
        {brand && (
          <div className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={brandLogoUrl(brand.icon, "ffffff")}
              alt={brand.name}
              width={18}
              height={18}
              className="h-4 w-4"
            />
            <span className="text-xs text-[var(--muted)]">{brand.name}</span>
          </div>
        )}
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-[var(--muted)]">
          Quick brand select
        </p>
        <BrandStrip
          variant="compact"
          selected={value.make}
          onSelect={(make) => set("make", make)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {field("Customer", "customer", "Full name")}
        {field("Phone", "phone", "(555) 000-0000")}
        {field("Email", "email", "email@example.com")}
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--muted)] mb-1">
          VIN — auto-fill vehicle
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={value.vin}
            onChange={(e) => {
              set("vin", e.target.value.toUpperCase());
              setVinMsg(null);
            }}
            placeholder="17-character VIN"
            maxLength={17}
            className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-mono uppercase text-white outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
          />
          <button
            type="button"
            onClick={handleDecode}
            disabled={decoding || value.vin.trim().length < 11}
            className="shrink-0 rounded-md bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-40"
          >
            {decoding ? "Decoding…" : "Decode VIN"}
          </button>
        </div>
        {vinMsg && (
          <p
            className={`mt-1.5 text-xs ${
              vinMsg.startsWith("Decoded")
                ? "text-emerald-400"
                : "text-amber-400"
            }`}
          >
            {vinMsg}
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {field("Year", "year", "2015")}
        {field("Make", "make", "Audi")}
        {field("Model", "model", "A4 Quattro")}
        {field("Mileage", "mileage", "135000")}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
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
