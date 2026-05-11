"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import EditProfileForm from "./EditProfileForm";

type Job = { id: number; job_name: string | null };

type ProfileData = {
  fname: string | null;
  lname: string | null;
  employee_id: string | null;
  phone: string | null;
  role: string | null;
  job: number | null;
};

export default function EditProfilePage() {
  const router = useRouter();
  const [initialData, setInitialData] = useState<ProfileData | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.replace("/sign-in");
        return;
      }

      const [{ data: profile }, { data: jobList }] = await Promise.all([
        supabase
          .from("profiles")
          .select("fname, lname, employee_id, phone, role, Job")
          .eq("id", user.id)
          .single(),
        supabase.from("Jobs").select("id, job_name").order("id"),
      ]);

      setInitialData({
        fname: profile?.fname ?? null,
        lname: profile?.lname ?? null,
        employee_id: profile?.employee_id ?? null,
        phone: profile?.phone ?? null,
        role: profile?.role ?? null,
        job: profile?.Job ?? null,
      });
      setJobs(jobList ?? []);
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-950">
      <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-bold text-white text-sm">
              CW
            </div>
            <span className="font-semibold text-white tracking-wide">
              Concrete Works
            </span>
          </Link>
          <Link
            href="/profile"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            ← กลับ
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 39px,#475569 39px,#475569 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,#475569 39px,#475569 40px)",
          }}
        />

        <div className="relative w-full max-w-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-white">แก้ไขข้อมูล</h1>
              <p className="text-slate-400 text-sm mt-1">
                อัปเดตข้อมูลโปรไฟล์ของคุณ
              </p>
            </div>

            {initialData && (
              <EditProfileForm initialData={initialData} jobs={jobs} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
