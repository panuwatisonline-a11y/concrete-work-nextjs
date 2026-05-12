"use server";

import { createClient } from "@/lib/supabase/server";

export type BookingState = {
  success?: boolean;
  /** คีย์หลักของ Request (จาก Supabase อาจเป็น string) */
  bookingId?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
};

function bangkokRequestStamp(): { request_date: string; request_time: string } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    request_date: `${get("year")}-${get("month")}-${get("day")}`,
    request_time: `${get("hour")}:${get("minute")}`,
  };
}

function normName(s: string) {
  return s.trim().toLowerCase();
}

/** รับค่าจาก input ตัวเลข (รองรับการวางค่าที่มี comma คั่นหลัก) */
function parseDecimalInput(s: string | null | undefined): number | null {
  if (s == null) return null;
  const t = String(s).trim().replace(/\s/g, "").replace(/,/g, "");
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function parseIntInput(s: string | null | undefined): number | null {
  if (s == null) return null;
  const t = String(s).trim().replace(/\s/g, "").replace(/,/g, "");
  if (t === "") return null;
  const n = Number.parseInt(t, 10);
  return Number.isFinite(n) ? n : null;
}

/** สถานะเริ่มต้นของคำขอใหม่ (ตรงกับแถว id = 1 ในตาราง Status) */
const DEFAULT_NEW_REQUEST_STATUS_ID = 1;

export async function createBooking(
  _prevState: BookingState,
  formData: FormData
): Promise<BookingState> {
  const { request_date, request_time } = bangkokRequestStamp();

  const raw = {
    casting_date: formData.get("casting_date") as string | null,
    casting_time: formData.get("casting_time") as string | null,
    client_id: formData.get("client_id") as string | null,
    location_id: formData.get("location_id") as string | null,
    structure_pick: formData.get("structure_pick") as string | null,
    structure_no: formData.get("structure_no") as string | null,
    concrete_work_id: formData.get("concrete_work_id") as string | null,
    wbs_code_id: formData.get("wbs_code_id") as string | null,
    abc_code_id: formData.get("abc_code_id") as string | null,
    mixcode_id: formData.get("mixcode_id") as string | null,
    strength: formData.get("strength") as string | null,
    volume_dwg: formData.get("volume_dwg") as string | null,
    volume_request: formData.get("volume_request") as string | null,
    sample_qty: formData.get("sample_qty") as string | null,
    remarks: formData.get("remarks") as string | null,
  };

  const fieldErrors: Record<string, string> = {};
  if (!raw.client_id) fieldErrors.client_id = "กรุณาเลือกผู้รับเหมา";
  if (!raw.location_id) fieldErrors.location_id = "กรุณาเลือกสถานที่";
  if (!raw.structure_pick?.trim()) fieldErrors.structure_pick = "กรุณาเลือกโครงสร้าง";
  if (!raw.concrete_work_id) fieldErrors.concrete_work_id = "กรุณาเลือกประเภทงาน";
  if (!raw.mixcode_id) fieldErrors.mixcode_id = "กรุณาเลือก Mix Code";

  const volume_request = parseDecimalInput(raw.volume_request);
  if (volume_request == null || volume_request <= 0) {
    fieldErrors.volume_request = "กรุณาระบุปริมาณที่ขอเป็นตัวเลขมากกว่า 0";
  }

  const volume_dwg = parseDecimalInput(raw.volume_dwg);
  if (volume_dwg != null && volume_dwg < 0) fieldErrors.volume_dwg = "ปริมาณตามแบบต้องไม่ติดลบ";

  const sample_qty = parseIntInput(raw.sample_qty);
  if (sample_qty != null && sample_qty < 0) fieldErrors.sample_qty = "จำนวนตัวอย่างต้องไม่ติดลบ";

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "กรุณาเข้าสู่ระบบก่อนจองคอนกรีต เพื่อเชื่อมคำขอกับโปรไฟล์ของคุณ" };
  }

  const pick = raw.structure_pick!.trim();
  const { data: structRows } = await supabase.from("Structure").select("id, structure_name");
  let structure_id: number | null = null;
  for (const s of structRows ?? []) {
    if (normName(s.structure_name ?? "") === normName(pick)) {
      structure_id = s.id;
      break;
    }
  }

  const remarkLines: string[] = [];
  if (raw.casting_time?.trim()) remarkLines.push(`เวลาเทคอนกรีต: ${raw.casting_time.trim()}`);
  if (!structure_id) remarkLines.push(`__STRUCTURE__::${pick}`);
  if (raw.remarks?.trim()) remarkLines.push(raw.remarks.trim());
  const remarksMerged = remarkLines.length > 0 ? remarkLines.join("\n") : null;

  const bookedAt = new Date().toISOString();

  const payload = {
    request_date,
    request_time,
    status_id: DEFAULT_NEW_REQUEST_STATUS_ID,
    booked_by: user.id,
    booked_at: bookedAt,
    casting_date: raw.casting_date || null,
    client_id: raw.client_id ? Number(raw.client_id) : null,
    location_id: raw.location_id ? Number(raw.location_id) : null,
    structure_id,
    structure_no: raw.structure_no || null,
    concrete_work_id: raw.concrete_work_id ? Number(raw.concrete_work_id) : null,
    wbs_code_id: raw.wbs_code_id ? Number(raw.wbs_code_id) : null,
    abc_code_id: raw.abc_code_id ? Number(raw.abc_code_id) : null,
    mixcode_id: raw.mixcode_id ? Number(raw.mixcode_id) : null,
    strength: parseIntInput(raw.strength),
    volume_dwg: volume_dwg ?? null,
    volume_request: volume_request!,
    sample_qty: sample_qty ?? null,
    remarks: remarksMerged,
  };

  const { data: inserted, error } = await supabase
    .from("Request")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { error: `บันทึกไม่สำเร็จ: ${error.message}` };
  }

  await supabase.from("Request_Log").insert({
    request_id: inserted.id,
    action: "created",
    action_by: user.id,
    note: "สร้างคำขอใหม่",
  });

  return { success: true, bookingId: inserted.id };
}
