"use client";

import { useState, useCallback } from "react";
import MixedCodeForm from "./MixedCodeForm";
import type { MixedCode } from "@/lib/supabase/queries";

export function AddMixedCodeButton() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 active:scale-95 transition text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        เพิ่ม Mix Code
      </button>
      {open && <MixedCodeForm mode="create" onClose={close} />}
    </>
  );
}

export function EditMixedCodeButton({ mc }: { mc: MixedCode }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition"
        title="แก้ไข"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110 16.414H8v-2a2 2 0 01.586-1.414z" />
        </svg>
      </button>
      {open && <MixedCodeForm mode="edit" initial={mc} onClose={close} />}
    </>
  );
}
