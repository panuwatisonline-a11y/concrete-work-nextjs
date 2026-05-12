"use server";

import { createClient } from "@/lib/supabase/server";
import {
  canEditOrCancelPendingRequest,
  canInspectPendingRequest,
} from "@/lib/auth/request-permissions";

export type RequestTransitionResult = { ok?: true; error?: string };

/** สถานะตามลำดับ workflow หลัก */
const S_PENDING = 1;
const S_INSPECTED = 2;
const S_APPROVED = 3;
const S_CONFIRMED = 4;
const S_POSTPONED = 5;
const S_REJECTED = 6;
const S_CANCELLED = 7;
const S_COMPLETED = 8;

const OPEN_CANCELABLE = new Set([S_PENDING, S_INSPECTED, S_APPROVED, S_CONFIRMED, S_POSTPONED]);
const OPEN_REJECTABLE = new Set([S_PENDING, S_INSPECTED, S_APPROVED, S_CONFIRMED, S_POSTPONED]);

async function loadViewer(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null as null, role: null as string | null };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return { user, role: profile?.role ?? null };
}

function canCancelAtStatus(
  statusId: number,
  role: string | null,
  userId: string,
  bookedBy: string | null,
): boolean {
  if (!OPEN_CANCELABLE.has(statusId)) return false;
  if (canInspectPendingRequest(role)) return true;
  return bookedBy != null && bookedBy === userId;
}

export async function cancelPendingRequest(requestId: string): Promise<RequestTransitionResult> {
  return cancelOpenRequest(requestId);
}

/** ยกเลิก → สถานะ 7 (จากสถานะที่ยังดำเนินการได้ 1–5) */
export async function cancelOpenRequest(requestId: string): Promise<RequestTransitionResult> {
  if (!requestId?.trim()) return { error: "ไม่พบรหัสคำขอ" };
  const supabase = await createClient();
  const { user, role } = await loadViewer(supabase);
  if (!user) return { error: "กรุณาเข้าสู่ระบบ" };

  const { data: row, error: fetchErr } = await supabase
    .from("Request")
    .select("id, status_id, booked_by")
    .eq("id", requestId)
    .maybeSingle();

  if (fetchErr) return { error: fetchErr.message };
  if (!row || row.status_id == null || !OPEN_CANCELABLE.has(row.status_id)) {
    return { error: "ยกเลิกไม่ได้ — สถานะนี้ยกเลิกไม่ได้" };
  }

  if (row.status_id === S_PENDING) {
    if (!canEditOrCancelPendingRequest({ viewerUserId: user.id, viewerRole: role, bookedByUserId: row.booked_by })) {
      return { error: "ไม่มีสิทธิ์ยกเลิกคำขอนี้" };
    }
  } else if (!canCancelAtStatus(row.status_id, role, user.id, row.booked_by)) {
    return { error: "ไม่มีสิทธิ์ยกเลิกคำขอนี้" };
  }

  const now = new Date().toISOString();
  const prevStatus = row.status_id;
  const { data: updated, error: upErr } = await supabase
    .from("Request")
    .update({
      status_id: S_CANCELLED,
      cancelled_at: now,
      cancelled_by: user.id,
    })
    .eq("id", requestId)
    .eq("status_id", prevStatus)
    .select("id")
    .maybeSingle();

  if (upErr) return { error: upErr.message };
  if (!updated) return { error: "อัปเดตไม่สำเร็จ — มีผู้อื่นเปลี่ยนสถานะไปแล้ว" };

  await supabase.from("Request_Log").insert({
    request_id: requestId,
    action: "cancelled",
    action_by: user.id,
    status_id: S_CANCELLED,
    note: `ยกเลิกคำขอ (จากสถานะ #${prevStatus})`,
  });

  return { ok: true };
}

export async function acceptPendingRequest(requestId: string): Promise<RequestTransitionResult> {
  if (!requestId?.trim()) return { error: "ไม่พบรหัสคำขอ" };
  const supabase = await createClient();
  const { user, role } = await loadViewer(supabase);
  if (!user) return { error: "กรุณาเข้าสู่ระบบ" };
  if (!canInspectPendingRequest(role)) return { error: "ไม่มีสิทธิ์รับรองคำขอ" };

  const { data: row, error: fetchErr } = await supabase
    .from("Request")
    .select("id, status_id")
    .eq("id", requestId)
    .maybeSingle();

  if (fetchErr) return { error: fetchErr.message };
  if (!row || row.status_id !== S_PENDING) {
    return { error: "รับรองไม่ได้ — สถานะคำขอไม่ใช่รอตรวจสอบ" };
  }

  const now = new Date().toISOString();
  const { data: updated, error: upErr } = await supabase
    .from("Request")
    .update({
      status_id: S_INSPECTED,
      inspected_at: now,
      inspected_by: user.id,
    })
    .eq("id", requestId)
    .eq("status_id", S_PENDING)
    .select("id")
    .maybeSingle();

  if (upErr) return { error: upErr.message };
  if (!updated) return { error: "อัปเดตไม่สำเร็จ — มีผู้อื่นเปลี่ยนสถานะไปแล้ว" };

  await supabase.from("Request_Log").insert({
    request_id: requestId,
    action: "inspected",
    action_by: user.id,
    status_id: S_INSPECTED,
    note: "ตรวจสอบผ่าน (รับรอง)",
  });

  return { ok: true };
}

