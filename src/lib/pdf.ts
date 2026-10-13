import type { JobRecord, InspectionRecord, ServiceRecord } from "@/lib/storage";

function loadJsPDF(): Promise<typeof import("jspdf").jsPDF> {
  return import("jspdf").then((m) => m.jsPDF);
}

function vehicleLines(r: JobRecord): string[] {
  const v = r.vehicle;
  return [
    `Customer: ${v.customer || "—"}  |  Phone: ${v.phone || "—"}  |  Email: ${v.email || "—"}`,
    `Vehicle: ${v.year} ${v.make} ${v.model}  |  Mileage: ${v.mileage || "—"}`,
    `VIN: ${v.vin || "—"}  |  Plate: ${v.license || "—"}`,
    `Engine: ${v.engine || "—"}  |  Trans: ${v.transmission || "—"}  |  Drive: ${v.drivetrain || "—"}`,
  ];
}

function drawHeader(doc: InstanceType<typeof import("jspdf").jsPDF>, title: string) {
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("EuroSpec Systems", 14, 12);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(title, 14, 20);
  doc.setTextColor(30, 30, 30);
}

function drawFooter(doc: InstanceType<typeof import("jspdf").jsPDF>, page: number, total: number) {
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `EuroSpec Systems  ·  Page ${page} of ${total}  ·  ${new Date().toLocaleString()}`,
    14,
    290
  );
}

export async function downloadRecordPdf(record: JobRecord) {
  const jsPDF = await loadJsPDF();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 14;
  let y = 36;
  const lineH = 5.5;
  const pageH = 280;

  const ensureSpace = (need: number) => {
    if (y + need > pageH) {
      doc.addPage();
      y = 20;
    }
  };

  if (record.type === "inspection") {
    drawHeader(doc, "Multi-Point Inspection Report");
  } else {
    drawHeader(doc, "Service Order");
  }

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`RO / Invoice #: ${record.roNumber || "—"}`, margin, y);
  doc.text(`Technician: ${record.tech || "—"}`, 110, y);
  y += lineH;
  doc.text(`Date: ${new Date(record.createdAt).toLocaleString()}`, margin, y);
  if (record.type === "service") {
    doc.text(`Status: ${record.status.replace("_", " ")}`, 110, y);
  }
  y += lineH + 2;

  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, y, 182, 28, 2, 2, "FD");
  y += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Customer & Vehicle", margin + 3, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  for (const line of vehicleLines(record)) {
    doc.text(line, margin + 3, y);
    y += 4.5;
  }
  y += 6;

  if (record.type === "inspection") {
    const r = record as InspectionRecord;
    const checked = Object.entries(r.checks)
      .filter(([, v]) => v)
      .map(([k]) => k);

    const groups: { [section: string]: string[] } = {};
    for (const key of checked) {
      const idx = key.indexOf(":");
      const section = idx >= 0 ? key.slice(0, idx) : "Other";
      const item = idx >= 0 ? key.slice(idx + 1) : key;
      if (!groups[section]) groups[section] = [];
      groups[section].push(item);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    ensureSpace(10);
    doc.text(`Checked Items (${checked.length})`, margin, y);
    y += 7;

    for (const [section, items] of Object.entries(groups)) {
      ensureSpace(8 + items.length * 4.5);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(30, 90, 160);
      doc.text(section.toUpperCase(), margin, y);
      doc.setTextColor(30, 30, 30);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      for (const item of items) {
        ensureSpace(5);
        doc.text(`  [x]  ${item}`, margin, y);
        y += 4.5;
      }
      y += 2;
    }

    if (checked.length === 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("No items checked.", margin, y);
      y += 6;
    }

    if (r.notes) {
      ensureSpace(16);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Technician Notes", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const notes = doc.splitTextToSize(r.notes, 182);
      for (const line of notes) {
        ensureSpace(5);
        doc.text(line, margin, y);
        y += 4.5;
      }
      y += 3;
    }

    if (r.recommendations) {
      ensureSpace(16);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Recommendations", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const recs = doc.splitTextToSize(r.recommendations, 182);
      for (const line of recs) {
        ensureSpace(5);
        doc.text(line, margin, y);
        y += 4.5;
      }
    }
  } else {
    const r = record as ServiceRecord;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    ensureSpace(10);
    doc.text("Services Performed", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    if (r.services.length === 0) {
      doc.text("None selected.", margin, y);
      y += 5;
    } else {
      for (const s of r.services) {
        ensureSpace(5);
        doc.text(`  [x]  ${s}`, margin, y);
        y += 4.5;
      }
    }
    y += 3;

    if (r.laborHours) {
      ensureSpace(6);
      doc.setFont("helvetica", "bold");
      doc.text(`Labor Hours: `, margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(r.laborHours, margin + 28, y);
      y += 6;
    }
    if (r.partsNotes) {
      ensureSpace(12);
      doc.setFont("helvetica", "bold");
      doc.text("Parts", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      const parts = doc.splitTextToSize(r.partsNotes, 182);
      for (const line of parts) {
        ensureSpace(5);
        doc.text(line, margin, y);
        y += 4.5;
      }
      y += 2;
    }
    if (r.notes) {
      ensureSpace(12);
      doc.setFont("helvetica", "bold");
      doc.text("Notes", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      const notes = doc.splitTextToSize(r.notes, 182);
      for (const line of notes) {
        ensureSpace(5);
        doc.text(line, margin, y);
        y += 4.5;
      }
    }
  }

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, i, totalPages);
  }

  const v = record.vehicle;
  const nameParts = [
    record.type === "inspection" ? "Inspection" : "Service",
    v.year,
    v.make,
    v.model,
    record.roNumber,
  ].filter(Boolean);
  const filename = `EuroSpec_${nameParts.join("_").replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
}
