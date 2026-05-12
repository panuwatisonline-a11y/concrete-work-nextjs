import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/readonly";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { AppLogo, Card } from "@/components/ui";

export default async function ForgotPasswordPage() {
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
  if (user) {
    return (
      <main className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-4 text-center">
          <AppLogo />
          <Card className="p-6">
            <p className="text-sm text-zinc-700">คุณเข้าสู่ระบบอยู่แล้ว</p>
            <Link href="/profile" className="mt-4 inline-block text-sm text-orange-600 font-medium hover:underline">
              ไปหน้าโปรไฟล์
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <div className="flex justify-center">
            <AppLogo />
          </div>
          <h1 className="text-lg font-semibold text-zinc-900">ลืมรหัสผ่าน</h1>
          <p className="text-xs text-zinc-500">กรอกอีเมลเพื่อรับลิงก์รีเซ็ตรหัสผ่าน</p>
        </div>
        <Card className="p-6 shadow-sm shadow-zinc-900/5">
          <ForgotPasswordForm />
        </Card>
      </div>
    </main>
  );
}