export async function rejectPendingRequest(
  requestId: string,
  reasonReject?: string | null,
): Promise<RequestTransitionResult> {
  return rejectOpenRequest(requestId, reasonReject);
}

/** ปฏิเสธ → 6 จากสถานะ 1–5 (เฉพาะ admin) */
export async function rejectOpenRequest(
  requestId: string,
  reasonReject?: string | null,
): Promise<RequestTransitionResult> {
  if (!requestId?.trim()) return { error: "ไม่พบรหัสคำขอ" };
  const supabase = await createClient();
  const { user, role } = await loadViewer(supabase);
  if (!user) return { error: "กรุณาเข้าสู่ระบบ" };
  if (!canInspectPendingRequest(role)) return { error: "ไม่มีสิทธิ์ปฏิเสธคำขอ" };

  const { data: row, error: fetchErr } = await supabase
    .from("Request")
    .select("id, status_id")
    .eq("id", requestId)
    .maybeSingle();

  if (fetchErr) return { error: fetchErr.message };
  if (!row || row.status_id == null || !OPEN_REJECTABLE.has(row.status_id)) {
    return { error: "ปฏิเสธไม่ได้ — สถานะนี้ปฏิเสธไม่ได้" };
  }

  const now = new Date().toISOString();
  const reason = reasonReject?.trim() || null;
  const prev = row.status_id;
  const { data: updated, error: upErr } = await supabase
    .from("Request")
    .update({
      status_id: S_REJECTED,
      rejected_at: now,
      rejected_by: user.id,
      reason_reject: reason,
    })
    .eq("id", requestId)
    .eq("status_id", prev)
    .select("id")
    .maybeSingle();

  if (upErr) return { error: upErr.message };
  if (!updated) return { error: "อัปเดตไม่สำเร็จ — มีผู้อื่นเปลี่ยนสถานะไปแล้ว" };

  await supabase.from("Request_Log").insert({
    request_id: requestId,
    action: "rejected",
    action_by: user.id,
    status_id: S_REJECTED,
    note: reason ? `ปฏิเสธ (จาก #${prev}): ${reason}` : `ปฏิเสธคำขอ (จาก #${prev})`,
  });

  return { ok: true };
}

/** 2 → 3 อนุมัติ */
export async function approveInspectedRequest(requestId: string): Promise<RequestTransitionResult> {
  if (!requestId?.trim()) return { error: "ไม่พบรหัสคำขอ" };
  const supabase = await createClient();
  const { user, role } = await loadViewer(supabase);
  if (!user) return { error: "กรุณาเข้าสู่ระบบ" };
  if (!canInspectPendingRequest(role)) return { error: "ไม่มีสิทธิ์อนุมัติ" };

  const now = new Date().toISOString();
  const { data: updated, error: upErr } = await supabase
    .from("Request")
    .update({
      status_id: S_APPROVED,
      approved_at: now,
      approved_by: user.id,
    })
    .eq("id", requestId)
    .eq("status_id", S_INSPECTED)
    .select("id")
    .maybeSingle();

  if (upErr) return { error: upErr.message };
  if (!updated) return { error: "อนุมัติไม่สำเร็จ — สถานะไม่ใช่ตรวจผ่านแล้ว หรือมีผู้อื่นอัปเดตก่อน" };

  await supabase.from("Request_Log").insert({
    request_id: requestId,
    action: "approved",
    action_by: user.id,
    status_id: S_APPROVED,
    note: "อนุมัติคำขอ",
  });

  return { ok: true };
}

/** 3 → 4 ยืนยันรายการ */
export async function confirmApprovedRequest(requestId: string): Promise<RequestTransitionResult> {
  if (!requestId?.trim()) return { error: "ไม่พบรหัสคำขอ" };
  const supabase = await createClient();
  const { user, role } = await loadViewer(supabase);
  if (!user) return { error: "กรุณาเข้าสู่ระบบ" };
  if (!canInspectPendingRequest(role)) return { error: "ไม่มีสิทธิ์ยืนยันรายการ" };

  const now = new Date().toISOString();
  const { data: updated, error: upErr } = await supabase
    .from("Request")
    .update({
      status_id: S_CONFIRMED,
      confirmed_at: now,
      confirmed_by: user.id,
    })
    .eq("id", requestId)
    .eq("status_id", S_APPROVED)
    .select("id")
    .maybeSingle();

  if (upErr) return { error: upErr.message };
  if (!updated) return { error: "ยืนยันไม่สำเร็จ — สถานะไม่ใช่อนุมัติแล้ว หรือมีผู้อื่นอัปเดตก่อน" };

  await supabase.from("Request_Log").insert({
    request_id: requestId,
    action: "confirmed",
    action_by: user.id,
    status_id: S_CONFIRMED,
    note: "ยืนยันรายการ",
  });

  return { ok: true };
}

