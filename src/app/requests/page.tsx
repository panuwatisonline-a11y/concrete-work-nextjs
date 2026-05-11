import Link from "next/link";
import { notFound } from "next/navigation";
import { getRequestsByStatus, getStatusList } from "@/lib/supabase/queries";
import { RequestList, STATUS_STYLES, FALLBACK_STYLE } from "@/components/RequestList";
import { AppLogo, Card } from "@/components/ui";

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
    <main className="min-h-screen">
      <header className="border-b border-[--border] bg-[--surface] sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-4 h-12 flex items-center gap-3">
          <Link href="/" className="w-8 h-8 flex items-center justify-center rounded-[--radius-sm] hover:bg-[--border-subtle] transition shrink-0">
            <svg className="w-4 h-4 text-[--text-muted]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <AppLogo />
          <span className="text-[--text-faint] text-xs">/</span>
          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-[--radius-sm] border text-xs font-medium ${style.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            {currentStatus.status_name}
          </span>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[--text-faint] uppercase tracking-wider">รายการคำขอ</p>
          <span className="text-xs text-[--text-faint]">{count.toLocaleString()} รายการ</span>
        </div>
        {requests.length === 0 ? (
          <Card className="py-16 text-center">
            <p className="text-sm text-[--text-faint]">ไม่พบรายการในสถานะนี้</p>
          </Card>
        ) : (
          <RequestList requests={requests} variant="detailed" />
        )}
      </div>
    </main>
  );
}
