export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/readonly";
import LoginForm from "@/components/auth/LoginForm";
import { AppLogo, Card } from "@/components/ui";

export default async function LoginPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-4 text-center">
          <AppLogo />
          <Card className="p-6">
            <p className="text-sm text-zinc-700">ตั้งค่า Supabase ในไฟล์ .env.local ก่อนจึงจะเข้าสู่ระบบได้</p>
          </Card>
        </div>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/profile");
  }

  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <div className="flex justify-center">
            <AppLogo />
          </div>
          <h1 className="text-lg font-semibold text-zinc-900">เข้าสู่ระบบ</h1>
          <p className="text-xs text-zinc-500">Concrete Works</p>
        </div>
        <Card className="p-6 shadow-sm shadow-zinc-900/5">
          <LoginForm />
        </Card>
        <p className="text-center text-xs text-zinc-400">
          ต้องการดูรายการคำขอโดยไม่ล็อกอิน?{" "}
          <Link href="/dashboard" className="text-orange-600 font-medium hover:underline">
            ไปหน้าแดชบอร์ด
          </Link>
        </p>
      </div>
    </main>
  );
}
