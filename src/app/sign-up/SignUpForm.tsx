"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Job = { id: number; job_name: string | null };

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("Jobs")
      .select("id, job_name")
      .order("id")
      .then(({ data }) => {
        if (data) setJobs(data);
      });
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError("");

    const form = e.currentTarget;
    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement)
        ?.value ?? "";

    const email = get("email");
    const password = get("password");
    const confirmPassword = get("confirmPassword");
    const fname = get("fname");
    const lname = get("lname");
    const employeeId = get("employee_id");
    const phone = get("phone");
    const role = get("role");
    const jobRaw = get("job");
    const job = jobRaw ? parseInt(jobRaw, 10) : null;

    if (!email || !password || !fname || !lname) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      setIsPending(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน กรุณากรอกใหม่");
      setIsPending(false);
      return;
    }

    if (password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      setIsPending(false);
      return;
    }

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      if (signUpError.message.includes("already registered")) {
        setError("อีเมลนี้ถูกใช้งานแล้ว");
      } else {
        setError("ไม่สามารถสมัครได้ กรุณาลองใหม่อีกครั้ง");
      }
      setIsPending(false);
      return;
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

    router.push("/profile");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="fname"
            className="block text-sm font-medium text-slate-300 mb-1.5"
          >
            ชื่อ <span className="text-red-400">*</span>
          </label>
          <input
            id="fname"
            name="fname"
            type="text"
            required
            placeholder="สมชาย"
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500 transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="lname"
            className="block text-sm font-medium text-slate-300 mb-1.5"
          >
            นามสกุล <span className="text-red-400">*</span>
          </label>
          <input
            id="lname"
            name="lname"
            type="text"
            required
            placeholder="ใจดี"
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="employee_id"
          className="block text-sm font-medium text-slate-300 mb-1.5"
        >
          รหัสพนักงาน
        </label>
        <input
          id="employee_id"
          name="employee_id"
          type="text"
          placeholder="EMP-0001"
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500 transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-slate-300 mb-1.5"
        >
          เบอร์โทรศัพท์
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="08x-xxx-xxxx"
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500 transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-slate-300 mb-1.5"
        >
          ตำแหน่ง
        </label>
        <input
          id="role"
          name="role"
          type="text"
          placeholder="วิศวกรสนาม"
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500 transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="job"
          className="block text-sm font-medium text-slate-300 mb-1.5"
        >
          โครงการ
        </label>
        <select
          id="job"
          name="job"
          defaultValue=""
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500 transition-colors"
        >
          <option value="" disabled className="text-slate-500">
            -- เลือกโครงการ --
          </option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id} className="bg-slate-800">
              {j.job_name}
            </option>
          ))}
        </select>
      </div>

      <div className="border-t border-slate-800 pt-5">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-300 mb-1.5"
        >
          อีเมล <span className="text-red-400">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="your@email.com"
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500 transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-300 mb-1.5"
        >
          รหัสผ่าน <span className="text-red-400">*</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="อย่างน้อย 6 ตัวอักษร"
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500 transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-slate-300 mb-1.5"
        >
          ยืนยันรหัสผ่าน <span className="text-red-400">*</span>
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500 transition-colors"
        />
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-lg shadow-orange-500/20"
      >
        {isPending ? "กำลังสมัคร..." : "สมัครใช้งาน"}
      </button>

      <p className="text-center text-sm text-slate-400">
        มีบัญชีอยู่แล้ว?{" "}
        <Link
          href="/sign-in"
          className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
        >
          ลงชื่อเข้าใช้
        </Link>
      </p>
    </form>
  );
}
