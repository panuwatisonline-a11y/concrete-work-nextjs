"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SignInState = {
  error?: string;
};

export type SignUpState = {
  error?: string;
  success?: boolean;
};

export async function signIn(
  _prev: SignInState,
  formData: FormData
): Promise<SignInState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "กรุณากรอกอีเมลและรหัสผ่าน" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
  }

  redirect("/dashboard");
}

export async function signUp(
  _prev: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const fname = formData.get("fname") as string;
  const lname = formData.get("lname") as string;
  const employeeId = formData.get("employee_id") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string;
  const jobRaw = formData.get("job") as string;
  const job = jobRaw ? parseInt(jobRaw, 10) : null;

  if (!email || !password || !fname || !lname) {
    return { error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
  }

  if (password !== confirmPassword) {
    return { error: "รหัสผ่านไม่ตรงกัน กรุณากรอกใหม่" };
  }

  if (password.length < 6) {
    return { error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" };
  }

  const supabase = await createClient();

  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    if (signUpError.message.includes("already registered")) {
      return { error: "อีเมลนี้ถูกใช้งานแล้ว" };
    }
    return { error: "ไม่สามารถสมัครได้ กรุณาลองใหม่อีกครั้ง" };
  }

  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      fname: fname || null,
      lname: lname || null,
      employee_id: employeeId || null,
      phone: phone || null,
      role: role || null,
      Job: job,
    });
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
