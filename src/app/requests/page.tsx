import Link from "next/link";
import { notFound } from "next/navigation";
import { getRequestsByStatus, getStatusList } from "@/lib/supabase/queries";
import { RequestList, STATUS_STYLES, FALLBACK_STYLE } from "@/components/RequestList";
import { AppLogo } from "@/components/ui";

export default async function RequestsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
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
    <main className="min-h-screen bg-zinc-100">
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-20">
        <div className="max-w-screen-2xl mx-auto px-4 h-12 flex items-center gap-3">
          <Link href="/" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors shrink-0">
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
