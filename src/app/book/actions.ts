"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type BookingState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function createBooking(
  _prevState: BookingState,
  formData: FormData
): Promise<BookingState> {
  const raw = {
    request_date: formData.get("request_date") as string | null,
    request_time: formData.get("request_time") as string | null,
    casting_date: formData.get("casting_date") as string | null,
    client_id: formData.get("client_id") as string | null,
    location_id: formData.get("location_id") as string | null,
    structure_id: formData.get("structure_id") as string | null,
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
  if (!raw.request_date) fieldErrors.request_date = "กรุณาระบุวันที่ขอ";
  if (!raw.location_id) fieldErrors.location_id = "กรุณาเลือกสถานที่";
  if (!raw.structure_id) fieldErrors.structure_id = "กรุณาเลือกประเภทโครงสร้าง";
  if (!raw.concrete_work_id) fieldErrors.concrete_work_id = "กรุณาเลือกประเภทงาน";
  if (!raw.mixcode_id) fieldErrors.mixcode_id = "กรุณาเลือก Mix Code";
  if (!raw.volume_request || Number(raw.volume_request) <= 0)
    fieldErrors.volume_request = "กรุณาระบุปริมาตรที่ขอ";

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const supabase = await createClient();

  const payload = {
    request_date: raw.request_date,
    request_time: raw.request_time || null,
    casting_date: raw.casting_date || null,
    client_id: raw.client_id ? Number(raw.client_id) : null,
    location_id: raw.location_id ? Number(raw.location_id) : null,
    structure_id: raw.structure_id ? Number(raw.structure_id) : null,
    structure_no: raw.structure_no || null,
    concrete_work_id: raw.concrete_work_id ? Number(raw.concrete_work_id) : null,
    wbs_code_id: raw.wbs_code_id ? Number(raw.wbs_code_id) : null,
    abc_code_id: raw.abc_code_id ? Number(raw.abc_code_id) : null,
    mixcode_id: raw.mixcode_id ? Number(raw.mixcode_id) : null,
    strength: raw.strength ? Number(raw.strength) : null,
    volume_dwg: raw.volume_dwg ? Number(raw.volume_dwg) : null,
    volume_request: raw.volume_request ? Number(raw.volume_request) : null,
    sample_qty: raw.sample_qty ? Number(raw.sample_qty) : null,
    remarks: raw.remarks || null,
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
    note: "สร้างคำขอใหม่",
  });

  revalidatePath("/");
  redirect(`/?success=${inserted.id}`);
}
