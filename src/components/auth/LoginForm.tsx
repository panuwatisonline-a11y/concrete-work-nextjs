"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BtnPrimary, FieldError, inputCls, Label } from "@/components/ui";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");

    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (err) {
      setError(err.message === "Invalid login credentials" ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง" : err.message);
      return;
    }

    router.refresh();
    router.push("/dashboard");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label required>อีเมล</Label>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={loading}
          className={inputCls}
          placeholder="you@example.com"
        />
      </div>
      <div>
        <Label required>รหัสผ่าน</Label>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={6}
          disabled={loading}
          className={inputCls}
          placeholder="••••••••"
        />
      </div>
      <FieldError msg={error ?? undefined} />
      <BtnPrimary type="submit" disabled={loading} className="w-full justify-center py-2.5 text-sm">
        {loading ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
      </BtnPrimary>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm pt-1">
        <Link href="/signup" className="text-orange-600 font-medium hover:underline">
          สมัครสมาชิก
        </Link>
        <Link href="/forgot-password" className="text-zinc-500 hover:text-zinc-700 hover:underline">
          ลืมรหัสผ่าน
        </Link>
      </div>
    </form>
  );
}
