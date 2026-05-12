"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useRef, useState, type WheelEvent } from "react";
import { createBooking, type BookingState } from "./actions";
import { Select } from "@/components/Select";
import { Label, FieldError, Card, BtnPrimary, BtnGhost, inputCls } from "@/components/ui";
import { formatIsoDateTimeBangkok } from "@/lib/date-display";
import type { Location, ConcreteWork, MixedCode, WBSCode, ABCCode, Client } from "@/lib/supabase/queries";

type RequesterPreview = {
  fullName: string;
  phone: string | null;
};

type Props = {
  clients: Client[];
  /** client_id จาก profiles — ตั้งเป็นค่าเริ่มต้นเมื่อมีในรายการ Client */
  defaultClientId: number | null;
  locations: Location[];
  concreteWorks: ConcreteWork[];
  mixedCodes: MixedCode[];
  wbsCodes: WBSCode[];
  abcCodes: ABCCode[];
  /** mixcode_id → ปริมาตรที่ใช้ไปแล้วจากคำขอก่อนหน้า */
  volumeUsedByMixcode: Record<number, number>;
  defaultCastingDate: string;
  /** ข้อมูลผู้ขอจาก profiles (ล็อกอินแล้วเท่านั้น) — null ถ้ายังไม่เข้าสู่ระบบ */
  requester: RequesterPreview | null;
};

const initialState: BookingState = {};

