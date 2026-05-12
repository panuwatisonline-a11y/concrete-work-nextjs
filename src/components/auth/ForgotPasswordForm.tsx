"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BtnPrimary, FieldError, inputCls, Label } from "@/components/ui";

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "").trim();

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: origin ? `${origin}/auth/callback?next=/profile` : undefined,
    });
    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    setSuccess("ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลแล้ว กรุณาตรวจสอบกล่องจดหมาย");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {success ? (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 leading-relaxed">
          {success}
        </p>
      ) : null}
      <div>
        <Label required>อีเมล</Label>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={loading || Boolean(success)}
          className={inputCls}
          placeholder="you@example.com"
        />
      </div>
      <FieldError msg={error ?? undefined} />
      {!success ? (
        <BtnPrimary type="submit" disabled={loading} className="w-full justify-center py-2.5 text-sm">
          {loading ? "กำลังส่ง…" : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
        </BtnPrimary>
      ) : null}
      <p className="text-sm text-center text-zinc-500">
        <Link href="/" className="text-orange-600 font-medium hover:underline">
          กลับหน้าเข้าสู่ระบบ
        </Link>
      </p>
    </form>
  );
}
