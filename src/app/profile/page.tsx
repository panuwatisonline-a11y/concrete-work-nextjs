export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/readonly";
import TabNav from "@/components/TabNav";
import BottomNav from "@/components/BottomNav";
import LogoutButton from "@/components/auth/LogoutButton";
import { AppLogo, BtnGhost, Card, CardHeader } from "@/components/ui";
import ProfileEditForm from "./ProfileEditForm";
import { formatIsoDateTimeBangkok } from "@/lib/date-display";

export default async function ProfilePage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-sm font-medium text-zinc-800">ต้องตั้งค่า Supabase ก่อน</p>
        <Link href="/" className="mt-4 text-sm text-orange-600 font-medium hover:underline">
          กลับหน้าเข้าสู่ระบบ
        </Link>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/");
  }

  const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

  const { data: jobsData } = await supabase.from("Jobs").select("id, job_name").order("job_name");
  const jobs = jobsData ?? [];

  const { data: clientsData } = await supabase.from("Client").select("id, client_name").order("client_name");
  const clients = (clientsData ?? []).map((c) => ({
    id: c.id,
    client_name: (c.client_name ?? "").trim() || `ลูกค้า #${c.id}`,
  }));

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <AppLogo />
          <LogoutButton />
        </div>
      </header>

      <TabNav active="profile" />

      <div className="max-w-screen-2xl mx-auto px-4 py-5 space-y-5 pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] md:pb-5">
        <Card className="overflow-hidden">
          <CardHeader title="โปรไฟล์" />
          <div className="px-4 py-2">
            {profileError ? (
              <div className="py-6 space-y-2 text-center">
                <p className="text-sm text-red-600">โหลดโปรไฟล์ไม่สำเร็จ: {profileError.message}</p>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-md mx-auto">
                  ตรวจสอบ RLS ของตาราง <code className="font-mono text-[11px] bg-zinc-100 px-1 rounded">profiles</code> ใน Supabase ให้ผู้ใช้ที่ล็อกอินแล้วอ่านแถวของตัวเองได้
                  หรือรัน migration ในโฟลเดอร์ <code className="font-mono text-[11px] bg-zinc-100 px-1 rounded">supabase/migrations</code>
                </p>
                <BtnGhost href="/dashboard" className="mt-2">
                  ไปหน้าแดชบอร์ด
                </BtnGhost>
              </div>
            ) : !profile ? (
              <div className="py-6 space-y-2 text-center">
                <p className="text-sm text-zinc-600">ยังไม่มีแถวใน <code className="text-xs bg-zinc-100 px-1 rounded">profiles</code> สำหรับบัญชีนี้</p>
                <p className="text-xs text-zinc-400">อีเมล: {user.email ?? "—"}</p>
                <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                  รัน SQL ใน <code className="font-mono text-[11px] bg-zinc-100 px-1 rounded">supabase/migrations/20250512000000_profiles_auth.sql</code> เพื่อสร้างแถวอัตโนมัติเมื่อสมัครสมาชิก
                </p>
                <BtnGhost href="/dashboard" className="mt-2">
                  ไปหน้าแดชบอร์ด
                </BtnGhost>
              </div>
            ) : (
              <ProfileEditForm
                key={[
                  profile.fname,
                  profile.lname,
                  profile.phone,
                  profile.Job ?? "",
                  profile.client_id ?? "",
                  profile.client_name ?? "",
                  profile.updated_at,
                ].join("\u0001")}
                email={user.email ?? null}
                employeeId={profile.employee_id}
                role={profile.role}
                jobs={jobs}
                clients={clients}
                initialJobId={profile.Job}
                initialClientId={profile.client_id}
                cachedClientName={profile.client_name}
                createdAt={profile.created_at ? formatIsoDateTimeBangkok(profile.created_at) : null}
                updatedAt={profile.updated_at ? formatIsoDateTimeBangkok(profile.updated_at) : null}
                initial={{
                  fname: profile.fname,
                  lname: profile.lname,
                  phone: profile.phone,
                }}
              />
            )}
          </div>
        </Card>
      </div>

      <BottomNav />
    </main>
  );
}
