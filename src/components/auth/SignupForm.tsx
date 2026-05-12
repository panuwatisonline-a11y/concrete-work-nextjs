"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Select } from "@/components/Select";
import { BtnPrimary, FieldError, inputCls, Label } from "@/components/ui";

type JobOption = { id: number; job_name: string | null };
type ClientOption = { id: number; client_name: string };

function norm(s: string): string {
  return s.trim();
}

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

export default function SignupForm({
  jobs,
  clients,
}: {
  jobs: JobOption[];
  clients: ClientOption[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const jobSelectOptions = useMemo(
    () =>
      jobs.map((j) => ({
        value: String(j.id),
        label: j.job_name?.trim() ? j.job_name : `โครงการ #${j.id}`,
      })),
    [jobs],
  );

  const clientSelectOptions = useMemo(
    () =>
      clients.map((c) => ({
        value: String(c.id),
        label: c.client_name.trim() ? c.client_name : `ลูกค้า #${c.id}`,
      })),
    [clients],
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const fname = norm(String(fd.get("fname") ?? ""));
    const lname = norm(String(fd.get("lname") ?? ""));
    const phoneRaw = norm(String(fd.get("phone") ?? ""));
    const phoneDigits = digitsOnly(phoneRaw);
    const jobIdRaw = norm(String(fd.get("job_id") ?? ""));
    const employeeId = norm(String(fd.get("employee_id") ?? ""));
    const clientIdRaw = norm(String(fd.get("client_id") ?? ""));
    const email = norm(String(fd.get("email") ?? ""));
    const password = String(fd.get("password") ?? "");
    const passwordConfirm = String(fd.get("password_confirm") ?? "");

    if (!fname) {
      setLoading(false);
      setError("กรุณากรอกชื่อ");
      return;
    }
    if (!lname) {
      setLoading(false);
      setError("กรุณากรอกนามสกุล");
      return;
    }
    if (!phoneRaw) {
      setLoading(false);
      setError("กรุณากรอกเบอร์โทรศัพท์");
      return;
    }
    if (phoneDigits.length < 9 || phoneDigits.length > 15) {
      setLoading(false);
      setError("เบอร์โทรศัพท์ควรมีตัวเลข 9–15 หลัก");
      return;
    }
    if (!jobIdRaw) {
      setLoading(false);
      setError("กรุณาเลือกโครงการ");
      return;
    }
    const Job = Number.parseInt(jobIdRaw, 10);
    if (!Number.isFinite(Job) || !jobs.some((j) => j.id === Job)) {
      setLoading(false);
      setError("โครงการที่เลือกไม่ถูกต้อง");
      return;
    }
    if (!employeeId) {
      setLoading(false);
      setError("กรุณากรอกรหัสพนักงาน");
      return;
    }
    if (!clientIdRaw) {
      setLoading(false);
      setError("กรุณาเลือกบริษัท/ผู้รับเหมา");
      return;
    }
    const clientId = Number.parseInt(clientIdRaw, 10);
    if (!Number.isFinite(clientId) || !clients.some((c) => c.id === clientId)) {
      setLoading(false);
      setError("บริษัท/ผู้รับเหมาที่เลือกไม่ถูกต้อง");
      return;
    }
    const clientNameStored =
      clients.find((c) => c.id === clientId)?.client_name?.trim() || null;

    if (password.length < 6) {
      setLoading(false);
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }
    if (password !== passwordConfirm) {
      setLoading(false);
      setError("รหัสผ่านกับยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const supabase = createClient();
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: origin ? `${origin}/auth/callback?next=/profile` : undefined,
        data: {
          fname,
          lname,
          phone: phoneRaw,
          job_id: String(Job),
          employee_id: employeeId,
          client_id: String(clientId),
        },
      },
    });

    if (err) {
      setLoading(false);
      setError(err.message);
      return;
    }

    if (data.user && data.session) {
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
        .eq("id", data.user.id);

      if (upErr) {
        setLoading(false);
        setError(upErr.message);
        return;
      }
    }

    setLoading(false);

    if (data.session) {
      router.refresh();
      router.push("/profile");
      return;
    }

    setSuccess(
      "สมัครสมาชิกแล้ว หากโปรเจกต์เปิดยืนยันอีเมล กรุณาคลิกลิงก์ในอีเมลก่อนเข้าสู่ระบบ — หลังเข้าสู่ระบบแล้วข้อมูลโปรไฟล์จะแสดงตามที่กรอกไว้",
    );
  }

  const noJobs = jobs.length === 0;
  const noClients = clients.length === 0;
  const blocked = noJobs || noClients;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {success ? (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 leading-relaxed">
          {success}
        </p>
      ) : null}
      {noJobs ? (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 leading-relaxed">
          ยังไม่มีรายการโครงการในระบบ ติดต่อผู้ดูแลเพื่อเพิ่มโครงการก่อนสมัครสมาชิก
        </p>
      ) : null}
      {noClients ? (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 leading-relaxed">
          ยังไม่มีรายการใน Client (บริษัท/ผู้รับเหมา) ติดต่อผู้ดูแลเพื่อเพิ่มข้อมูลในตาราง Client ก่อนสมัครสมาชิก
        </p>
      ) : null}
      <div>
        <Label required>ชื่อ</Label>
        <input
          name="fname"
          type="text"
          autoComplete="given-name"
          required
          disabled={loading || Boolean(success) || blocked}
          className={inputCls}
          placeholder="ชื่อจริง"
        />
      </div>
      <div>
        <Label required>นามสกุล</Label>
        <input
          name="lname"
          type="text"
          autoComplete="family-name"
          required
          disabled={loading || Boolean(success) || blocked}
          className={inputCls}
          placeholder="นามสกุล"
        />
      </div>
      <div>
        <Label required>เบอร์โทรศัพท์</Label>
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          required
          disabled={loading || Boolean(success) || blocked}
          className={inputCls}
          placeholder="เช่น 0812345678"
        />
      </div>
      <div>
        <Label required>โครงการ</Label>
        <Select
          name="job_id"
          options={jobSelectOptions}
          placeholder="— เลือกโครงการ —"
          required
        />
      </div>
      <div>
        <Label required>รหัสพนักงาน</Label>
        <input
          name="employee_id"
          type="text"
          autoComplete="username"
          required
          disabled={loading || Boolean(success) || blocked}
          className={inputCls}
          placeholder="รหัสพนักงาน"
        />
      </div>
      <div>
        <Label required>บริษัท/ผู้รับเหมา</Label>
        <Select
          name="client_id"
          options={clientSelectOptions}
          placeholder="— เลือกบริษัท/ผู้รับเหมา —"
          required
        />
      </div>
      <div>
        <Label required>E-mail</Label>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={loading || Boolean(success) || blocked}
          className={inputCls}
          placeholder="you@example.com"
        />
      </div>
      <div>
        <Label required>รหัสผ่าน</Label>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          disabled={loading || Boolean(success) || blocked}
          className={inputCls}
          placeholder="อย่างน้อย 6 ตัวอักษร"
        />
      </div>
      <div>
        <Label required>ยืนยันรหัสผ่าน</Label>
        <input
          name="password_confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          disabled={loading || Boolean(success) || blocked}
          className={inputCls}
          placeholder="กรอกรหัสผ่านอีกครั้ง"
        />
      </div>
      <FieldError msg={error ?? undefined} />
      {!success ? (
        <BtnPrimary
          type="submit"
          disabled={loading || blocked}
          className="w-full justify-center py-2.5 text-sm"
        >
          {loading ? "กำลังสมัคร…" : "สร้างบัญชี"}
        </BtnPrimary>
      ) : null}
      <p className="text-sm text-center text-zinc-500">
        มีบัญชีแล้ว?{" "}
        <Link href="/" className="text-orange-600 font-medium hover:underline">
          เข้าสู่ระบบ
        </Link>
      </p>
    </form>
  );
}
