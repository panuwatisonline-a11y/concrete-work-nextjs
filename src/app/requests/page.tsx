import Link from "next/link";
import { notFound } from "next/navigation";
import { getRequestsByStatus, getStatusList } from "@/lib/supabase/queries";
import { RequestList, STATUS_STYLES, FALLBACK_STYLE } from "@/components/RequestList";

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
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
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group active:opacity-60 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
              C
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 leading-none group-hover:text-orange-500 transition">
                Concrete Works
              </h1>
              <p className="text-gray-500 text-xs mt-0.5">ระบบจัดการคำขอเทคอนกรีต</p>
            </div>
          </Link>
          <span className="text-gray-300 mx-1">/</span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${style.badge}`}>
            <span className={`w-2 h-2 rounded-full ${style.dot}`} />
            {currentStatus.status_name}
          </span>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-6 py-8 space-y-5">
        {/* Count */}
        <div className="flex items-center justify-between">
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
            รายการคำขอ
          </h2>
          <span className="text-gray-400 text-xs">{count.toLocaleString()} รายการ</span>
        </div>

        <RequestList requests={requests} variant="detailed" />
      </div>
    </main>
  );
}
