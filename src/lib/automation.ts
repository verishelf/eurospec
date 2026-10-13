import type { VehicleInfo } from "@/lib/storage";

/** Generate next RO number from timestamp + random */
export function generateRoNumber(): string {
  const d = new Date();
  const y = d.getFullYear().toString().slice(-2);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `RO-${y}${m}${day}-${seq}`;
}

export type VinDecodeResult = {
  year: string;
  make: string;
  model: string;
  engine: string;
  transmission: string;
  drivetrain: string;
  bodyClass: string;
  plant: string;
  error?: string;
};

/** Decode VIN via NHTSA vPIC (free, no key) */
export async function decodeVin(vin: string): Promise<VinDecodeResult> {
  const cleaned = vin.trim().toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");
  if (cleaned.length !== 17) {
    return {
      year: "",
      make: "",
      model: "",
      engine: "",
      transmission: "",
      drivetrain: "",
      bodyClass: "",
      plant: "",
      error: "VIN must be 17 characters",
    };
  }

  try {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${cleaned}?format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("VIN service unavailable");
    const data = await res.json();
    const r = data?.Results?.[0] || {};
    const errCode = String(r.ErrorCode || "");
    if (errCode && errCode !== "0" && !r.ModelYear && !r.Make) {
      return {
        year: "",
        make: "",
        model: "",
        engine: "",
        transmission: "",
        drivetrain: "",
        bodyClass: "",
        plant: "",
        error: r.ErrorText || "Could not decode VIN",
      };
    }

    const displace = r.DisplacementL ? `${r.DisplacementL}L` : "";
    const cyl = r.EngineCylinders ? `${r.EngineCylinders}-cyl` : "";
    const fuel = r.FuelTypePrimary || "";
    const engine = [displace, cyl, fuel].filter(Boolean).join(" ").trim();

    const drive = r.DriveType || "";

    return {
      year: r.ModelYear || "",
      make: r.Make || "",
      model: r.Model || "",
      engine: engine || r.EngineModel || "",
      transmission: r.TransmissionStyle || r.TransmissionSpeeds || "",
      drivetrain: drive,
      bodyClass: r.BodyClass || "",
      plant: [r.PlantCity, r.PlantCountry].filter(Boolean).join(", "),
    };
  } catch {
    return {
      year: "",
      make: "",
      model: "",
      engine: "",
      transmission: "",
      drivetrain: "",
      bodyClass: "",
      plant: "",
      error: "Network error decoding VIN",
    };
  }
}

export function applyVinToVehicle(
  vehicle: VehicleInfo,
  decoded: VinDecodeResult
): VehicleInfo {
  return {
    ...vehicle,
    year: decoded.year || vehicle.year,
    make: decoded.make || vehicle.make,
    model: decoded.model || vehicle.model,
    engine: decoded.engine || vehicle.engine,
    transmission: decoded.transmission || vehicle.transmission,
    drivetrain: decoded.drivetrain || vehicle.drivetrain,
  };
}

/** Mileage-based service suggestions for European vehicles */
export function suggestServices(mileageStr: string, make?: string): string[] {
  const miles = parseInt(String(mileageStr).replace(/[^0-9]/g, ""), 10);
  if (!Number.isFinite(miles) || miles <= 0) return [];

  const suggestions: string[] = [];

  if (miles >= 5000) suggestions.push("Oil & Filter Change");
  if (miles >= 15000) suggestions.push("Cabin Air Filter", "Engine Air Filter");
  if (miles >= 30000) suggestions.push("Brake Fluid Flush", "Spark Plugs");
  if (miles >= 40000) suggestions.push("Transmission Fluid Service");
  if (miles >= 50000) {
    suggestions.push("Coolant Service", "Differential Fluid Service");
  }
  if (miles >= 60000) suggestions.push("Serpentine Belt", "Carbon Cleaning");
  if (miles >= 80000) suggestions.push("Timing Chain Inspection");
  if (miles >= 100000) {
    suggestions.push("Diagnostic Scan", "Suspension Repair");
  }

  const m = (make || "").toLowerCase();
  if (m.includes("audi") || m.includes("vw") || m.includes("volkswagen")) {
    if (miles >= 40000) suggestions.push("Carbon Cleaning");
  }
  if (m.includes("bmw") || m.includes("mini")) {
    if (miles >= 50000) suggestions.push("Coolant Service");
  }
  if (m.includes("mercedes")) {
    if (miles >= 40000) suggestions.push("Transmission Fluid Service");
  }

  return [...new Set(suggestions)];
}

export function suggestInspectionFocus(mileageStr: string): string[] {
  const miles = parseInt(String(mileageStr).replace(/[^0-9]/g, ""), 10);
  if (!Number.isFinite(miles) || miles <= 0) return [];
  const focus: string[] = ["Engine Oil & Filter", "Tire pressure / TPMS", "OBD scan / codes"];
  if (miles >= 30000) focus.push("Brake Fluid", "Spark Plugs", "Front pads", "Rear pads");
  if (miles >= 50000) focus.push("Engine Coolant", "Transmission Fluid", "Shocks / struts");
  if (miles >= 80000) focus.push("Timing Belt / Chain", "Drive belts", "Carbon-related idle check");
  if (miles >= 100000) focus.push("Wheel bearings", "Suspension components", "Underbody corrosion");
  return focus;
}
