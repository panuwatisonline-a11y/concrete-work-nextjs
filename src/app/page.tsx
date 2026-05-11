import Link from "next/link";
import { getRequests, getStatusSummary } from "@/lib/supabase/queries";
import { RequestList, STATUS_STYLES, FALLBACK_STYLE } from "@/components/RequestList";
import TabNav from "@/components/TabNav";
import { AppLogo, BtnPrimary, Card, PlusIcon } from "@/components/ui";

function StatusRow({ statusId, label, value, total }: { statusId: number; label: string; value: number; total: number }) {
  const s = STATUS_STYLES[statusId] ?? FALLBACK_STYLE;
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <Link
      href={`/requests?status=${statusId}`}
      className="flex items-center gap-3 py-3 border-b border-zinc-100 last:border-0 hover:bg-zinc-50 -mx-4 px-4 transition-colors group"
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
      <span className="text-xs text-zinc-700 flex-1 min-w-0 truncate">{label}</span>
      <div className="hidden sm:flex items-center gap-3 shrink-0">
        <div className="w-24 bg-zinc-100 rounded-full h-1 overflow-hidden">
          <div className={`h-full rounded-full transition-all ${s.bar}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <span className={`text-sm font-bold tabular-nums w-8 text-right shrink-0 ${value > 0 ? "text-zinc-800" : "text-zinc-300"}`}>
        {value.toLocaleString()}
      </span>
      <svg className="w-4 h-4 text-zinc-300 group-hover:text-orange-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
    <main className="min-h-screen bg-zinc-100">
      {/* Top header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-20">
        <div className="max-w-screen-2xl mx-auto px-4 h-12 flex items-center justify-between">
          <AppLogo />
          <BtnPrimary href="/book"><PlusIcon />จองคอนกรีต</BtnPrimary>
        </div>
      </header>

      {/* Tab nav — sticky just below header */}
      <TabNav active="home" />

      <div className="max-w-screen-2xl mx-auto px-4 py-5 space-y-4">
        {params.success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 flex items-center gap-2.5 text-xs">
            <svg className="w-4 h-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>จองคอนกรีตสำเร็จ — <code className="font-mono">{params.success}</code></span>
          </div>
        )}

        {/* Status summary */}
        <Card>
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">ภาพรวมสถานะ</p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-orange-500 tabular-nums">{count.toLocaleString()}</span>
              <span className="text-xs text-zinc-400">รายการ</span>
            </div>
          </div>
          <div className="px-4">
            {statusSummary.map((s) => (
              <StatusRow key={s.status_id} statusId={s.status_id} label={s.status_name} value={s.count} total={count} />
            ))}
          </div>
        </Card>

        {/* Latest requests */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest">รายการคำขอล่าสุด</p>
            <span className="text-xs text-zinc-400">{requests.length} / {count.toLocaleString()}</span>
          </div>
          <RequestList requests={requests} />
        </div>
      </div>
    </main>
  );
}
