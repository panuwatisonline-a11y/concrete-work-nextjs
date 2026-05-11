import Link from "next/link";
import { getRequests, getStatusSummary } from "@/lib/supabase/queries";
import { RequestList, STATUS_STYLES, FALLBACK_STYLE } from "@/components/RequestList";
import TabNav from "@/components/TabNav";
import { AppLogo, BtnPrimary, Card, PlusIcon } from "@/components/ui";

function StatusRow({
  statusId, label, value, total,
}: { statusId: number; label: string; value: number; total: number }) {
  const s = STATUS_STYLES[statusId] ?? FALLBACK_STYLE;
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <Link
      href={`/requests?status=${statusId}`}
      className="flex items-center gap-3 py-2.5 border-b border-[--border-subtle] last:border-0 hover:bg-[--border-subtle] -mx-4 px-4 transition-colors group"
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
      <span className="text-[--text-2] text-xs flex-1 min-w-0 leading-snug">{label}</span>
      <div className="hidden sm:block w-24 shrink-0">
        <div className="w-full bg-[--border] rounded-full h-1 overflow-hidden">
          <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className={`text-sm font-semibold w-7 text-right tabular-nums ${value > 0 ? "text-[--text]" : "text-[--text-faint]"}`}>
          {value.toLocaleString()}
        </span>
        <svg className="w-3.5 h-3.5 text-[--text-faint] group-hover:text-[--accent] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

export default async function Home({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const [{ data: requests, count }, statusSummary, params] = await Promise.all([
    getRequests(100, 0),
    getStatusSummary(),
    searchParams,
  ]);
  const successId = params.success;

  return (
    <main className="min-h-screen">
      <header className="border-b border-[--border] bg-[--surface] sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-4 h-12 flex items-center justify-between">
          <AppLogo />
          <BtnPrimary href="/book">
            <PlusIcon />
            จองคอนกรีต
          </BtnPrimary>
        </div>
        <TabNav active="home" />
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 py-5 space-y-4">
        {successId && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-[--radius] px-4 py-3 flex items-center gap-2.5 text-xs">
            <svg className="w-4 h-4 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>จองคอนกรีตสำเร็จ — <span className="font-mono">{successId}</span></span>
          </div>
        )}

        {/* Status summary */}
        <Card>
          <div className="flex items-center justify-between px-4 py-3 border-b border-[--border-subtle]">
            <p className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider">ภาพรวมสถานะ</p>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-[--accent] tabular-nums">{count.toLocaleString()}</span>
              <span className="text-xs text-[--text-faint]">รายการ</span>
            </div>
          </div>
          <div className="px-4">
            {statusSummary.map((s) => (
              <StatusRow key={s.status_id} statusId={s.status_id} label={s.status_name} value={s.count} total={count} />
            ))}
          </div>
        </Card>

        {/* Requests */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-[--text-faint] uppercase tracking-wider">รายการคำขอล่าสุด</p>
            <span className="text-xs text-[--text-faint]">{requests.length} / {count.toLocaleString()}</span>
          </div>
          <RequestList requests={requests} />
        </section>
      </div>
    </main>
  );
}
