/** Typical independent Euro specialty shop prices (USD, parts+labor ballpark) */
export type ServicePrice = {
  name: string;
  price: number;
  /** Optional note shown in UI */
  note?: string;
};

export const SERVICE_CATALOG: ServicePrice[] = [
  { name: "Oil & Filter Change", price: 129, note: "Synthetic" },
  { name: "Cabin Air Filter", price: 89 },
  { name: "Engine Air Filter", price: 79 },
  { name: "Brake Fluid Flush", price: 169 },
  { name: "Coolant Service", price: 189 },
  { name: "Transmission Fluid Service", price: 349, note: "DSG/Tiptronic" },
  { name: "Differential Fluid Service", price: 229 },
  { name: "Spark Plugs", price: 279, note: "Coil-on-plug" },
  { name: "Brake Pads (Front)", price: 349 },
  { name: "Brake Pads (Rear)", price: 319 },
  { name: "Brake Rotors", price: 499, note: "Axle pair" },
  { name: "Battery Replacement", price: 289, note: "AGM / coded" },
  { name: "Serpentine Belt", price: 249 },
  { name: "Timing Chain Inspection", price: 199 },
  { name: "Carbon Cleaning", price: 599, note: "Walnut blast" },
  { name: "Wheel Alignment", price: 159 },
  { name: "Tire Rotation", price: 49 },
  { name: "Tire Replacement", price: 0, note: "Quote per tire" },
  { name: "Suspension Repair", price: 0, note: "Diagnose / quote" },
  { name: "Diagnostic Scan", price: 149 },
  { name: "Electrical Diagnosis", price: 179 },
  { name: "A/C Service", price: 229 },
  { name: "Other (see notes)", price: 0, note: "Custom" },
];

export function priceFor(name: string): number {
  return SERVICE_CATALOG.find((s) => s.name === name)?.price ?? 0;
}

export function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function sumServices(names: string[]): number {
  return names.reduce((sum, n) => sum + priceFor(n), 0);
}

export type LineItem = {
  name: string;
  price: number;
};

export function toLineItems(names: string[]): LineItem[] {
  return names.map((name) => ({ name, price: priceFor(name) }));
}
