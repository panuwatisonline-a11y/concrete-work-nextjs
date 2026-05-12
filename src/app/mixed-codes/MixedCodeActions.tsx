"use client";

import Link from "next/link";
import type { MixedCode } from "@/lib/supabase/queries";

const addBtnCls =
  "inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-semibold px-3 py-2 rounded-lg transition";

export function AddMixedCodeButton() {
  return (
    <Link href="/mixed-codes/new" className={addBtnCls}>
      เพิ่ม Mix Code
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </Link>
  );
}

export function EditMixedCodeButton({ mc }: { mc: MixedCode }) {
  return (
    <Link
      href={`/mixed-codes/${mc.id}/edit`}
      className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-orange-500 hover:bg-orange-50 transition"
      title="แก้ไข"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110 16.414H8v-2a2 2 0 01.586-1.414z" />
      </svg>
    </Link>
  );
}
