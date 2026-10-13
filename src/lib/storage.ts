export type VehicleInfo = {
  customer: string;
  phone: string;
  email: string;
  year: string;
  make: string;
  model: string;
  vin: string;
  mileage: string;
  license: string;
  engine: string;
  transmission: string;
  drivetrain: string;
};

export type InspectionRecord = {
  id: string;
  type: "inspection";
  createdAt: string;
  vehicle: VehicleInfo;
  tech: string;
  roNumber: string;
  checks: { [key: string]: boolean };
  notes: string;
  recommendations: string;
};

export type ServiceLineItem = {
  name: string;
  price: number;
};

export type ServiceRecord = {
  id: string;
  type: "service";
  createdAt: string;
  vehicle: VehicleInfo;
  tech: string;
  roNumber: string;
  services: string[];
  lineItems?: ServiceLineItem[];
  subtotal?: number;
  laborHours: string;
  laborRate?: number;
  laborTotal?: number;
  partsNotes: string;
  partsAmount?: number;
  notes: string;
  status: "open" | "in_progress" | "completed";
  total?: number;
};

export type JobRecord = InspectionRecord | ServiceRecord;

const KEY = "eurospec_records";

export function getRecords(): JobRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRecord(record: JobRecord) {
  const all = getRecords();
  const idx = all.findIndex((r) => r.id === record.id);
  if (idx >= 0) all[idx] = record;
  else all.unshift(record);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function deleteRecord(id: string) {
  const all = getRecords().filter((r) => r.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
