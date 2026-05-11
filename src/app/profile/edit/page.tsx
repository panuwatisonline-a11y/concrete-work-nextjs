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
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/sign-in");
        return;
      }

      const uid = session.user.id;
      setUserId(uid);

      const [{ data: profileData }, { data: jobsData }] = await Promise.all([
        supabase
          .from("profiles")
          .select("fname, lname, employee_id, phone, role, Job")
          .eq("id", uid)
          .single(),
        supabase.from("Jobs").select("id, job_name").order("id"),
      ]);

      setProfile({
        fname: profileData?.fname ?? null,
        lname: profileData?.lname ?? null,
        employee_id: profileData?.employee_id ?? null,
        phone: profileData?.phone ?? null,
        role: profileData?.role ?? null,
        job: profileData?.Job ?? null,
      });
      setJobs(jobsData ?? []);
      setLoading(false);
    }

    load();
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col bg-slate-950">
      {/* Navbar */}
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

            {loading ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                กำลังโหลด...
              </div>
            ) : profile && userId ? (
              <EditProfileForm
                initialData={profile}
                jobs={jobs}
                userId={userId}
              />
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
