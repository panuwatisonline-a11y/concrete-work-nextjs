"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { createMixedCode, updateMixedCode, type MixedCodeState } from "./actions";
import type { MixedCode, Structure } from "@/lib/supabase/queries";
import { MultiSelect } from "@/components/MultiSelect";
import { inputCls, FieldError } from "@/components/ui";

type Props = {
  mode: "create" | "edit";
  initial?: MixedCode;
  structures: Structure[];
  onClose: () => void;
};

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required,
  error,
  rows,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  required?: boolean;
  error?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[--text-muted] mb-1">
        {label}
        {required && <span className="ml-1 text-[--accent]">*</span>}
      </label>
      {rows ? (
        <textarea
          name={name}
          defaultValue={defaultValue ?? ""}
          placeholder={placeholder}
          rows={rows}
          className={inputCls}
        />
      ) : (
        <input
          name={name}
          type={type}
          step={type === "number" ? "any" : undefined}
          defaultValue={defaultValue ?? ""}
          placeholder={placeholder}
          className={inputCls}
        />
      )}
      <FieldError msg={error} />
    </div>
  );
}

export default function MixedCodeForm({ mode, initial, structures, onClose }: Props) {
  const action = mode === "create" ? createMixedCode : updateMixedCode;
  const [state, formAction, pending] = useActionState<MixedCodeState, FormData>(action, {});
  const overlayRef = useRef<HTMLDivElement>(null);
  const formId = useId();

  useEffect(() => {
    if (state.success) onClose();
  }, [state.success, onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-[--surface] border border-[--border] rounded-[--radius-lg] shadow-xl w-full max-w-md flex flex-col" style={{ maxHeight: "90dvh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[--border-subtle]">
          <h2 className="text-sm font-semibold text-[--text]">
            {mode === "create" ? "เพิ่ม Mix Code" : "แก้ไข Mix Code"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[--text-faint] hover:text-[--text-muted] transition p-1 rounded-[--radius-sm] hover:bg-[--border-subtle]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form id={formId} action={formAction} className="px-5 py-4 space-y-3 overflow-y-auto flex-1">
          {mode === "edit" && <input type="hidden" name="id" value={initial?.id} />}

          {state.error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-[--radius-sm] px-3 py-2">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Field
                label="Mix Code"
                name="mixcode"
                defaultValue={initial?.mixcode}
                placeholder="เช่น M250-S7.5-P"
                required
                error={state.fieldErrors?.mixcode}
              />
            </div>

            <Field
              label="Supplier"
              name="supplier"
              defaultValue={initial?.supplier}
              placeholder="ผู้จำหน่าย"
            />

            <Field
              label="ปริมาณ (m³)"
              name="qty"
              type="number"
              defaultValue={initial?.qty ?? ""}
              placeholder="0"
            />

            <Field
              label="กำลัง"
              name="strength"
              type="number"
              defaultValue={initial?.strength ?? ""}
              placeholder="เช่น 240"
            />

            <Field
              label="หน่วยกำลัง"
              name="strength_type"
              defaultValue={initial?.strength_type}
              placeholder="เช่น ksc, MPa"
            />

            <Field
              label="Slump"
              name="slump"
              defaultValue={initial?.slump}
              placeholder="เช่น 7.5-15 cm"
            />

            <Field
              label="ประเภทตัวอย่าง"
              name="sample_type"
              defaultValue={initial?.sample_type}
              placeholder="เช่น Cube, Cylinder"
            />

            <div className="col-span-2">
              <label className="block text-xs font-medium text-[--text-muted] mb-1">
                รายการโครงสร้าง
              </label>
              <MultiSelect
                name="structure_list"
                options={structures.map((s) => ({
                  value: String(s.id),
                  label: s.structure_name ?? "",
                }))}
                defaultValue={initial?.structure_list ?? ""}
                placeholder="-- เลือกโครงสร้าง --"
                title="For Structure"
              />
            </div>
          </div>

        </form>

        {/* Sticky footer buttons */}
        <div className="px-5 pb-5 pt-3 border-t border-[--border-subtle] flex gap-2 bg-[--surface] rounded-b-[--radius-lg]">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-xs font-medium text-[--text-2] bg-[--border-subtle] hover:bg-[--border] rounded-[--radius-sm] transition">
            ยกเลิก
          </button>
          <button form={formId} type="submit" disabled={pending} className="flex-1 px-4 py-2 text-xs font-semibold text-white bg-[--accent] hover:opacity-90 disabled:opacity-50 rounded-[--radius-sm] transition">
            {pending ? "กำลังบันทึก..." : mode === "create" ? "เพิ่ม Mix Code" : "บันทึกการแก้ไข"}
          </button>
        </div>
      </div>
    </div>
  );
}
