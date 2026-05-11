import Link from "next/link";
import type { RequestView } from "@/lib/supabase/queries";
import { Card } from "@/components/ui";

export const STATUS_STYLES: Record<number, { badge: string; dot: string; bar: string }> = {
  1: { badge: "bg-yellow-50 text-yellow-700 border-yellow-200",    dot: "bg-yellow-400",  bar: "bg-yellow-400" },
  2: { badge: "bg-blue-50 text-blue-700 border-blue-200",          dot: "bg-blue-400",    bar: "bg-blue-400" },
  3: { badge: "bg-green-50 text-green-700 border-green-200",       dot: "bg-green-500",   bar: "bg-green-500" },
  4: { badge: "bg-cyan-50 text-cyan-700 border-cyan-200",          dot: "bg-cyan-400",    bar: "bg-cyan-400" },
  5: { badge: "bg-orange-50 text-orange-700 border-orange-200",    dot: "bg-orange-400",  bar: "bg-orange-400" },
  6: { badge: "bg-red-50 text-red-700 border-red-200",             dot: "bg-red-400",     bar: "bg-red-400" },
  7: { badge: "bg-zinc-100 text-zinc-500 border-zinc-200",         dot: "bg-zinc-400",    bar: "bg-zinc-400" },
  8: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", bar: "bg-emerald-500" },
};

export const FALLBACK_STYLE = {
  badge: "bg-zinc-100 text-zinc-500 border-zinc-200",
  dot: "bg-zinc-400",
  bar: "bg-zinc-400",
};

export function statusStyle(id: number | null) {
  return id != null ? (STATUS_STYLES[id] ?? FALLBACK_STYLE) : FALLBACK_STYLE;
}

export function StatusBadge({ statusId, statusName }: { statusId: number | null; statusName: string | null }) {
  if (!statusName) return null;
  const s = statusStyle(statusId);
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-medium leading-tight ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
      {statusName}
    </span>
  );
}

export function StatusDot({ statusId }: { statusId: number | null }) {
  const s = statusStyle(statusId);
  return <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />;
}

export function formatDate(d: string | null) {
  if (!d) return "-";
  const [y, m, day] = d.slice(0, 10).split("-");
  return `${day}/${m}/${y}`;
}

