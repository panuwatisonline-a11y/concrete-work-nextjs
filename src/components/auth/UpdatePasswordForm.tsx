"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BtnPrimary, FieldError, inputCls, Label } from "@/components/ui";

type Props = {
  /** แบบย่อสำหรับฝังในหน้าโปรไฟล์ */
  compact?: boolean;
};

export default function UpdatePasswordForm({ compact }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const password = String(fd.get("password") ?? "");
    const passwordConfirm = String(fd.get("password_confirm") ?? "");

    if (password.length < 6) {
      setLoading(false);
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }
    if (password !== passwordConfirm) {
      setLoading(false);
      setError("รหัสผ่านกับยืนยันไม่ตรงกัน");
      return;
    }

    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (err) {
      setError(err.message === "Auth session missing!" ? "เซสชันหมดอายุ กรุณาขอลิงก์รีเซ็ตใหม่" : err.message);
      return;
    }

    if (compact) {
      setSuccess(true);
      form.reset();
      router.refresh();
      return;
    }

    router.refresh();
    router.push("/profile");
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "space-y-3" : "space-y-4"}>
      {success ? (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
          เปลี่ยนรหัสผ่านแล้ว
        </p>
      ) : null}
      <div>
        <Label required>รหัสผ่านใหม่</Label>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          disabled={loading}
          className={inputCls}
          placeholder="อย่างน้อย 6 ตัวอักษร"
        />
      </div>
      <div>
        <Label required>ยืนยันรหัสผ่านใหม่</Label>
        <input
          name="password_confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          disabled={loading}
          className={inputCls}
          placeholder="กรอกอีกครั้ง"
        />
      </div>
      <FieldError msg={error ?? undefined} />
      <BtnPrimary type="submit" disabled={loading} className={compact ? "" : "w-full justify-center py-2.5 text-sm"}>
        {loading ? "กำลังบันทึก…" : compact ? "บันทึกรหัสผ่าน" : "ตั้งรหัสผ่านใหม่"}
      </BtnPrimary>
      {!compact ? (
        <p className="text-sm text-center text-zinc-500">
          <Link href="/" className="text-orange-600 font-medium hover:underline">
            กลับหน้าเข้าสู่ระบบ
          </Link>
        </p>
      ) : null}
    </form>
  );
}
