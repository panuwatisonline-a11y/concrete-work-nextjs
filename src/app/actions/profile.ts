"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type UpdateProfileState = {
  error?: string;
  success?: boolean;
};

export async function updateProfile(
  _prev: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const fname = formData.get("fname") as string;
  const lname = formData.get("lname") as string;
  const employeeId = formData.get("employee_id") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string;
  const jobRaw = formData.get("job") as string;
  const job = jobRaw ? parseInt(jobRaw, 10) : null;

  const { error } = await supabase
    .from("profiles")
    .update({
      fname: fname || null,
      lname: lname || null,
      employee_id: employeeId || null,
      phone: phone || null,
      role: role || null,
      Job: job,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่" };
  }

  redirect("/profile");
}
