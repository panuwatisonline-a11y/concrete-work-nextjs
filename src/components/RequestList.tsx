import Link from "next/link";
import type { RequestView } from "@/lib/supabase/queries";

export const STATUS_STYLES: Record<number, { badge: string; dot: string; bar: string }> = {
  1: { badge: "bg-yellow-100 text-yellow-800 border-yellow-300",    dot: "bg-yellow-400",  bar: "bg-yellow-400" },
  2: { badge: "bg-blue-100 text-blue-800 border-blue-300",          dot: "bg-blue-500",    bar: "bg-blue-500" },
  3: { badge: "bg-green-100 text-green-800 border-green-300",       dot: "bg-green-500",   bar: "bg-green-500" },
  4: { badge: "bg-cyan-100 text-cyan-800 border-cyan-300",          dot: "bg-cyan-500",    bar: "bg-cyan-500" },
  5: { badge: "bg-orange-100 text-orange-800 border-orange-300",    dot: "bg-orange-400",  bar: "bg-orange-400" },
  6: { badge: "bg-red-100 text-red-800 border-red-300",             dot: "bg-red-500",     bar: "bg-red-500" },
  7: { badge: "bg-gray-100 text-gray-600 border-gray-300",          dot: "bg-gray-400",    bar: "bg-gray-400" },
  8: { badge: "bg-emerald-100 text-emerald-800 border-emerald-300", dot: "bg-emerald-500", bar: "bg-emerald-500" },
};

export const FALLBACK_STYLE = {
  badge: "bg-gray-100 text-gray-600 border-gray-300",
  dot: "bg-gray-400",
  bar: "bg-gray-400",
};

export function statusStyle(id: number | null) {
  return id != null ? (STATUS_STYLES[id] ?? FALLBACK_STYLE) : FALLBACK_STYLE;
}

export function StatusBadge({
  statusId,
  statusName,
}: {
  statusId: number | null;
  statusName: string | null;
}) {
  if (!statusName) return null;
  const s = statusStyle(statusId);
  return (
    <span className={`inline-flex items-start gap-1 px-1.5 py-0.5 rounded border text-[10px] font-medium leading-tight ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-[2px] ${s.dot}`} />
      <span className="break-all">{statusName}</span>
    </span>
  );
}

