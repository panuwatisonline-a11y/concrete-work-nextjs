import Link from "next/link";
import type { RequestView } from "@/lib/supabase/queries";
import { formatWireDateAsDMY } from "@/lib/date-display";
import { formatRemarksForDisplay, formatVolumeM3, parseStructurePickFromRemarks } from "@/lib/request-format";
import { Card } from "@/components/ui";

/* ── Status colour system (cohesive palette) ─────────────────────── */
export const STATUS_STYLES: Record<number, { badge: string; dot: string; bar: string }> = {
  1: { badge: "bg-amber-50 text-amber-700 border-amber-200",    dot: "bg-amber-400",   bar: "bg-amber-400" },
  2: { badge: "bg-sky-50 text-sky-700 border-sky-200",          dot: "bg-sky-400",     bar: "bg-sky-400" },
  3: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", bar: "bg-emerald-500" },
  4: { badge: "bg-violet-50 text-violet-700 border-violet-200", dot: "bg-violet-400",  bar: "bg-violet-400" },
  5: { badge: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-400",  bar: "bg-orange-400" },
  6: { badge: "bg-red-50 text-red-600 border-red-200",          dot: "bg-red-400",     bar: "bg-red-400" },
  7: { badge: "bg-zinc-100 text-zinc-500 border-zinc-200",      dot: "bg-zinc-300",    bar: "bg-zinc-300" },
  8: { badge: "bg-teal-50 text-teal-700 border-teal-200",       dot: "bg-teal-500",    bar: "bg-teal-500" },
};

export const FALLBACK_STYLE = {
  badge: "bg-zinc-100 text-zinc-500 border-zinc-200",
  dot:   "bg-zinc-300",
  bar:   "bg-zinc-300",
};

export function statusStyle(id: number | null) {
  return id != null ? (STATUS_STYLES[id] ?? FALLBACK_STYLE) : FALLBACK_STYLE;
}

export function StatusBadge({ statusId, statusName }: { statusId: number | null; statusName: string | null }) {
  if (!statusName) return null;
  const s = statusStyle(statusId);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-medium whitespace-nowrap ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
      {statusName}
    </span>
  );
}

/** Tight pill for dense lists (e.g. dashboard recent). Renders when name or id is present. */
export function StatusBadgeCompact({ statusId, statusName }: { statusId: number | null; statusName: string | null }) {
  const label = statusName?.trim();
  if (statusId == null && !label) return null;
  const s = statusStyle(statusId);
  const display = label ?? (statusId != null ? "ไม่ระบุ" : "—");
  return (
    <span
      title={label ?? (statusId != null ? `สถานะ #${statusId}` : undefined)}
      className={`inline-block max-w-[min(11rem,100%)] truncate align-middle rounded-md border px-1.5 py-0.5 text-[10px] font-semibold leading-tight ${s.badge}`}
    >
      {display}
    </span>
  );
}

export function StatusDot({ statusId }: { statusId: number | null }) {
  return <span className={`w-2 h-2 rounded-full shrink-0 ${statusStyle(statusId).dot}`} />;
}

export function formatDate(d: string | null) {
  return formatWireDateAsDMY(d);
}

/** บรรทัดหัวมือถือ: ผู้จอง | ผู้รับเหมา */
function bookerClientHeadline(req: RequestView): string {
  const b = req.booked_by_name?.trim();
  const c = req.client_name?.trim();
  if (b && c) return `${b} | ${c}`;
  if (b) return b;
  if (c) return c;
  return "—";
}

