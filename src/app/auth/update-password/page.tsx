import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/readonly";
import UpdatePasswordForm from "@/components/auth/UpdatePasswordForm";
import { AppLogo, Card } from "@/components/ui";

export default async function UpdatePasswordPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-4 text-center">
          <AppLogo />
          <Card className="p-6">
            <p className="text-sm text-zinc-700">ตั้งค่า Supabase ในไฟล์ .env.local ก่อนใช้งาน</p>
          </Card>
          <Link href="/" className="text-sm text-orange-600 font-medium hover:underline">
            กลับหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/forgot-password?reason=session");
  }

  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <div className="flex justify-center">
            <AppLogo />
          </div>
          <h1 className="text-lg font-semibold text-zinc-900">ตั้งรหัสผ่านใหม่</h1>
          <p className="text-xs text-zinc-500">กรอกรหัสผ่านใหม่แล้วบันทึก — หลังบันทึกจะไปหน้าโปรไฟล์</p>
        </div>
        <Card className="p-6 shadow-sm shadow-zinc-900/5">
          <UpdatePasswordForm />
        </Card>
      </div>
    </main>
  );
}
