import Link from "next/link";
import { notFound } from "next/navigation";
import { getRequestById } from "@/lib/supabase/queries";
import { StatusBadge, formatDate } from "@/components/RequestList";
import { AppLogo, Card } from "@/components/ui";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">{label}</p>
      <div className="text-sm text-zinc-700">{value}</div>
    </div>
  );
}

function FullField({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="col-span-2 space-y-0.5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">{label}</p>
      <div className="text-sm text-zinc-700">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">{title}</p>
      </div>
      <div className="px-4 py-4 grid grid-cols-2 gap-x-6 gap-y-4">
        {children}
      </div>
    </Card>
  );
}

function TimelineItem({ label, at, by }: { label: string; at: string | null; by: string | null }) {
  if (!at) return null;
  const d = new Date(at);
  const date = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return (
    <div className="flex gap-3 items-start">
      <div className="mt-1.5 w-2 h-2 rounded-full bg-orange-400 shrink-0" />
      <div>
        <p className="text-sm font-medium text-zinc-800">{label}</p>
        <p className="text-xs text-zinc-400 mt-0.5">{date} · {time}{by && <> · <span className="text-zinc-500">{by}</span></>}</p>
      </div>
    </div>
  );
}

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const req = await getRequestById(id).catch(() => null);
  if (!req) notFound();

  const timeline = [
    { label: "จองแล้ว",            at: req.booked_at,     by: req.booked_by_name },
    { label: "ตรวจสอบผ่านแล้ว",    at: req.inspected_at,  by: req.inspected_by_name },
    { label: "อนุมัติ",             at: req.approved_at,   by: req.approved_by_name },
    { label: "ยืนยันรายการ",        at: req.confirmed_at,  by: req.confirmed_by_name },
    { label: "เลื่อนวันเท",         at: req.postponed_at,  by: req.postponed_by_name },
    { label: "ปฏิเสธ",              at: req.rejected_at,   by: req.rejected_by_name },
    { label: "ยกเลิก",              at: req.cancelled_at,  by: req.cancelled_by_name },
  ].filter((t) => t.at);

  return (
    <main className="min-h-screen bg-zinc-100">
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 h-12 flex items-center gap-3">
          <Link href={req.status_id ? `/requests?status=${req.status_id}` : "/"} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition shrink-0">
            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-800 truncate">{req.full_location ?? "รายละเอียดคำขอ"}</p>
            <p className="text-[11px] text-zinc-400 truncate">
              {formatDate(req.request_date)}{req.request_time && ` · ${req.request_time.slice(0, 5)}`}
            </p>
          </div>
          <div className="shrink-0">
            <StatusBadge statusId={req.status_id} statusName={req.status_name} />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-3">
        <Section title="ข้อมูลการขอ">
          <Field label="วันที่ขอ" value={<>{formatDate(req.request_date)}{req.request_time && <span className="ml-2 text-zinc-400 text-xs">{req.request_time.slice(0, 5)}</span>}</>} />
          <Field label="วันที่เทคอนกรีต" value={formatDate(req.casting_date)} />
          <Field label="ผู้ว่าจ้าง" value={req.client_name} />
          <FullField label="สถานที่" value={req.full_location} />
          <Field label="โครงสร้าง" value={req.structure_name} />
          <Field label="หมายเลขโครงสร้าง" value={req.structure_no} />
          <FullField label="ประเภทงาน" value={req.concrete_work} />
        </Section>

        <Section title="ข้อมูลคอนกรีต">
          <Field label="Mix Code" value={<span className="font-mono font-semibold text-orange-500">{req.mixcode}</span>} />
          <Field label="กำลังอัด" value={req.strength ? `${req.strength} ${req.strength_type ?? "ksc"}` : null} />
          <Field label="Slump" value={req.slump} />
          <Field label="Supplier" value={req.supplier} />
          <Field label="ปริมาตรตามแบบ (m³)" value={req.volume_dwg?.toLocaleString()} />
          <Field label="ปริมาตรที่ขอ (m³)" value={<span className="font-semibold text-zinc-900">{req.volume_request?.toLocaleString() ?? "—"}</span>} />
          {req.volume_actual != null && <Field label="ปริมาตรจริง (m³)" value={req.volume_actual.toLocaleString()} />}
          {req.volume_confirm != null && <Field label="ปริมาตร Confirm (m³)" value={req.volume_confirm.toLocaleString()} />}
          <Field label="จำนวนตัวอย่าง" value={req.sample_qty != null ? `${req.sample_qty} ก้อน${req.sample_type ? ` (${req.sample_type})` : ""}` : null} />
        </Section>

        {(req.full_wbs || req.full_abc) && (
          <Section title="รหัสโปรเจกต์">
            <FullField label="WBS Code" value={req.full_wbs} />
            <FullField label="ABC Code" value={req.full_abc} />
          </Section>
        )}

        {req.postpone_date && (
          <Section title="ข้อมูลการเลื่อน">
            <Field label="วันที่เลื่อนเป็น" value={<>{formatDate(req.postpone_date)}{req.postpone_time && <span className="ml-2 text-zinc-400 text-xs">{req.postpone_time.slice(0, 5)}</span>}</>} />
            <FullField label="เหตุผล" value={req.reason_postpone} />
          </Section>
        )}

        {(req.reason_reject || req.reason_cancel) && (
          <Section title="เหตุผล">
            <FullField label="เหตุผลการปฏิเสธ" value={req.reason_reject} />
            <FullField label="เหตุผลการยกเลิก" value={req.reason_cancel} />
          </Section>
        )}

        {req.remarks && (
          <Card className="px-4 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">หมายเหตุ</p>
            <p className="text-sm text-zinc-700 leading-relaxed">{req.remarks}</p>
          </Card>
        )}

        {timeline.length > 0 && (
          <Card className="overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">ประวัติการดำเนินการ</p>
            </div>
            <div className="px-4 py-4 space-y-4">
              {timeline.map((t) => <TimelineItem key={t.label} label={t.label} at={t.at} by={t.by} />)}
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
