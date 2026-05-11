"use client";

import { useActionState, useEffect, useRef } from "react";
import { createBooking, type BookingState } from "./actions";
import { Select } from "@/components/Select";
import type {
  Client,
  Location,
  Structure,
  ConcreteWork,
  MixedCode,
  WBSCode,
  ABCCode,
} from "@/lib/supabase/queries";

type Props = {
  clients: Client[];
  locations: Location[];
  structures: Structure[];
  concreteWorks: ConcreteWork[];
  mixedCodes: MixedCode[];
  wbsCodes: WBSCode[];
  abcCodes: ABCCode[];
};

const initialState: BookingState = {};

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-500">{msg}</p>;
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

const inputCls =
  "w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition placeholder-gray-400 disabled:opacity-50";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
      <h3 className="text-sm font-semibold text-orange-500 uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

export default function BookingForm({
  clients,
  locations,
  structures,
  concreteWorks,
  mixedCodes,
  wbsCodes,
  abcCodes,
}: Props) {
  const [state, action, pending] = useActionState(createBooking, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  const err = state.fieldErrors ?? {};

  return (
    <form ref={formRef} action={action} className="space-y-5">
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {state.error}
        </div>
      )}

      {/* Section 1: Request Info */}
      <Section title="ข้อมูลการขอ">
        <Row>
          <div>
            <Label required>วันที่ขอ</Label>
            <input type="date" name="request_date" className={inputCls} required />
            <FieldError msg={err.request_date} />
          </div>
          <div>
            <Label>เวลา</Label>
            <input type="time" name="request_time" className={inputCls} />
          </div>
        </Row>
        <div className="max-w-xs">
          <Label>วันที่เทคอนกรีต</Label>
          <input type="date" name="casting_date" className={inputCls} />
        </div>
      </Section>

      {/* Section 2: Client & Codes */}
      <Section title="ผู้ว่าจ้าง & รหัสโปรเจกต์">
        <div>
          <Label>ผู้ว่าจ้าง</Label>
          <Select
            name="client_id"
            placeholder="-- เลือกผู้ว่าจ้าง --"
            options={clients.map((c) => ({ value: String(c.id), label: c.client_name ?? "" }))}
          />
        </div>
        <Row>
          <div>
            <Label>WBS Code</Label>
            <Select
              name="wbs_code_id"
              placeholder="-- เลือก WBS Code --"
              options={wbsCodes.map((w) => ({
                value: String(w.id),
                label: `${w.full_wbs ?? ""}${w.description ? ` — ${w.description}` : ""}`,
              }))}
            />
          </div>
          <div>
            <Label>ABC Code</Label>
            <Select
              name="abc_code_id"
              placeholder="-- เลือก ABC Code --"
              options={abcCodes.map((a) => ({
                value: String(a.id),
                label: `${a.full_abc ?? ""}${a.description ? ` — ${a.description}` : ""}`,
              }))}
            />
          </div>
        </Row>
      </Section>

      {/* Section 3: Location & Structure */}
      <Section title="สถานที่ & โครงสร้าง">
        <div>
          <Label required>สถานที่</Label>
          <Select
            name="location_id"
            placeholder="-- เลือกสถานที่ --"
            required
            options={locations.map((l) => ({
              value: String(l.id),
              label: l.full_location ?? l.description ?? `#${l.id}`,
            }))}
          />
          <FieldError msg={err.location_id} />
        </div>
        <Row>
          <div>
            <Label required>ประเภทโครงสร้าง</Label>
            <Select
              name="structure_id"
              placeholder="-- เลือกประเภทโครงสร้าง --"
              required
              options={structures.map((s) => ({ value: String(s.id), label: s.structure_name ?? "" }))}
            />
            <FieldError msg={err.structure_id} />
          </div>
          <div>
            <Label>หมายเลขโครงสร้าง</Label>
            <input
              type="text"
              name="structure_no"
              className={inputCls}
              placeholder="เช่น COL-A1-01"
            />
          </div>
        </Row>
        <div>
          <Label required>ประเภทงานคอนกรีต</Label>
          <Select
            name="concrete_work_id"
            placeholder="-- เลือกประเภทงาน --"
            required
            options={concreteWorks.map((cw) => ({
              value: String(cw.id),
              label: `${cw.concrete_work ?? ""}${cw.structure_list ? ` (${cw.structure_list})` : ""}`,
            }))}
          />
          <FieldError msg={err.concrete_work_id} />
        </div>
      </Section>

      {/* Section 4: Concrete Specs */}
      <Section title="ข้อมูลคอนกรีต">
        <div>
          <Label required>Mix Code</Label>
          <Select
            name="mixcode_id"
            placeholder="-- เลือก Mix Code --"
            required
            options={mixedCodes.map((m) => ({
              value: String(m.id),
              label: [
                m.mixcode,
                m.strength ? `${m.strength} ${m.strength_type ?? "ksc"}` : null,
                m.slump ? `Slump ${m.slump}` : null,
                m.supplier ? `[${m.supplier}]` : null,
              ]
                .filter(Boolean)
                .join(" · "),
            }))}
          />
          <FieldError msg={err.mixcode_id} />
        </div>
        <Row>
          <div>
            <Label>กำลังอัดที่กำหนด (ksc)</Label>
            <input
              type="number"
              name="strength"
              min="0"
              step="1"
              className={inputCls}
              placeholder="เช่น 280"
            />
          </div>
          <div>
            <Label>ปริมาตรตามแบบ (m³)</Label>
            <input
              type="number"
              name="volume_dwg"
              min="0"
              step="0.1"
              className={inputCls}
              placeholder="0.0"
            />
          </div>
        </Row>
        <Row>
          <div>
            <Label required>ปริมาตรที่ขอ (m³)</Label>
            <input
              type="number"
              name="volume_request"
              min="0.1"
              step="0.1"
              className={inputCls}
              placeholder="0.0"
              required
            />
            <FieldError msg={err.volume_request} />
          </div>
          <div>
            <Label>จำนวนตัวอย่าง (ก้อน)</Label>
            <input
              type="number"
              name="sample_qty"
              min="0"
              step="1"
              className={inputCls}
              placeholder="0"
            />
          </div>
        </Row>
      </Section>

      {/* Section 5: Remarks */}
      <Section title="หมายเหตุ">
        <div>
          <Label>หมายเหตุเพิ่มเติม</Label>
          <textarea
            name="remarks"
            rows={3}
            className={`${inputCls} resize-none`}
            placeholder="ระบุรายละเอียดเพิ่มเติม..."
          />
        </div>
      </Section>

      {/* Submit */}
      <div className="flex gap-3 justify-end pt-2">
        <a
          href="/"
          className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition"
        >
          ยกเลิก
        </a>
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 active:bg-orange-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition shadow-sm"
        >
          {pending ? "กำลังบันทึก…" : "ยืนยันการจอง"}
        </button>
      </div>
    </form>
  );
}
