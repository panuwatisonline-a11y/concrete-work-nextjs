import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/readonly";
import SignupForm from "@/components/auth/SignupForm";
import { AppLogo, Card } from "@/components/ui";

export default async function SignupPage() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/profile");
  }

  if (!isSupabaseConfigured()) {
    return (
      <main className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-4 text-center">
          <AppLogo />
          <Card className="p-6">
            <p className="text-sm text-zinc-700">ตั้งค่า Supabase ในไฟล์ .env.local ก่อนสมัครสมาชิก</p>
          </Card>
          <Link href="/" className="text-sm text-orange-600 font-medium hover:underline">
            กลับหน้าเข้าสู่ระบบ
          </Link>
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
          <h1 className="text-lg font-semibold text-zinc-900">สมัครสมาชิก</h1>
        </div>
        <Card className="p-6 shadow-sm shadow-zinc-900/5">
          <SignupForm />
        </Card>
        <p className="text-sm text-center text-zinc-500">
          <Link href="/" className="text-orange-600 font-medium hover:underline">
            กลับหน้าเข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </main>
  );
}