const ChevronRight = () => (
  <svg className="w-3.5 h-3.5 text-[--text-faint] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

function RequestCard({ req }: { req: RequestView }) {
  return (
    <Link href={`/requests/${req.id}`} className="bg-[--surface] border border-[--border] rounded-[--radius] px-4 py-3 flex items-center gap-3 hover:bg-[--border-subtle] transition-colors">
      <div className="shrink-0 text-center w-11">
        <p className="text-[10px] font-medium text-[--text] leading-tight tabular-nums">{formatDate(req.request_date)}</p>
        {req.request_time && <p className="text-[9px] text-[--text-faint] tabular-nums mt-0.5">{req.request_time.slice(0, 5)}</p>}
      </div>
      <div className="w-px h-6 bg-[--border] shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-[--text] truncate">
          {req.full_location ?? "-"}
          {req.structure_no ? <span className="text-[--text-faint] font-normal"> · {req.structure_no}</span> : null}
        </p>
        <p className="text-[10px] text-[--text-muted] truncate mt-0.5">{req.concrete_work ?? "-"} · {req.mixcode ?? "-"}</p>
        <div className="mt-1.5"><StatusBadge statusId={req.status_id} statusName={req.status_name} /></div>
      </div>
      <div className="shrink-0 flex items-center gap-1">
        <div className="text-right">
          <p className="text-xs font-semibold text-[--text] tabular-nums">{req.volume_request?.toLocaleString() ?? "-"}</p>
          <p className="text-[9px] text-[--text-faint]">m³</p>
        </div>
        <ChevronRight />
      </div>
    </Link>
  );
}

function RequestCardDetailed({ req }: { req: RequestView }) {
  return (
    <Link href={`/requests/${req.id}`} className="bg-[--surface] border border-[--border] rounded-[--radius] p-4 space-y-3 hover:bg-[--border-subtle] transition-colors block">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[--text] truncate">{req.client_name ?? "ไม่ระบุผู้ว่าจ้าง"}</p>
          <p className="text-[10px] text-[--text-muted] mt-0.5 truncate">{req.full_location ?? "-"}</p>
        </div>
        <div className="flex items-start gap-1 shrink-0 max-w-[48%]">
          <StatusBadge statusId={req.status_id} statusName={req.status_name} />
          <ChevronRight />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {[
          ["วันที่ขอ", `${formatDate(req.request_date)}${req.request_time ? ` ${req.request_time.slice(0, 5)}` : ""}`],
          ["วันที่เท", formatDate(req.casting_date)],
          ["โครงสร้าง", `${req.structure_name ?? "-"}${req.structure_no ? ` (${req.structure_no})` : ""}`],
          ["ประเภทงาน", req.concrete_work ?? "-"],
          ["Mix Code", req.mixcode ?? "-"],
          ["ปริมาตรขอ", req.volume_request != null ? `${req.volume_request.toLocaleString()} m³` : "-"],
        ].map(([label, val]) => (
          <div key={label}>
            <p className="text-[9px] uppercase tracking-widest text-[--text-faint]">{label}</p>
            <p className="text-xs text-[--text-2] truncate">{val}</p>
          </div>
        ))}
      </div>
      {req.remarks && <p className="text-[10px] text-[--text-faint] border-t border-[--border-subtle] pt-2 truncate">{req.remarks}</p>}
    </Link>
  );
}

function RequestRow({ req }: { req: RequestView }) {
  return (
    <tr className="border-b border-[--border-subtle] hover:bg-[--border-subtle] transition-colors">
      {[
        <>{formatDate(req.request_date)}{req.request_time && <span className="ml-1.5 text-[--text-faint] text-xs tabular-nums">{req.request_time.slice(0, 5)}</span>}</>,
        req.client_name ?? "-",
        req.full_location ?? "-",
        <>{req.structure_name ?? "-"}{req.structure_no ? <span className="ml-1 text-[--text-faint] text-xs">({req.structure_no})</span> : null}</>,
        req.concrete_work ?? "-",
        req.mixcode ?? "-",
      ].map((cell, i) => (
        <td key={i} className="px-4 py-2.5 text-xs text-[--text-2]">
          <Link href={`/requests/${req.id}`} className="block">{cell}</Link>
        </td>
      ))}
      <td className="px-4 py-2.5 text-xs text-right text-[--text-2] tabular-nums whitespace-nowrap">
        <Link href={`/requests/${req.id}`} className="block">{req.volume_request?.toLocaleString() ?? "-"}</Link>
      </td>
      <td className="px-4 py-2.5">
        <Link href={`/requests/${req.id}`} className="block"><StatusBadge statusId={req.status_id} statusName={req.status_name} /></Link>
      </td>
    </tr>
  );
}

export function RequestList({ requests, variant = "compact" }: { requests: RequestView[]; variant?: "compact" | "detailed" }) {
  if (requests.length === 0) {
    return (
      <Card className="py-16 text-center">
        <p className="text-[--text-faint] text-sm">ยังไม่มีข้อมูลคำขอ</p>
      </Card>
    );
  }
  return (
    <>
      <div className="md:hidden space-y-2">
        {requests.map((req) => variant === "detailed" ? <RequestCardDetailed key={req.id} req={req} /> : <RequestCard key={req.id} req={req} />)}
      </div>
      <div className="hidden md:block bg-[--surface] border border-[--border] rounded-[--radius] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[--border]">
                {["วันที่ขอ","ผู้ว่าจ้าง","สถานที่","โครงสร้าง","ประเภทงาน","Mix Code","ปริมาตร (m³)","สถานะ"].map((h, i) => (
                  <th key={h} className={`px-4 py-2.5 text-[10px] font-semibold text-[--text-faint] uppercase tracking-widest whitespace-nowrap bg-[--bg] ${i === 6 ? "text-right" : ""}`}>{h}</th>
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
