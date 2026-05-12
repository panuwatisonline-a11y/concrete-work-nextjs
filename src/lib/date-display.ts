/** โซนเวลาแสดงผล — ปี ค.ศ. (Gregorian) */
const DISPLAY_TZ = "Asia/Bangkok";

function pad2(n: string) {
  return n.length >= 2 ? n : n.padStart(2, "0");
}

/**
 * ค่าวันที่แบบ `YYYY-MM-DD` จากฐานข้อมูล → `dd/mm/yyyy` (ปี ค.ศ. ตามสตริง)
 */
export function formatWireDateAsDMY(d: string | null | undefined): string {
  if (d == null || d === "") return "—";
  const [y, m, day] = d.slice(0, 10).split("-");
  if (!y || m == null || day == null) return "—";
  return `${pad2(day)}/${pad2(m)}/${y}`;
}

function formatPartsBangkok(
  input: string | Date,
  withTime: "none" | "hm" | "hms"
): { day: string; month: string; year: string; hour?: string; minute?: string; second?: string } {
  const d = typeof input === "string" ? new Date(input) : input;
  const base: Intl.DateTimeFormatOptions = {
    timeZone: DISPLAY_TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  if (withTime === "hm") {
    Object.assign(base, { hour: "2-digit", minute: "2-digit", hour12: false });
  } else if (withTime === "hms") {
    Object.assign(base, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  }
  const parts = new Intl.DateTimeFormat("en-GB", base).formatToParts(d);
  const g = (t: Intl.DateTimeFormatPartTypes) => parts.find((x) => x.type === t)?.value ?? "";
  const out: {
    day: string;
    month: string;
    year: string;
    hour?: string;
    minute?: string;
    second?: string;
  } = {
    day: g("day"),
    month: g("month"),
    year: g("year"),
  };
  if (withTime !== "none") {
    out.hour = g("hour");
    out.minute = g("minute");
    if (withTime === "hms") out.second = g("second");
  }
  return out;
}

/** ISO / `Date` → `dd/mm/yyyy` ปี ค.ศ. ตามปฏิทินในโซน Bangkok */
export function formatIsoDateBangkok(input: string | Date | null | undefined): string {
  if (input == null || input === "") return "—";
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "—";
  const { day, month, year } = formatPartsBangkok(d, "none");
  return `${day}/${month}/${year}`;
}

/** ISO / `Date` → `dd/mm/yyyy HH:mm:ss` ปี ค.ศ. โซน Bangkok */
export function formatIsoDateTimeBangkok(input: string | Date | null | undefined): string {
  if (input == null || input === "") return "—";
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "—";
  const { day, month, year, hour, minute, second } = formatPartsBangkok(d, "hms");
  return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
}

/** ISO / `Date` → วันที่ `dd/mm/yyyy` และเวลา `HH:mm` โซน Bangkok */
export function formatIsoBangkokDateAndTime(input: string | Date | null | undefined): { date: string; time: string } | null {
  if (input == null || input === "") return null;
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return null;
  const { day, month, year, hour, minute } = formatPartsBangkok(d, "hm");
  return { date: `${day}/${month}/${year}`, time: `${hour}:${minute}` };
}
