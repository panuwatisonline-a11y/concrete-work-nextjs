import Link from "next/link";
import { getRequests, getStatusSummary } from "@/lib/supabase/queries";
import { RequestList, STATUS_STYLES, FALLBACK_STYLE } from "@/components/RequestList";
import TabNav from "@/components/TabNav";

function StatusRow({
  statusId,
  label,
  value,
  total,
}: {
  statusId: number;
  label: string;
  value: number;
  total: number;
}) {
  const s = STATUS_STYLES[statusId] ?? FALLBACK_STYLE;
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <Link
      href={`/requests?status=${statusId}`}
      className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0 hover:bg-gray-50 active:bg-orange-50 -mx-4 px-4 transition-colors group"
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
      <span className="text-gray-700 text-xs flex-1 min-w-0 leading-snug group-hover:text-gray-900 transition-colors">{label}</span>
      <div className="hidden sm:block w-28 shrink-0">
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className={`text-base font-bold w-8 text-right tabular-nums ${value > 0 ? "text-gray-900" : "text-gray-300"}`}>
          {value.toLocaleString()}
        </span>
        <svg className="w-4 h-4 text-gray-300 group-hover:text-orange-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const [{ data: requests, count }, statusSummary, params] = await Promise.all([
    getRequests(100, 0),
    getStatusSummary(),
    searchParams,
  ]);

  const successId = params.success;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
              C
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-900 leading-none">Concrete Works</h1>
              <p className="text-gray-500 text-[10px] mt-0.5">ระบบจัดการคำขอเทคอนกรีต</p>
            </div>
          </div>
          <Link
            href="/book"
            className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 active:scale-95 transition text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            จองคอนกรีต
          </Link>
        </div>
        <TabNav active="home" />
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 py-5 space-y-5">
        {/* Success banner */}
        {successId && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-5 py-4 flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold text-sm">จองคอนกรีตสำเร็จ!</p>
              <p className="text-xs text-green-600 font-mono mt-0.5">Request ID: {successId}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <section>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xs font-semibold text-gray-900">ภาพรวมสถานะ</h2>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500 text-xs">ทั้งหมด</span>
                <span className="text-base font-bold text-orange-500">{count.toLocaleString()}</span>
                <span className="text-gray-400 text-xs">รายการ</span>
              </div>
            </div>
            <div className="px-4">
              {statusSummary.map((s) => (
                <StatusRow
                  key={s.status_id}
                  statusId={s.status_id}
                  label={s.status_name}
                  value={s.count}
                  total={count}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Requests Table */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
              รายการคำขอล่าสุด
            </h2>
            <span className="text-gray-400 text-xs">
              แสดง {requests.length} จาก {count.toLocaleString()} รายการ
            </span>
          </div>
          <RequestList requests={requests} />
        </section>
      </div>
    </main>
  );
}
