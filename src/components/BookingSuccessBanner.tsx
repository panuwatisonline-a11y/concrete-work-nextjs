"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const SHOW_MS = 2000;
const EXIT_MS = 320;

/**
 * แสดงหลังจองสำเร็จ (หน้าแดชบอร์ดมี ?success=…) แล้วเลื่อนหายภายใน ~2 วินาที และลบ query ออกจาก URL
 */
export function BookingSuccessBanner() {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);
  const cleared = useRef(false);

  const finishDismiss = useCallback(() => {
    if (cleared.current) return;
    cleared.current = true;
    router.replace("/dashboard", { scroll: false });
  }, [router]);

  useEffect(() => {
    const t1 = window.setTimeout(() => setExiting(true), SHOW_MS);
    return () => window.clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (!exiting) return;
    const t2 = window.setTimeout(finishDismiss, EXIT_MS);
    return () => window.clearTimeout(t2);
  }, [exiting, finishDismiss]);

  return (
    <div
      className={[
        "transition-[opacity,transform] duration-300 ease-out motion-reduce:duration-0",
        exiting ? "opacity-0 -translate-y-2 pointer-events-none" : "opacity-100 translate-y-0",
      ].join(" ")}
    >
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 flex items-center gap-2.5 text-sm shadow-sm">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span className="font-medium leading-snug">จองสำเร็จ - รอตรวจสอบ</span>
      </div>
    </div>
  );
}
