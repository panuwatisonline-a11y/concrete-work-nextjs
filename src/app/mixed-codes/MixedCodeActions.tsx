"use client";

import { useState, useCallback } from "react";
import MixedCodeForm from "./MixedCodeForm";
import type { MixedCode, Structure } from "@/lib/supabase/queries";

export function AddMixedCodeButton({ structures }: { structures: Structure[] }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-semibold px-3 py-2 rounded-lg transition"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        เพิ่ม Mix Code
      </button>
      {open && <MixedCodeForm mode="create" structures={structures} onClose={close} />}
    </>
  );
}

export function MixedCodeFAB({ structures }: { structures: Structure[] }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-30 md:hidden w-14 h-14 bg-orange-500 hover:bg-orange-600 active:scale-95 rounded-full shadow-lg flex items-center justify-center text-white transition"
        aria-label="เพิ่ม Mix Code"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      {open && <MixedCodeForm mode="create" structures={structures} onClose={close} />}
    </>
  );
}

export function EditMixedCodeButton({ mc, structures }: { mc: MixedCode; structures: Structure[] }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-orange-500 hover:bg-orange-50 transition"
        title="แก้ไข"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110 16.414H8v-2a2 2 0 01.586-1.414z" />
        </svg>
      </button>
      {open && <MixedCodeForm mode="edit" initial={mc} structures={structures} onClose={close} />}
    </>
  );
}
