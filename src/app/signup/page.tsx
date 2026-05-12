import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, isServiceRoleConfigured } from "@/lib/supabase/readonly";
import SignupForm from "@/components/auth/SignupForm";
import { AppLogo, Card } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/profile");

  const { data: jobsData } = await supabase.from("Jobs").select("id, job_name").order("job_name");
  const jobs = jobsData ?? [];

  const { data: clientsData } = await supabase.from("Client").select("id, client_name").order("client_name");
  const clients = (clientsData ?? []).map((c) => ({
    id: c.id,
    client_name: (c.client_name ?? "").trim() || `ลูกค้า #${c.id}`,
  }));

  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-1">
          <div className="flex justify-center">
            <AppLogo />
          </div>
          <h1 className="text-lg font-semibold text-zinc-900">สมัครสมาชิก</h1>
        </div>
        <Card className="p-6 shadow-sm shadow-zinc-900/5">
          <SignupForm jobs={jobs} clients={clients} serviceRoleReady={isServiceRoleConfigured()} />
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