export function StatusDot({ statusId }: { statusId: number | null }) {
  const s = statusStyle(statusId);
  return <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.dot}`} />;
}

export function formatDate(d: string | null) {
  if (!d) return "-";
  const [y, m, day] = d.slice(0, 10).split("-");
  return `${day}/${m}/${y}`;
}

const ChevronRight = () => (
  <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

/* ── Compact mobile card (dashboard) ── */
function RequestCard({ req }: { req: RequestView }) {
  return (
    <Link
      href={`/requests/${req.id}`}
      className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 active:bg-orange-50 transition-colors"
    >
      {/* left: date + time */}
      <div className="shrink-0 text-center w-14">
        <p className="text-xs font-semibold text-gray-900 leading-tight tabular-nums">
          {formatDate(req.request_date)}
        </p>
        {req.request_time && (
          <p className="text-[10px] text-gray-400 tabular-nums mt-0.5">
            {req.request_time.slice(0, 5)}
          </p>
        )}
      </div>

      {/* divider */}
      <div className="w-px h-8 bg-gray-200 shrink-0" />

      {/* middle: main info + status badge */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {req.full_location ?? "-"}
          {req.structure_no ? <span className="text-gray-400 font-normal"> · {req.structure_no}</span> : null}
        </p>
        <p className="text-xs text-gray-500 truncate mt-0.5">
          {req.concrete_work ?? "-"} · {req.mixcode ?? "-"}
        </p>
        <div className="mt-1.5">
          <StatusBadge statusId={req.status_id} statusName={req.status_name} />
        </div>
      </div>

      {/* right: volume + chevron */}
      <div className="shrink-0 flex items-center gap-1.5">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900 tabular-nums whitespace-nowrap">
            {req.volume_request?.toLocaleString() ?? "-"}
          </p>
          <p className="text-[10px] text-gray-400">m³</p>
        </div>
        <ChevronRight />
      </div>
    </Link>
  );
}

/* ── Detailed mobile card (status page) ── */
function RequestCardDetailed({ req }: { req: RequestView }) {
  return (
    <Link
      href={`/requests/${req.id}`}
      className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 active:bg-orange-50 transition-colors block"
    >
      {/* top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {req.client_name ?? "ไม่ระบุผู้ว่าจ้าง"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{req.full_location ?? "-"}</p>
        </div>
        <div className="flex items-start gap-1 shrink-0 max-w-[48%]">
          <StatusBadge statusId={req.status_id} statusName={req.status_name} />
          <ChevronRight />
        </div>
      </div>

      {/* detail grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400">วันที่ขอ</p>
          <p className="text-sm text-gray-700">
            {formatDate(req.request_date)}
            {req.request_time && (
              <span className="ml-1.5 text-gray-400 text-xs tabular-nums">{req.request_time.slice(0, 5)}</span>
            )}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400">วันที่เท</p>
          <p className="text-sm text-gray-700">{formatDate(req.casting_date)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400">โครงสร้าง</p>
          <p className="text-sm text-gray-700">
            {req.structure_name ?? "-"}{req.structure_no ? ` (${req.structure_no})` : ""}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400">ประเภทงาน</p>
          <p className="text-sm text-gray-700">{req.concrete_work ?? "-"}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400">Mix Code</p>
          <p className="text-sm text-gray-700">{req.mixcode ?? "-"}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400">ปริมาตรขอ</p>
          <p className="text-sm font-semibold text-gray-900 tabular-nums">
            {req.volume_request?.toLocaleString() ?? "-"} <span className="font-normal text-gray-400">m³</span>
          </p>
        </div>
      </div>

      {req.remarks && (
        <p className="text-xs text-gray-500 border-t border-gray-100 pt-2 truncate">{req.remarks}</p>
      )}
    </Link>
  );
}

/* ── Desktop table row ── */
function RequestRow({ req }: { req: RequestView }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-orange-50/50 transition-colors cursor-pointer">
      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
        <Link href={`/requests/${req.id}`} className="block">
          {formatDate(req.request_date)}
          {req.request_time && (
            <span className="ml-1.5 text-gray-400 text-xs tabular-nums">{req.request_time.slice(0, 5)}</span>
          )}
        </Link>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        <Link href={`/requests/${req.id}`} className="block">{req.client_name ?? "-"}</Link>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        <Link href={`/requests/${req.id}`} className="block">{req.full_location ?? "-"}</Link>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        <Link href={`/requests/${req.id}`} className="block">
          {req.structure_name ?? "-"}
          {req.structure_no ? (
            <span className="ml-1 text-gray-400 text-xs">({req.structure_no})</span>
          ) : null}
        </Link>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        <Link href={`/requests/${req.id}`} className="block">{req.concrete_work ?? "-"}</Link>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        <Link href={`/requests/${req.id}`} className="block">{req.mixcode ?? "-"}</Link>
      </td>
      <td className="px-4 py-3 text-sm text-right text-gray-700 whitespace-nowrap tabular-nums">
        <Link href={`/requests/${req.id}`} className="block">
          {req.volume_request != null ? req.volume_request.toLocaleString() : "-"}
        </Link>
      </td>
      <td className="px-4 py-3 text-sm">
        <StatusBadge statusId={req.status_id} statusName={req.status_name} />
      </td>
    </tr>
  );
}

/* ── Main export: responsive list ── */
export function RequestList({
  requests,
  variant = "compact",
}: {
  requests: RequestView[];
  variant?: "compact" | "detailed";
}) {
  if (requests.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-16 text-center shadow-sm">
        <p className="text-gray-400 text-sm">ยังไม่มีข้อมูลคำขอ</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: cards */}
      <div className="md:hidden space-y-2">
        {requests.map((req) =>
          variant === "detailed" ? (
            <RequestCardDetailed key={req.id} req={req} />
          ) : (
            <RequestCard key={req.id} req={req} />
          )
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">วันที่ขอ</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ผู้ว่าจ้าง</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">สถานที่</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">โครงสร้าง</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ประเภทงาน</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mix Code</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right whitespace-nowrap">ปริมาตร (m³)</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <RequestRow key={req.id} req={req} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