/** 4 → 8 ปิดงาน / เสร็จสิ้น */
export async function completeConfirmedRequest(requestId: string): Promise<RequestTransitionResult> {
  if (!requestId?.trim()) return { error: "ไม่พบรหัสคำขอ" };
  const supabase = await createClient();
  const { user, role } = await loadViewer(supabase);
  if (!user) return { error: "กรุณาเข้าสู่ระบบ" };
  if (!canInspectPendingRequest(role)) return { error: "ไม่มีสิทธิ์ปิดงาน" };

  const { data: updated, error: upErr } = await supabase
    .from("Request")
    .update({ status_id: S_COMPLETED })
    .eq("id", requestId)
    .eq("status_id", S_CONFIRMED)
    .select("id")
    .maybeSingle();

  if (upErr) return { error: upErr.message };
  if (!updated) return { error: "บันทึกไม่สำเร็จ — สถานะไม่ใช่ยืนยันแล้ว หรือมีผู้อื่นอัปเดตก่อน" };

  await supabase.from("Request_Log").insert({
    request_id: requestId,
    action: "completed",
    action_by: user.id,
    status_id: S_COMPLETED,
    note: "ปิดงาน / เสร็จสิ้น",
  });

  return { ok: true };
}

/** 4 → 5 เลื่อนวันเท */
export async function postponeConfirmedRequest(
  requestId: string,
  postponeDate: string,
  postponeTime: string | null,
  reasonPostpone: string | null,
): Promise<RequestTransitionResult> {
  if (!requestId?.trim()) return { error: "ไม่พบรหัสคำขอ" };
  const d = postponeDate?.trim();
  if (!d || !/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    return { error: "รูปแบบวันที่เลื่อนไม่ถูกต้อง (ต้องเป็น YYYY-MM-DD)" };
  }

  const supabase = await createClient();
  const { user, role } = await loadViewer(supabase);
  if (!user) return { error: "กรุณาเข้าสู่ระบบ" };
  if (!canInspectPendingRequest(role)) return { error: "ไม่มีสิทธิ์เลื่อนวันเท" };

  const now = new Date().toISOString();
  const timeVal = postponeTime?.trim() ? postponeTime.trim().slice(0, 8) : null;
  const reason = reasonPostpone?.trim() || null;

  const { data: updated, error: upErr } = await supabase
    .from("Request")
    .update({
      status_id: S_POSTPONED,
      postpone_date: d,
      postpone_time: timeVal,
      postponed_at: now,
      postponed_by: user.id,
      reason_postpone: reason,
    })
    .eq("id", requestId)
    .eq("status_id", S_CONFIRMED)
    .select("id")
    .maybeSingle();

  if (upErr) return { error: upErr.message };
  if (!updated) return { error: "เลื่อนไม่สำเร็จ — สถานะไม่ใช่ยืนยันแล้ว หรือมีผู้อื่นอัปเดตก่อน" };

  await supabase.from("Request_Log").insert({
    request_id: requestId,
    action: "postponed",
    action_by: user.id,
    status_id: S_POSTPONED,
    note: `เลื่อนวันเทเป็น ${d}${timeVal ? ` ${timeVal}` : ""}${reason ? ` — ${reason}` : ""}`,
    postpone_date: d,
    postpone_time: timeVal,
  });

  return { ok: true };
}

/** 5 → 4 กลับมาดำเนินการหลังเลื่อน */
export async function resumePostponedRequest(requestId: string): Promise<RequestTransitionResult> {
  if (!requestId?.trim()) return { error: "ไม่พบรหัสคำขอ" };
  const supabase = await createClient();
  const { user, role } = await loadViewer(supabase);
  if (!user) return { error: "กรุณาเข้าสู่ระบบ" };
  if (!canInspectPendingRequest(role)) return { error: "ไม่มีสิทธิ์ดำเนินการ" };

  const { data: updated, error: upErr } = await supabase
    .from("Request")
    .update({ status_id: S_CONFIRMED })
    .eq("id", requestId)
    .eq("status_id", S_POSTPONED)
    .select("id")
    .maybeSingle();

  if (upErr) return { error: upErr.message };
  if (!updated) return { error: "อัปเดตไม่สำเร็จ — สถานะไม่ใช่เลื่อนวันเท หรือมีผู้อื่นอัปเดตก่อน" };

  await supabase.from("Request_Log").insert({
    request_id: requestId,
    action: "resumed",
    action_by: user.id,
    status_id: S_CONFIRMED,
    note: "กลับสู่สถานะยืนยันรายการแล้ว",
  });

  return { ok: true };
}
