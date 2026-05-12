"use client";

import { useEffect, useOptimistic } from "react";

/**
 * ตั้ง optimistic "กำลังบันทึก" ทันทีที่ส่งฟอร์ม (ก่อน pending จาก useActionState)
 * รีเซ็ตเมื่อ shouldReset เป็นจริง (เช่น มี error / fieldErrors จากเซิร์ฟเวอร์)
 */
export function useOptimisticSaving(shouldReset: boolean) {
  const [saving, setSaving] = useOptimistic(false, (_: boolean, next: boolean) => next);

  useEffect(() => {
    if (shouldReset) setSaving(false);
  }, [shouldReset, setSaving]);

  return [saving, setSaving] as const;
}
