/** แสดงปริมาตร m³ ทศนิยม 2 ตำแหน่ง */
export function formatVolumeM3(value: number | null | undefined): string {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return Number(value).toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function parseStructurePickFromRemarks(remarks: string | null | undefined): string | null {
  if (!remarks?.trim()) return null;
  const line = remarks.split("\n").find((l) => l.startsWith("__STRUCTURE__::"));
  return line ? line.slice("__STRUCTURE__::".length).trim() || null : null;
}

export function parseCastingTimeFromRemarks(remarks: string | null | undefined): string | null {
  if (!remarks?.trim()) return null;
  const line = remarks.split("\n").find((l) => l.startsWith("เวลาเทคอนกรีต:"));
  if (!line) return null;
  return line.replace(/^\s*เวลาเทคอนกรีต:\s*/i, "").trim() || null;
}

/** ข้อความหมายเหตุที่แสดงผู้ใช้ (ตัดบรรทัดเมตadata ที่บันทึกจากฟอร์มจอง) */
export function formatRemarksForDisplay(remarks: string | null | undefined): string | null {
  if (!remarks?.trim()) return null;
  const filtered = remarks
    .split("\n")
    .filter((l) => !l.startsWith("__STRUCTURE__::") && !l.startsWith("เวลาเทคอนกรีต:"));
  const t = filtered.join("\n").trim();
  return t || null;
}