/** ป้องกันเลื่อนล้อเมาส์แล้วค่าใน input number เปลี่ยนโดยไม่ตั้งใจ */
function blurNumberInputOnWheel(e: WheelEvent<HTMLInputElement>) {
  e.currentTarget.blur();
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">{title}</p>
      </div>
      <div className="px-4 py-4 space-y-4">{children}</div>
    </Card>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function parseStructureList(s: string | null | undefined): string[] {
  if (!s?.trim()) return [];
  return s.split(/[,，]/).map((x) => x.trim()).filter(Boolean);
}

function norm(s: string) {
  return s.trim().toLowerCase();
}

function buildMixedStructureTokenSet(mixedCodes: MixedCode[]): Set<string> {
  const set = new Set<string>();
  for (const m of mixedCodes) {
    for (const t of parseStructureList(m.structure_list)) {
      set.add(norm(t));
    }
  }
  return set;
}

function filterConcreteWorksByMixed(concreteWorks: ConcreteWork[], mixedCodes: MixedCode[]): ConcreteWork[] {
  const tokenSet = buildMixedStructureTokenSet(mixedCodes);
  return concreteWorks.filter((cw) =>
    parseStructureList(cw.structure_list).some((t) => tokenSet.has(norm(t))),
  );
}

/** dropdown โครงสร้างจากข้อความใน structure_list ของงานคอนกรีต (แยกด้วย comma) */
function structureTextOptionsFromCw(cw: ConcreteWork | null): { value: string; label: string }[] {
  if (!cw) return [];
  return parseStructureList(cw.structure_list).map((label) => ({ value: label, label }));
}

function mixedCodesForStructureLabel(label: string | null, mixedCodes: MixedCode[]): MixedCode[] {
  if (!label?.trim()) return [];
  const n = norm(label);
  return mixedCodes.filter((m) =>
    parseStructureList(m.structure_list).some((t) => norm(t) === n),
  );
}

function uniqueSortedStrengths(rows: MixedCode[]): number[] {
  const s = new Set<number>();
  for (const r of rows) {
    if (r.strength != null && !Number.isNaN(Number(r.strength))) s.add(Number(r.strength));
  }
  return [...s].sort((a, b) => a - b);
}

function uniqueSortedSuppliers(rows: MixedCode[]): string[] {
  const s = new Set<string>();
  for (const r of rows) {
    const sup = r.supplier?.trim();
    if (sup) s.add(sup);
  }
  return [...s].sort((a, b) => a.localeCompare(b, "th"));
}

export default function BookingForm({
  clients,
  defaultClientId,
  locations,
  concreteWorks,
  mixedCodes,
  wbsCodes,
  abcCodes,
  volumeUsedByMixcode,
  defaultCastingDate,
  requester,
}: Props) {
  const [state, action, pending] = useActionState(createBooking, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [requestedAt] = useState(() => new Date());

  const [concreteWorkId, setConcreteWorkId] = useState("");
  const [structurePick, setStructurePick] = useState("");
  const [strengthPick, setStrengthPick] = useState("");
  const [supplierPick, setSupplierPick] = useState("");
  const [mixcodeId, setMixcodeId] = useState("");

  const eligibleConcreteWorks = useMemo(
    () => filterConcreteWorksByMixed(concreteWorks, mixedCodes),
    [concreteWorks, mixedCodes],
  );

  const selectedCw = useMemo(
    () => eligibleConcreteWorks.find((c) => String(c.id) === concreteWorkId) ?? null,
    [eligibleConcreteWorks, concreteWorkId],
  );

  const structureOptions = useMemo(() => structureTextOptionsFromCw(selectedCw), [selectedCw]);

  const mixedForStructure = useMemo(
    () => mixedCodesForStructureLabel(structurePick, mixedCodes),
    [structurePick, mixedCodes],
  );

  const strengthOptions = useMemo(() => uniqueSortedStrengths(mixedForStructure), [mixedForStructure]);

  const rowsForStrength = useMemo(() => {
    if (!strengthPick) return [];
    const sn = Number(strengthPick);
    if (Number.isNaN(sn)) return [];
    return mixedForStructure.filter((m) => m.strength != null && Number(m.strength) === sn);
  }, [mixedForStructure, strengthPick]);

  const supplierOptions = useMemo(() => uniqueSortedSuppliers(rowsForStrength), [rowsForStrength]);

  const rowsForSupplier = useMemo(() => {
    if (!supplierPick) return rowsForStrength;
    return rowsForStrength.filter((m) => (m.supplier ?? "").trim() === supplierPick);
  }, [rowsForStrength, supplierPick]);

  const mixOptions = useMemo(
    () =>
      rowsForSupplier.map((m) => ({
        value: String(m.id),
        label: [m.mixcode, m.strength ? `${m.strength} ${m.strength_type ?? "ksc"}` : null, m.slump ? `Slump ${m.slump}` : null]
          .filter(Boolean)
          .join(" · "),
      })),
    [rowsForSupplier],
  );

  const selectedMix = useMemo(
    () => mixedCodes.find((m) => String(m.id) === mixcodeId) ?? null,
    [mixedCodes, mixcodeId],
  );

  const remainingM3 = useMemo(() => {
    if (!selectedMix?.id) return null;
    const qty = selectedMix.qty;
    if (qty == null) return null;
    const used = volumeUsedByMixcode[selectedMix.id] ?? 0;
    return qty - used;
  }, [selectedMix, volumeUsedByMixcode]);

  const cascadeBlocked =
    Boolean(concreteWorkId && structureOptions.length === 0) ||
    Boolean(structurePick && strengthOptions.length === 0) ||
    Boolean(structurePick && strengthOptions.length > 0 && !strengthPick) ||
    Boolean(strengthPick && supplierOptions.length === 0) ||
    Boolean(strengthPick && supplierOptions.length > 0 && !supplierPick) ||
    Boolean(supplierPick && mixOptions.length === 0) ||
    Boolean(supplierPick && mixOptions.length > 0 && !mixcodeId);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setConcreteWorkId("");
      setStructurePick("");
      setStrengthPick("");
      setSupplierPick("");
      setMixcodeId("");
    }
  }, [state.success]);

  useEffect(() => {
    setStructurePick("");
    setStrengthPick("");
    setSupplierPick("");
    setMixcodeId("");
  }, [concreteWorkId]);

  useEffect(() => {
    setStrengthPick("");
    setSupplierPick("");
    setMixcodeId("");
  }, [structurePick]);

  useEffect(() => {
    setSupplierPick("");
    setMixcodeId("");
  }, [strengthPick]);

  useEffect(() => {
    setMixcodeId("");
  }, [supplierPick]);

  const err = state.fieldErrors ?? {};

  const requestDisplay = useMemo(() => formatIsoDateTimeBangkok(requestedAt), [requestedAt]);

  const clientSelectOptions = useMemo(
    () => clients.map((c) => ({ value: String(c.id), label: c.client_name ?? "" })),
    [clients],
  );

  const clientSelectKey = useMemo(() => {
    const ids = [...clients].map((c) => c.id).sort((a, b) => a - b);
    return `client-${defaultClientId ?? "none"}-${ids.join(",")}`;
  }, [clients, defaultClientId]);

  return (
    <form ref={formRef} action={action} className="space-y-3">
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-xs">{state.error}</div>
      )}

      <Section title="ข้อมูลการขอ">
        <div>
          <Label>วันที่ขอ</Label>
          <input type="text" readOnly className={`${inputCls} bg-zinc-50 text-zinc-600 cursor-not-allowed`} value={requestDisplay} />
          <p className="mt-1 text-[10px] text-zinc-400">บันทึกเป็นวันเวลาจริงตอนส่งฟอร์ม (แก้ไขไม่ได้)</p>
        </div>
        <div className="pt-1 border-t border-zinc-100">
          <Label>ผู้ขอ</Label>
          {requester == null ? (
            <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
              กรุณา{" "}
              <Link href="/" className="text-orange-600 font-medium hover:underline">
                เข้าสู่ระบบ
              </Link>{" "}
              เพื่อแสดงชื่อและเบอร์โทรจากโปรไฟล์ — ข้อมูลนี้แก้ไขในฟอร์มไม่ได้
            </p>
          ) : (
            <Row>
              <div>
                <Label>ชื่อ-นามสกุล</Label>
                <input
                  type="text"
                  readOnly
                  tabIndex={-1}
                  className={`${inputCls} bg-zinc-50 text-zinc-600 cursor-not-allowed`}
                  value={requester.fullName}
                />
              </div>
              <div>
                <Label>เบอร์โทร</Label>
                <input
                  type="text"
                  readOnly
                  tabIndex={-1}
                  className={`${inputCls} bg-zinc-50 text-zinc-600 cursor-not-allowed`}
                  value={requester.phone ?? "—"}
                />
              </div>
            </Row>
          )}
          <p className="mt-1.5 text-[10px] text-zinc-400">ดึงจากโปรไฟล์ผู้ใช้ที่ล็อกอิน (อ่านอย่างเดียว)</p>
        </div>
        <Row>
          <div>
            <Label required>วันที่เทคอนกรีต</Label>
            <input type="date" name="casting_date" className={inputCls} defaultValue={defaultCastingDate} required />
          </div>
          <div>
            <Label>เวลาเทคอนกรีต</Label>
            <input type="time" name="casting_time" className={inputCls} defaultValue="09:00" />
          </div>
        </Row>
      </Section>

      <Section title="ABC Code & WBS Code">
        <div>
          <Label>ABC Code</Label>
          <Select
            name="abc_code_id"
            placeholder="— เลือก ABC Code —"
            options={abcCodes.map((a) => ({
              value: String(a.id),
              label: `${a.full_abc ?? ""}${a.description ? ` — ${a.description}` : ""}`,
            }))}
          />
        </div>
        <div>
          <Label>WBS Code</Label>
          <Select
            name="wbs_code_id"
            placeholder="— เลือก WBS Code —"
            options={wbsCodes.map((w) => ({
              value: String(w.id),
              label: `${w.full_wbs ?? ""}${w.description ? ` — ${w.description}` : ""}`,
            }))}
          />
        </div>
      </Section>

      <Section title="รายละเอียดการจอง">
        <div>
          <Label required>ผู้รับเหมา</Label>
          <Select
            key={clientSelectKey}
            name="client_id"
            placeholder="— เลือกผู้รับเหมา —"
            required
            defaultValue={defaultClientId != null ? String(defaultClientId) : ""}
            options={clientSelectOptions}
          />
          <FieldError msg={err.client_id} />
        </div>
        <div>
          <Label required>ประเภทงานคอนกรีต</Label>
          <Select
            key={`cw-${eligibleConcreteWorks.map((c) => c.id).join(",")}`}
            name="concrete_work_id"
            placeholder="— เลือกประเภทงาน —"
            required
            options={eligibleConcreteWorks.map((cw) => ({
              value: String(cw.id),
              label: cw.concrete_work ?? `#${cw.id}`,
            }))}
            onValueChange={setConcreteWorkId}
          />
          <FieldError msg={err.concrete_work_id} />
        </div>
        <div>
          <Label required>โครงสร้าง</Label>
          {structureOptions.length === 0 ? (
            <p className="text-xs text-zinc-400 py-2">
              {selectedCw ? "ไม่มีรายการโครงสร้างใน structure_list ของงานนี้" : "เลือกประเภทงานคอนกรีตก่อน"}
            </p>
          ) : (
            <Select
              key={`st-${concreteWorkId}`}
              name="structure_pick"
              placeholder="— เลือกโครงสร้าง —"
              required
              options={structureOptions}
              onValueChange={setStructurePick}
            />
          )}
          <FieldError msg={err.structure_pick} />
        </div>
        <div>
          <Label required>สถานที่</Label>
          <Select
            name="location_id"
            placeholder="— เลือกสถานที่ —"
            required
            options={locations.map((l) => ({
              value: String(l.id),
              label: l.full_location ?? l.description ?? `#${l.id}`,
            }))}
          />
          <FieldError msg={err.location_id} />
        </div>
        <div>
          <Label>หมายเลขโครงสร้าง</Label>
          <input type="text" name="structure_no" className={inputCls} placeholder="เช่น COL-A1-01" />
        </div>
      </Section>

      <Section title="ข้อมูลคอนกรีต">
        <input type="hidden" name="strength" value={strengthPick} />
        <div>
          <Label required>กำลังคอนกรีต</Label>
          {structurePick ? (
            <Select
              key={`str-${structurePick}`}
              name="booking_strength_ui"
              placeholder="— เลือกกำลังอัด —"
              required
              options={strengthOptions.map((v) => ({ value: String(v), label: `${v} ksc` }))}
              onValueChange={setStrengthPick}
            />
          ) : (
            <p className="text-xs text-zinc-400 py-2">เลือกโครงสร้างก่อน</p>
          )}
        </div>
        <div>
          <Label required>Supplier</Label>
          {strengthPick ? (
            <Select
              key={`sup-${structurePick}-${strengthPick}`}
              name="booking_supplier_ui"
              placeholder="— เลือก Supplier —"
              required
              options={supplierOptions.map((s) => ({ value: s, label: s }))}
              onValueChange={setSupplierPick}
            />
          ) : (
            <p className="text-xs text-zinc-400 py-2">เลือกกำลังคอนกรีตก่อน</p>
          )}
        </div>
        <div>
          <Label required>Mix Code</Label>
          {supplierPick && mixOptions.length > 0 ? (
            <Select
              key={`mix-${structurePick}-${strengthPick}-${supplierPick}`}
              name="mixcode_id"
              placeholder="— เลือก Mix Code —"
              required
              options={mixOptions}
              onValueChange={setMixcodeId}
            />
          ) : (
            <p className="text-xs text-zinc-400 py-2">
              {supplierPick ? "ไม่พบ Mix Code ที่ตรงกับเงื่อนไข" : "เลือก Supplier ก่อน"}
            </p>
          )}
          <FieldError msg={err.mixcode_id} />
        </div>
        <div>
          <Label>Slump</Label>
          <input
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputCls} bg-zinc-50 text-zinc-600 cursor-not-allowed`}
            value={selectedMix?.slump?.trim() ? selectedMix.slump : "—"}
          />
          <p className="mt-1 text-[10px] text-zinc-400 leading-relaxed">
            ค่านี้มาจากข้อมูล Mix Code ที่เลือก ไม่ได้พิมพ์ในฟอร์มจอง
          </p>
        </div>
        <div>
          <Label>ยอดคงเหลือของ Mix Code (m³)</Label>
          <input
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputCls} bg-zinc-50 text-zinc-600 cursor-not-allowed`}
            value={
              selectedMix == null
                ? "—"
                : remainingM3 == null
                  ? "ไม่ได้กำหนด qty ใน Mixed Code"
                  : `${remainingM3.toFixed(2)} (qty รวม ${selectedMix.qty ?? "—"} − ใช้ไปแล้ว ${volumeUsedByMixcode[selectedMix.id] ?? 0})`
            }
          />
        </div>
        <Row>
          <div>
            <Label>ปริมาณตามแบบ (m³)</Label>
            <input
              type="number"
              name="volume_dwg"
              min="0"
              step="0.01"
              className={inputCls}
              placeholder="0.00"
              onWheel={blurNumberInputOnWheel}
            />
            <FieldError msg={err.volume_dwg} />
          </div>
          <div>
            <Label required>ปริมาณที่ขอ (m³)</Label>
            <input
              type="number"
              name="volume_request"
              min="0.01"
              step="0.01"
              className={inputCls}
              placeholder="0.00"
              required
              onWheel={blurNumberInputOnWheel}
            />
            <p className="mt-1 text-[10px] text-zinc-400">อย่าเลื่อนล้อเมาส์บนช่องนี้ขณะโฟกัส — เบราว์เซอร์อาจลด/เพิ่มทีละ 0.01 โดยไม่ตั้งใจ</p>
            <FieldError msg={err.volume_request} />
          </div>
        </Row>
        <div>
          <Label>จำนวนตัวอย่าง (ก้อน)</Label>
          <input type="number" name="sample_qty" min="0" step="1" className={inputCls} defaultValue={9} onWheel={blurNumberInputOnWheel} />
          <p className="mt-1 text-[10px] text-zinc-400 leading-relaxed">
            บันทึกเฉพาะจำนวนก้อน — ข้อความในวงเล็บเช่น Cylinder เป็นค่าจาก Mix Code ที่หน้ารายละเอียดจะแสดงตามนั้น
          </p>
          <FieldError msg={err.sample_qty} />
        </div>
      </Section>

      <Section title="หมายเหตุ">
        <div>
          <Label>หมายเหตุเพิ่มเติม</Label>
          <textarea name="remarks" rows={3} className={`${inputCls} resize-none`} placeholder="ระบุรายละเอียดเพิ่มเติม..." />
        </div>
      </Section>

      <div className="flex gap-2 justify-end pt-1 pb-4">
        <BtnGhost href="/dashboard">ยกเลิก</BtnGhost>
        <BtnPrimary type="submit" disabled={pending || cascadeBlocked || requester == null}>
          {pending ? "กำลังบันทึก…" : "ยืนยันการจอง"}
        </BtnPrimary>
      </div>
    </form>
  );
}
