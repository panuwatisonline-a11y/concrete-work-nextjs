"use client";

import { useActionState, useEffect, useRef } from "react";
import { createMixedCode, updateMixedCode, type MixedCodeState } from "./actions";
import type { MixedCode } from "@/lib/supabase/queries";

type Props = {
  mode: "create" | "edit";
  initial?: MixedCode;
  onClose: () => void;
};

const inputCls =
  "w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition placeholder-gray-400";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-500">{msg}</p>;
}

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
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
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

export default function MixedCodeForm({ mode, initial, onClose }: Props) {
  const action = mode === "create" ? createMixedCode : updateMixedCode;
  const [state, formAction, pending] = useActionState<MixedCodeState, FormData>(action, {});
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.success) onClose();
  }, [state.success, onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">
            {mode === "create" ? "เพิ่ม Mix Code" : "แก้ไข Mix Code"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form action={formAction} className="px-5 py-4 space-y-3">
          {mode === "edit" && <input type="hidden" name="id" value={initial?.id} />}

          {state.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">
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
              <Field
                label="รายการโครงสร้าง"
                name="structure_list"
                defaultValue={initial?.structure_list}
                placeholder="โครงสร้างที่ใช้งาน"
                rows={2}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 px-4 py-2.5 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-lg transition"
            >
              {pending ? "กำลังบันทึก..." : mode === "create" ? "เพิ่ม Mix Code" : "บันทึกการแก้ไข"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
