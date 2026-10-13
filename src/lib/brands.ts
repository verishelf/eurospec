export type Brand = {
  id: string;
  name: string;
  /** Simple Icons slug for logo CDN */
  icon: string;
  color: string;
};

export const BRANDS: Brand[] = [
  { id: "audi", name: "Audi", icon: "audi", color: "#BB0A30" },
  { id: "bmw", name: "BMW", icon: "bmw", color: "#0066B1" },
  { id: "mercedes", name: "Mercedes-Benz", icon: "mercedes", color: "#333333" },
  { id: "volkswagen", name: "Volkswagen", icon: "volkswagen", color: "#151F6D" },
  { id: "porsche", name: "Porsche", icon: "porsche", color: "#B12B28" },
  { id: "mini", name: "MINI", icon: "mini", color: "#000000" },
  { id: "volvo", name: "Volvo", icon: "volvo", color: "#003057" },
  { id: "landrover", name: "Land Rover", icon: "landrover", color: "#005A2B" },
  { id: "jaguar", name: "Jaguar", icon: "jaguar", color: "#9E1B32" },
  { id: "bentley", name: "Bentley", icon: "bentley", color: "#333333" },
];

export function brandLogoUrl(icon: string, color = "ffffff"): string {
  return `https://cdn.simpleicons.org/${icon}/${color.replace("#", "")}`;
}

export function matchBrand(make: string): Brand | undefined {
  const m = make.trim().toLowerCase();
  if (!m) return undefined;
  return BRANDS.find(
    (b) =>
      b.name.toLowerCase() === m ||
      b.id === m ||
      m.includes(b.id) ||
      b.name.toLowerCase().includes(m)
  );
}
