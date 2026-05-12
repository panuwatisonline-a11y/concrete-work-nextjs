"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { createMixedCode, updateMixedCode, type MixedCodeState } from "./actions";
import type { MixedCode, Structure } from "@/lib/supabase/queries";
import { MultiSelect } from "@/components/MultiSelect";
import { Label, FieldError, Card, BtnPrimary, BtnGhost, inputCls, OptimisticSavingBanner } from "@/components/ui";
import { useOptimisticSaving } from "@/hooks/useOptimisticSaving";

type Props = { mode: "create" | "edit"; initial?: MixedCode; structures: Structure[] };

const initialState: MixedCodeState = {};

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

export default function MixedCodeForm({ mode, initial, structures }: Props) {
  const router = useRouter();
  const action = mode === "create" ? createMixedCode : updateMixedCode;
  const [state, formAction, pending] = useActionState(action, initialState);
  const err = state.fieldErrors ?? {};
  const hasFieldErrors = Boolean(state.fieldErrors && Object.keys(state.fieldErrors).length > 0);
  const [optimisticSaving, setOptimisticSaving] = useOptimisticSaving(
    Boolean(state.error) || hasFieldErrors || Boolean(state.success),
  );
  const showSavingUi = optimisticSaving || pending;

  useEffect(() => {
    if (!state.success) return;
    router.refresh();
    router.push("/mixed-codes");
  }, [state.success, router]);

  return (
    <form
      action={(formData) => {
        setOptimisticSaving(true);
        router.prefetch("/mixed-codes");
        formAction(formData);
      }}
      className="space-y-3"
      aria-busy={showSavingUi}
    >
      {mode === "edit" && <input type="hidden" name="id" value={initial?.id} />}

      <OptimisticSavingBanner
        show={showSavingUi}
        message={mode === "create" ? "กำลังเพิ่ม Mix Code…" : "กำลังบันทึกการแก้ไข…"}
      />

      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-xs">{state.error}</div>
      )}

      <Section title="รายละเอียด Mix Code">
        <div className="space-y-4">
          <div>
            <Label required>Mix Code</Label>
            <input name="mixcode" type="text" defaultValue={initial?.mixcode ?? ""} placeholder="เช่น M250-S7.5-P" className={inputCls} required />
            <FieldError msg={err.mixcode} />
          </div>
          <Row>
            <div>
              <Label>Supplier</Label>
              <input name="supplier" type="text" defaultValue={initial?.supplier ?? ""} placeholder="ผู้จำหน่าย" className={inputCls} />
            </div>
            <div>
              <Label>ปริมาณ (m³)</Label>
              <input name="qty" type="number" step="any" defaultValue={initial?.qty ?? ""} placeholder="0" className={inputCls} />
            </div>
          </Row>
          <Row>
            <div>
              <Label>กำลัง</Label>
              <input name="strength" type="number" step="any" defaultValue={initial?.strength ?? ""} placeholder="240" className={inputCls} />
            </div>
            <div>
              <Label>หน่วยกำลัง</Label>
              <input name="strength_type" type="text" defaultValue={initial?.strength_type ?? ""} placeholder="ksc / MPa" className={inputCls} />
            </div>
          </Row>
          <Row>
            <div>
              <Label>Slump</Label>
              <input name="slump" type="text" defaultValue={initial?.slump ?? ""} placeholder="7.5–15 cm" className={inputCls} />
            </div>
            <div>
              <Label>ประเภทตัวอย่าง</Label>
              <input name="sample_type" type="text" defaultValue={initial?.sample_type ?? ""} placeholder="Cube / Cylinder" className={inputCls} />
            </div>
          </Row>
          <div>
            <Label>รายการโครงสร้าง</Label>
            <MultiSelect
              name="structure_list"
              title="For Structure"
              options={structures.map((s) => ({ value: String(s.id), label: s.structure_name ?? "" }))}
              defaultValue={initial?.structure_list ?? ""}
              placeholder="— เลือกโครงสร้าง —"
            />
          </div>
        </div>
      </Section>

      <div className="flex gap-2 justify-end pt-1 pb-4">
        <BtnGhost href="/mixed-codes">ยกเลิก</BtnGhost>
        <BtnPrimary type="submit" disabled={showSavingUi}>
          {showSavingUi ? "กำลังบันทึก…" : mode === "create" ? "ยืนยันการเพิ่ม" : "บันทึก"}
        </BtnPrimary>
      </div>
    </form>
  );
}
