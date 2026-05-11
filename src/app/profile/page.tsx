"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  Jobs?: { job_name: string | null } | null;
};

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-3 border-b border-slate-800 last:border-0">
      <span className="text-slate-400 text-sm w-36 shrink-0">{label}</span>
      <span className="text-white font-medium">
        {value ?? (
          <span className="text-slate-600 font-normal italic">ไม่ได้ระบุ</span>
        )}
      </span>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.replace("/sign-in");
        return;
      }

      setUser(user);

      const { data } = await supabase
        .from("profiles")
        .select("*, Jobs(job_name)")
        .eq("id", user.id)
        .single();

      setProfile(data as Profile | null);
      setLoading(false);
    });
  }, [router]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/sign-in");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const fullName =
    [profile?.fname, profile?.lname].filter(Boolean).join(" ") || null;

  return (
    <main className="min-h-screen flex flex-col bg-slate-950">
      <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-bold text-white text-sm">
              CW
            </div>
            <span className="font-semibold text-white tracking-wide">
              Concrete Works
            </span>
          </Link>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition-colors"
          >
            ออกจากระบบ
          </button>
        </div>
      </nav>

      <div className="flex-1 px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-white">ข้อมูลผู้ใช้</h1>
            <p className="text-slate-400 text-sm mt-1">
              รายละเอียดบัญชีและโปรไฟล์ของคุณ
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-4 flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0">
              <span className="text-2xl font-extrabold text-orange-400">
                {profile?.fname?.[0]?.toUpperCase() ?? "?"}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {fullName ?? "ไม่ระบุชื่อ"}
              </h2>
              <p className="text-slate-400 text-sm mt-0.5">{user?.email}</p>
              {profile?.role && (
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-medium">
                  {profile.role}
                </span>
              )}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              ข้อมูลส่วนตัว
            </h3>
            <InfoRow label="ชื่อ" value={profile?.fname} />
            <InfoRow label="นามสกุล" value={profile?.lname} />
            <InfoRow label="รหัสพนักงาน" value={profile?.employee_id} />
            <InfoRow label="เบอร์โทรศัพท์" value={profile?.phone} />
            <InfoRow label="ตำแหน่ง" value={profile?.role} />
            <InfoRow label="โครงการ" value={profile?.Jobs?.job_name} />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              บัญชี
            </h3>
            <InfoRow label="อีเมล" value={user?.email} />
            <InfoRow
              label="สร้างเมื่อ"
              value={
                profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : null
              }
            />
          </div>

          <div className="flex gap-3">
            <Link
              href="/profile/edit"
              className="flex-1 py-3 text-center bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl transition-colors"
            >
              แก้ไขข้อมูล
            </Link>
            <button
              onClick={handleSignOut}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
