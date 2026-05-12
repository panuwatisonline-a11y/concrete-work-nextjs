"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, type ProfileUpdateState } from "./actions";
import { Select } from "@/components/Select";
import { BtnGhost, BtnPrimary, FieldError, Label, inputCls } from "@/components/ui";

const initialState: ProfileUpdateState = {};

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-4 py-2.5 border-b border-zinc-100 last:border-0">
      <dt className="text-xs font-medium text-zinc-400 shrink-0 sm:w-36">{label}</dt>
      <dd className="text-sm text-zinc-800 break-words">{value ?? "—"}</dd>
    </div>
  );
}

type JobOption = { id: number; job_name: string | null };
type ClientOption = { id: number; client_name: string };

type ProfileInitial = {
  fname: string | null;
  lname: string | null;
  phone: string | null;
};

type EditPanelProps = {
  initial: ProfileInitial;
  initialJobId: number | null;
  initialClientId: number | null;
  jobSelectOptions: { value: string; label: string }[];
  clientSelectOptions: { value: string; label: string }[];
  onCancel: () => void;
  onSaved: () => void;
};

function ProfileEditModePanel({
  initial,
  initialJobId,
  initialClientId,
  jobSelectOptions,
  clientSelectOptions,
  onCancel,
  onSaved,
}: EditPanelProps) {
  const [state, action, pending] = useActionState(updateProfile, initialState);

  useEffect(() => {
    if (state.success) {
      onSaved();
    }
  }, [state.success, onSaved]);

  return (
    <form action={action} className="space-y-4">
      <p className="text-xs text-zinc-500">
        แก้ไขชื่อ เบอร์ติดต่อ โครงการ และบริษัท/ผู้รับเหมา (จาก Client) — รหัสพนักงานและบทบาทจัดการผ่านผู้ดูแลระบบ
      </p>
      <div>
        <Label>ชื่อ</Label>
        <input className={inputCls} name="fname" defaultValue={initial.fname ?? ""} autoComplete="given-name" />
      </div>
      <div>
        <Label>นามสกุล</Label>
        <input className={inputCls} name="lname" defaultValue={initial.lname ?? ""} autoComplete="family-name" />
      </div>
      <div>
        <Label>เบอร์โทร</Label>
        <input
          className={inputCls}
          name="phone"
          type="tel"
          defaultValue={initial.phone ?? ""}
          autoComplete="tel"
          inputMode="tel"
        />
      </div>
      <div>
        <Label>โครงการ</Label>
        <Select
          name="job_id"
          options={jobSelectOptions}
          placeholder="— ไม่ระบุ / ย้ายโครงการ —"
          defaultValue={initialJobId != null ? String(initialJobId) : ""}
        />
        <p className="mt-1.5 text-[10px] text-zinc-400">เลือกจากรายการโครงการในระบบ หรือเปิดเมนูแล้วเลือกแถวแรกเพื่อไม่ผูกโครงการ</p>
      </div>
      <div>
        <Label>บริษัท/ผู้รับเหมา</Label>
        <Select
          name="client_id"
          options={clientSelectOptions}
          placeholder="— ไม่ระบุ —"
          defaultValue={initialClientId != null ? String(initialClientId) : ""}
        />
        <p className="mt-1.5 text-[10px] text-zinc-400">เลือกจากตาราง Client หรือแถวแรกเพื่อไม่ผูก</p>
      </div>
      <FieldError msg={state.error} />
      {state.success ? <p className="text-xs text-emerald-600">บันทึกแล้ว</p> : null}
      <div className="flex flex-wrap gap-2">
        <BtnPrimary type="submit" disabled={pending}>
          {pending ? "กำลังบันทึก…" : "บันทึกการแก้ไข"}
        </BtnPrimary>
        <BtnGhost type="button" disabled={pending} onClick={onCancel}>
          ยกเลิก
        </BtnGhost>
      </div>
    </form>
  );
}

type Props = {
  email: string | null;
  employeeId: string | null;
  role: string | null;
  jobs: JobOption[];
  clients: ClientOption[];
  initialJobId: number | null;
  initialClientId: number | null;
  /** ชื่อจาก profiles.client_name (fallback เมื่อไม่ตรงรายการ Client) */
  cachedClientName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  initial: ProfileInitial;
};

export default function ProfileEditForm({
  email,
  employeeId,
  role,
  jobs,
  clients,
  initialJobId,
  initialClientId,
  cachedClientName,
  createdAt,
  updatedAt,
  initial,
}: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [editSession, setEditSession] = useState(0);

  const jobSelectOptions = jobs.map((j) => ({
    value: String(j.id),
    label: j.job_name?.trim() ? j.job_name : `โครงการ #${j.id}`,
  }));

  const clientSelectOptions = clients.map((c) => ({
    value: String(c.id),
    label: c.client_name.trim() ? c.client_name : `ลูกค้า #${c.id}`,
  }));

  const handleSaved = useCallback(() => {
    setEditing(false);
    router.refresh();
  }, [router]);

  const openEditor = useCallback(() => {
    setEditSession((s) => s + 1);
    setEditing(true);
  }, []);

  const jobViewLabel =
    initialJobId != null
      ? jobs.find((j) => j.id === initialJobId)?.job_name?.trim() || `โครงการ #${initialJobId}`
      : null;

  const clientViewLabel =
    initialClientId != null
      ? clients.find((c) => c.id === initialClientId)?.client_name?.trim() ||
        cachedClientName?.trim() ||
        `ลูกค้า #${initialClientId}`
      : cachedClientName?.trim() || null;

  return (
    <div className="space-y-6">
      {!editing ? (
        <div className="space-y-4">
          <p className="text-xs text-zinc-500">
            ดูข้อมูลส่วนตัว โครงการ และบริษัท/ผู้รับเหมา หากต้องการแก้ไข ให้กดแก้ไขโปรไฟล์
          </p>
          <dl>
            <Row label="ชื่อ" value={initial.fname} />
            <Row label="นามสกุล" value={initial.lname} />
            <Row label="เบอร์โทร" value={initial.phone} />
            <Row label="โครงการ" value={jobViewLabel} />
            <Row label="บริษัท/ผู้รับเหมา" value={clientViewLabel} />
          </dl>
          <BtnPrimary type="button" onClick={openEditor}>
            แก้ไขโปรไฟล์
          </BtnPrimary>
        </div>
      ) : (
        <ProfileEditModePanel
          key={editSession}
          initial={initial}
          initialJobId={initialJobId}
          initialClientId={initialClientId}
          jobSelectOptions={jobSelectOptions}
          clientSelectOptions={clientSelectOptions}
          onCancel={() => setEditing(false)}
          onSaved={handleSaved}
        />
      )}

      <div className="border-t border-zinc-100 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">ข้อมูลบัญชี (อ่านอย่างเดียว)</p>
        <dl>
          <Row label="อีเมล (Auth)" value={email} />
          <Row label="รหัสพนักงาน" value={employeeId} />
          <Row label="บทบาท" value={role} />
          <Row label="สร้างเมื่อ" value={createdAt} />
          <Row label="อัปเดตล่าสุด" value={updatedAt} />
        </dl>
      </div>
    </div>
  );
}
