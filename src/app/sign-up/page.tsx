import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignUpForm from "./SignUpForm";

export default async function SignUpPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/profile");
  }

  const { data: jobs } = await supabase
    .from("Jobs")
    .select("id, job_name")
    .order("id");

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
            href="/sign-in"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            มีบัญชีอยู่แล้ว? <span className="text-orange-400">ลงชื่อเข้าใช้</span>
          </Link>
        </div>
      </nav>

      {/* Background grid */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 39px,#475569 39px,#475569 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,#475569 39px,#475569 40px)",
          }}
        />

        <div className="relative w-full max-w-md">
          {/* Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-500/10 border border-orange-500/30 rounded-2xl mb-4">
                <div className="w-7 h-7 bg-orange-500 rounded flex items-center justify-center font-bold text-white text-xs">
                  CW
                </div>
              </div>
              <h1 className="text-2xl font-extrabold text-white">สมัครใช้งาน</h1>
              <p className="text-slate-400 text-sm mt-1">
                สร้างบัญชีสำหรับ Concrete Works
              </p>
            </div>

            <SignUpForm jobs={jobs ?? []} />
          </div>

          {/* Footer note */}
          <p className="text-center text-slate-500 text-xs mt-6">
            © {new Date().getFullYear()} Concrete Works Co., Ltd.
          </p>
        </div>
      </div>
    </main>
  );
}