/* ── Dashboard “รายการล่าสุด” — readable multi-line row (mobile-first) ─ */
function RequestRowMinimal({ req }: { req: RequestView }) {
  const s = statusStyle(req.status_id);
  const booker = req.booked_by_name?.trim() || req.client_name?.trim() || null;
  return (
    <Link
      href={`/requests/${req.id}`}
      className="flex gap-3 px-4 py-3.5 hover:bg-zinc-50/90 active:bg-zinc-50 border-b border-zinc-100 last:border-b-0 transition-colors group"
    >
      <span className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-white ${s.dot}`} aria-hidden />
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-zinc-900 tabular-nums tracking-tight">
              <span className="shrink-0">
                {formatDate(req.request_date)}
                {req.request_time && (
                  <span className="text-xs font-normal text-zinc-400 tabular-nums ml-1.5">{req.request_time.slice(0, 5)}</span>
                )}
              </span>
              <StatusBadgeCompact statusId={req.status_id} statusName={req.status_name} />
            </p>
            <p className="mt-0.5 text-xs text-zinc-600 truncate" title={booker ?? undefined}>
              {booker ?? "—"}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end justify-start text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-zinc-900 tabular-nums leading-none">
                {formatVolumeM3(req.volume_request)}
              </span>
              <span className="text-[11px] font-medium text-zinc-400">m³</span>
            </div>
          </div>
        </div>
        <p className="text-[13px] text-zinc-600 leading-snug line-clamp-2">{req.full_location ?? "—"}</p>
      </div>
      <div className="flex shrink-0 items-center self-center pt-0.5">
        <svg className="w-4 h-4 text-zinc-300 group-hover:text-orange-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

/* ── Standard compact card (status page) ─────────────────────────── */
function RequestCard({ req }: { req: RequestView }) {
  return (
    <Link
      href={`/requests/${req.id}`}
      className="bg-white border border-zinc-200 rounded-xl px-4 py-3.5 flex items-center gap-3 hover:border-zinc-300 hover:bg-zinc-50 transition-colors active:scale-[0.99]"
    >
      <div className="shrink-0 text-center w-12">
        <p className="text-[11px] font-semibold text-zinc-700 tabular-nums leading-tight">{formatDate(req.request_date)}</p>
        {req.request_time && <p className="text-[10px] text-zinc-400 tabular-nums mt-0.5">{req.request_time.slice(0, 5)}</p>}
      </div>
      <div className="w-px h-8 bg-zinc-100 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-zinc-800 truncate">{bookerClientHeadline(req)}</p>
        <p className="text-xs text-zinc-700 truncate mt-0.5">
          {req.full_location ?? "—"}
          {req.structure_no && <span className="font-normal text-zinc-400"> · {req.structure_no}</span>}
        </p>
        <p className="text-[11px] text-zinc-500 truncate mt-0.5">
          {req.concrete_work ?? "—"} · {req.mixcode ?? "—"}
        </p>
        <div className="mt-2"><StatusBadge statusId={req.status_id} statusName={req.status_name} /></div>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-bold text-zinc-800 tabular-nums">{formatVolumeM3(req.volume_request)}</p>
        <p className="text-[10px] text-zinc-400">m³</p>
      </div>
      <svg className="w-4 h-4 text-zinc-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

/* ── Detailed card (status page) ─────────────────────────────────── */
function RequestCardDetailed({ req }: { req: RequestView }) {
  const note = formatRemarksForDisplay(req.remarks);
  return (
    <Link
      href={`/requests/${req.id}`}
      className="bg-white border border-zinc-200 rounded-xl p-4 space-y-3 hover:border-zinc-300 hover:bg-zinc-50 transition-colors block active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-zinc-800 truncate">{bookerClientHeadline(req)}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{req.full_location ?? "—"}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <StatusBadge statusId={req.status_id} statusName={req.status_name} />
          <svg className="w-4 h-4 text-zinc-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {([
          ["วันที่ขอ",     `${formatDate(req.request_date)}${req.request_time ? ` · ${req.request_time.slice(0, 5)}` : ""}`],
          ["วันที่เท",     formatDate(req.casting_date)],
          ["โครงสร้าง",    `${req.structure_name ?? parseStructurePickFromRemarks(req.remarks) ?? "—"}${req.structure_no ? ` (${req.structure_no})` : ""}`],
          ["ประเภทงาน",    req.concrete_work ?? "—"],
          ["Mix Code",    req.mixcode ?? "—"],
          ["ปริมาณ",      `${formatVolumeM3(req.volume_request)} m³`],
        ] as [string, string][]).map(([label, val]) => (
          <div key={label}>
            <p className="text-[9px] uppercase tracking-widest text-zinc-400 mb-0.5">{label}</p>
            <p className="text-xs text-zinc-700 truncate">{val}</p>
          </div>
        ))}
      </div>
      {note && (
        <p className="text-[11px] text-zinc-400 border-t border-zinc-100 pt-2 truncate">{note}</p>
      )}
    </Link>
  );
}

/* ── Desktop table row ───────────────────────────────────────────── */
function RequestRow({ req }: { req: RequestView }) {
  const cells: React.ReactNode[] = [
    <>{formatDate(req.request_date)}{req.request_time && <span className="ml-1.5 text-zinc-400 tabular-nums">{req.request_time.slice(0, 5)}</span>}</>,
    req.client_name ?? "—",
    req.full_location ?? "—",
    <>{req.structure_name ?? parseStructurePickFromRemarks(req.remarks) ?? "—"}{req.structure_no && <span className="ml-1 text-zinc-400"> ({req.structure_no})</span>}</>,
    req.concrete_work ?? "—",
    req.mixcode ?? "—",
  ];
  return (
    <tr className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
      {cells.map((cell, i) => (
        <td key={i} className="px-4 py-3 text-xs text-zinc-700">
          <Link href={`/requests/${req.id}`} className="block">{cell}</Link>
        </td>
      ))}
      <td className="px-4 py-3 text-xs text-zinc-700 text-right tabular-nums whitespace-nowrap">
        <Link href={`/requests/${req.id}`} className="block">{formatVolumeM3(req.volume_request)}</Link>
      </td>
      <td className="px-4 py-3">
        <Link href={`/requests/${req.id}`} className="block">
          <StatusBadge statusId={req.status_id} statusName={req.status_name} />
        </Link>
      </td>
    </tr>
  );
}

/* ── Main export ─────────────────────────────────────────────────── */
export function RequestList({
  requests,
  variant = "compact",
  minimal = false,
}: {
  requests: RequestView[];
  variant?: "compact" | "detailed";
  minimal?: boolean;
}) {
  if (requests.length === 0) {
    return (
      <Card className="py-16 text-center">
        <p className="text-zinc-400 text-sm">ยังไม่มีข้อมูลคำขอ</p>
      </Card>
    );
  }

  if (minimal) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        {requests.map((req) => <RequestRowMinimal key={req.id} req={req} />)}
      </div>
    );
  }

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden space-y-2">
        {requests.map((req) =>
          variant === "detailed"
            ? <RequestCardDetailed key={req.id} req={req} />
            : <RequestCard key={req.id} req={req} />
        )}
      </div>
      {/* Desktop */}
      <div className="hidden md:block bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                {["วันที่ขอ","ผู้รับเหมา","สถานที่","โครงสร้าง","ประเภทงาน","Mix Code","ปริมาณ (m³)","สถานะ"].map((h, i) => (
                  <th key={h} className={`px-4 py-3 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest whitespace-nowrap ${i === 6 ? "text-right" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{requests.map((req) => <RequestRow key={req.id} req={req} />)}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}
