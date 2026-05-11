"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace("/dashboard");
    });
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col bg-slate-950">
      <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-bold text-white text-sm">
              CW
            </div>
            <span className="font-semibold text-white tracking-wide">
              Concrete Works
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-sm text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition-colors"
            >
              ลงชื่อเข้าใช้
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 text-sm bg-orange-500 hover:bg-orange-400 text-white font-medium rounded-lg transition-colors"
            >
              สมัครใช้งาน
            </Link>
          </div>
        </div>
      </nav>

      <section className="flex-1 flex items-center justify-center px-4 py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 39px,#475569 39px,#475569 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,#475569 39px,#475569 40px)",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/10 border border-orange-500/30 rounded-2xl mb-6">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-base">
              CW
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            ระบบจัดการงาน
            <br />
            <span className="text-orange-500">Concrete Works</span>
          </h1>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            ระบบบริหารจัดการงานก่อสร้างคอนกรีต สำหรับทีมงานภาคสนาม
            <br className="hidden sm:block" />
            ติดตามคำขอ ตรวจสอบสถานะ และบริหารทีมในที่เดียว
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/20 text-base"
            >
              สมัครใช้งาน
            </Link>
            <Link
              href="/sign-in"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-all text-base"
            >
              ลงชื่อเข้าใช้
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800 py-16 px-4 bg-slate-900/50">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          {[
            {
              icon: "📋",
              title: "จัดการคำขอ",
              desc: "ยื่น ติดตาม และอนุมัติคำขอเทคอนกรีตได้ทุกที่ทุกเวลา",
            },
            {
              icon: "👥",
              title: "บริหารทีมงาน",
              desc: "กำหนดบทบาทและสิทธิ์การเข้าถึงให้กับสมาชิกในทีม",
            },
            {
              icon: "📊",
              title: "รายงานสถานะ",
              desc: "ดูภาพรวมงานก่อสร้างแบบ Real-time ครบในหน้าเดียว",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} Concrete Works Co., Ltd. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
