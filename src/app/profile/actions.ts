"use server";

import { createClient } from "@/lib/supabase/server";

export type ProfileUpdateState = {
  success?: boolean;
  error?: string;
};

function norm(s: string | null): string | null {
  const t = (s ?? "").trim();
  return t === "" ? null : t;
}

export async function updateProfile(_prev: ProfileUpdateState, formData: FormData): Promise<ProfileUpdateState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "กรุณาเข้าสู่ระบบก่อน" };
  }

  const fname = norm(formData.get("fname") as string | null);
  const lname = norm(formData.get("lname") as string | null);
  const phone = norm(formData.get("phone") as string | null);

  const rawJob = formData.get("job_id") as string | null;
  let Job: number | null = null;
  if (rawJob != null && String(rawJob).trim() !== "") {
    const n = Number.parseInt(String(rawJob).trim(), 10);
    if (!Number.isFinite(n)) {
      return { error: "รหัสโครงการไม่ถูกต้อง" };
    }
    const { data: jobRow } = await supabase.from("Jobs").select("id").eq("id", n).maybeSingle();
    if (!jobRow) {
      return { error: "ไม่พบโครงการที่เลือกในระบบ" };
    }
    Job = n;
  }

  const rawClient = formData.get("client_id") as string | null;
  let client_id: number | null = null;
  let client_name: string | null = null;
  if (rawClient != null && String(rawClient).trim() !== "") {
    const n = Number.parseInt(String(rawClient).trim(), 10);
    if (!Number.isFinite(n)) {
      return { error: "บริษัท/ผู้รับเหมาไม่ถูกต้อง" };
    }
    const { data: clientRow } = await supabase.from("Client").select("id, client_name").eq("id", n).maybeSingle();
    if (!clientRow) {
      return { error: "ไม่พบรายการ Client ที่เลือกในระบบ" };
    }
    client_id = n;
    client_name = norm(clientRow.client_name);
  }

  const { error } = await supabase
    .from("profiles")
    .update({ fname, lname, phone, Job, client_id, client_name, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
