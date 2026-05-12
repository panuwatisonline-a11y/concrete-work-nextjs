import Link from "next/link";
import { notFound } from "next/navigation";
import { getRequestsByStatus, getStatusList } from "@/lib/supabase/queries";
import { RequestList, STATUS_STYLES, FALLBACK_STYLE } from "@/components/RequestList";
import { AppLogo } from "@/components/ui";
import { isSupabaseConfigured } from "@/lib/supabase/readonly";

export default async function RequestsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  if (!isSupabaseConfigured()) {
    return (
      <main className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-sm font-medium text-zinc-800">ต้องตั้งค่า Supabase ก่อนดูรายการตามสถานะ</p>
        <p className="mt-2 text-xs text-zinc-500 max-w-md leading-relaxed">
          ดูแถบสีเหลืองด้านบนของหน้า หรือสร้างไฟล์ <code className="font-mono text-[11px] bg-zinc-100 px-1 rounded">.env.local</code> ตาม{" "}
          <code className="font-mono text-[11px] bg-zinc-100 px-1 rounded">.env.example</code>
        </p>
        <Link href="/dashboard" className="mt-6 text-sm text-orange-600 font-medium hover:underline">
          กลับหน้าแรก
        </Link>
      </main>
    );
  }

  const params = await searchParams;
  const statusId = params.status ? Number(params.status) : null;
  if (!statusId || isNaN(statusId)) notFound();

  const [statuses, { data: requests, count }] = await Promise.all([
    getStatusList(),
    getRequestsByStatus(statusId),
  ]);

  const currentStatus = statuses.find((s) => s.id === statusId);
  if (!currentStatus) notFound();
  const style = STATUS_STYLES[statusId] ?? FALLBACK_STYLE;

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-20">
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/dashboard" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-50 transition-colors shrink-0">
            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <AppLogo />
          <span className="text-zinc-300">/</span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${style.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
            {currentStatus.status_name}
          </span>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest">รายการคำขอ</p>
          <span className="text-xs text-zinc-400">{count.toLocaleString()} รายการ</span>
        </div>
        <RequestList requests={requests} variant="detailed" />
      </div>
    </main>
  );
}
