"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type SignupImmediateInput = {
  fname: string;
  lname: string;
  phone: string;
  jobId: number;
  employeeId: string;
  clientId: number;
  email: string;
  password: string;
};

export type SignupImmediateResult = { error?: string; success?: true };

function norm(s: string): string {
  return s.trim();
}

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

function mapAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("already registered") || m.includes("already exists")) {
    return "อีเมลนี้ลงทะเบียนแล้ว";
  }
  if (m.includes("invalid")) {
    return message;
  }
  return message;
}

export async function signupWithImmediateAccess(
  input: SignupImmediateInput,
): Promise<SignupImmediateResult> {
  const fname = norm(input.fname);
  const lname = norm(input.lname);
  const phoneRaw = norm(input.phone);
  const phoneDigits = digitsOnly(phoneRaw);
  const Job = input.jobId;
  const employeeId = norm(input.employeeId);
  const clientId = input.clientId;
  const email = norm(input.email);
  const password = input.password;

  if (!fname) return { error: "กรุณากรอกชื่อ" };
  if (!lname) return { error: "กรุณากรอกนามสกุล" };
  if (!phoneRaw) return { error: "กรุณากรอกเบอร์โทรศัพท์" };
  if (phoneDigits.length < 9 || phoneDigits.length > 15) {
    return { error: "เบอร์โทรศัพท์ควรมีตัวเลข 9–15 หลัก" };
  }
  if (!Number.isFinite(Job) || Job < 1) return { error: "โครงการที่เลือกไม่ถูกต้อง" };
  if (!employeeId) return { error: "กรุณากรอกรหัสพนักงาน" };
  if (!Number.isFinite(clientId) || clientId < 1) {
    return { error: "บริษัท/ผู้รับเหมาที่เลือกไม่ถูกต้อง" };
  }
  if (!email.includes("@")) return { error: "รูปแบบอีเมลไม่ถูกต้อง" };
  if (password.length < 6) return { error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" };

  let admin;
  try {
    admin = createAdminClient();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ตั้งค่าเซิร์ฟเวอร์ไม่ครบ";
    return { error: msg };
  }

  const { data: jobRow } = await admin.from("Jobs").select("id").eq("id", Job).maybeSingle();
  if (!jobRow) return { error: "โครงการที่เลือกไม่ถูกต้อง" };

  const { data: clientRow } = await admin
    .from("Client")
    .select("id, client_name")
    .eq("id", clientId)
    .maybeSingle();
  if (!clientRow) return { error: "บริษัท/ผู้รับเหมาที่เลือกไม่ถูกต้อง" };

  const clientNameStored = (clientRow.client_name ?? "").trim() || null;

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      fname,
      lname,
      phone: phoneRaw,
      job_id: String(Job),
      employee_id: employeeId,
      client_id: String(clientId),
    },
  });

  if (createErr) {
    return { error: mapAuthError(createErr.message) };
  }
  if (!created.user?.id) {
    return { error: "สร้างบัญชีไม่สำเร็จ ลองใหม่อีกครั้ง" };
  }

  const supabase = await createClient();
  const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
  if (signErr) {
    return { error: mapAuthError(signErr.message) };
  }

  const { error: upErr } = await supabase
    .from("profiles")
    .update({
      fname,
      lname,
      phone: phoneRaw,
      Job,
      employee_id: employeeId,
      client_id: clientId,
      client_name: clientNameStored,
      updated_at: new Date().toISOString(),
    })
    .eq("id", created.user.id);

  if (upErr) {
    return { error: upErr.message };
  }

  revalidatePath("/profile");
  revalidatePath("/signup");
  revalidatePath("/");
  return { success: true };
}
