export const dynamic = "force-dynamic";

import Link from "next/link";
import { getRequests, getStatusSummary } from "@/lib/supabase/queries";
import { RequestList, STATUS_STYLES, FALLBACK_STYLE } from "@/components/RequestList";
import TabNav from "@/components/TabNav";
import { AppLogo, BtnPrimary, PlusIcon } from "@/components/ui";

function StatusItem({
  statusId, label, value, total,
}: { statusId: number; label: string; value: number; total: number }) {
  const s = STATUS_STYLES[statusId] ?? FALLBACK_STYLE;
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <Link
      href={`/requests?status=${statusId}`}
      className="flex items-center gap-3 px-4 py-3.5 bg-white hover:bg-zinc-50 rounded-xl border border-zinc-200 transition-all hover:shadow-sm active:scale-[0.99] group"
    >
      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.dot}`} />
      <span className="text-sm text-zinc-700 flex-1 min-w-0 truncate leading-tight">{label}</span>
      <div className="hidden sm:block w-20 shrink-0">
        <div className="w-full bg-zinc-100 rounded-full h-1 overflow-hidden">
          <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <span className={`text-sm font-bold tabular-nums shrink-0 min-w-[2rem] text-center px-2 py-0.5 rounded-full ${value > 0 ? "bg-zinc-100 text-zinc-700" : "bg-zinc-50 text-zinc-300"}`}>
        {value}
      </span>
      <svg className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

export default async function Home({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const [{ data: requests, count }, statusSummary, params] = await Promise.all([
    getRequests(100, 0),
    getStatusSummary(),
    searchParams,
  ]);

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <AppLogo />
          <BtnPrimary href="/book"><PlusIcon />จองคอนกรีต</BtnPrimary>
        </div>
      </header>

      <TabNav active="home" />

      <div className="max-w-screen-2xl mx-auto px-4 py-6 space-y-6">
        {params.success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 flex items-center gap-2.5 text-sm">
            <svg className="w-4 h-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            จองคอนกรีตสำเร็จ — <code className="font-mono text-xs">{params.success}</code>
          </div>
        )}

        {/* Status overview */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">ภาพรวมสถานะ</h2>
            <span className="text-sm font-bold text-orange-500 tabular-nums">{count.toLocaleString()} <span className="text-xs font-normal text-zinc-400">รายการ</span></span>
          </div>
          <div className="space-y-2">
            {statusSummary.map((s) => (
              <StatusItem key={s.status_id} statusId={s.status_id} label={s.status_name} value={s.count} total={count} />
            ))}
          </div>
        </section>

        {/* Latest requests */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">รายการล่าสุด</h2>
            <span className="text-xs text-zinc-400">{requests.length} / {count.toLocaleString()}</span>
          </div>
          <RequestList requests={requests} />
        </section>
      </div>
    </main>
  );
}
