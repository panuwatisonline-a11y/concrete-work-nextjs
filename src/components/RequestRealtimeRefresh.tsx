"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/readonly";

const CHANNEL_NAME = "request-changes";
const DEBOUNCE_MS = 450;

/**
 * สมัครรับ Postgres Realtime บนตาราง `public.Request` แล้วเรียก `router.refresh()`
 * เพื่อให้ Server Components ดึงข้อมูลใหม่โดยไม่รีโหลดทั้งหน้า
 *
 * ใส่ครั้งเดียวใน `app/layout.tsx` — ทุก route รวมเพจใหม่จะได้พฤติกรรมนี้โดยอัตโนมัติ
 * (ภายในมี `getSession()` จึงสมัคร channel จริงเฉพาะเมื่อผู้ใช้ล็อกอิน)
 *
 * ต้องเปิด Realtime ให้ตาราง Request ในโปรเจกต์ Supabase (Replication)
 * และ RLS ต้องอนุญาตให้ผู้ใช้ที่ล็อกอินรับเหตุการณ์ตามนโยบายของคุณ
 */
export default function RequestRealtimeRefresh() {
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    let cancelled = false;

    const scheduleRefresh = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        router.refresh();
      }, DEBOUNCE_MS);
    };

    void (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled || !session) return;

      const ch = supabase
        .channel(CHANNEL_NAME)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "Request" },
          () => {
            scheduleRefresh();
          },
        )
        .subscribe();

      channelRef.current = ch;
      if (cancelled) {
        await supabase.removeChannel(ch);
        channelRef.current = null;
      }
    })();

    return () => {
      cancelled = true;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      const ch = channelRef.current;
      if (ch) {
        void supabase.removeChannel(ch);
        channelRef.current = null;
      }
    };
  }, [router]);

  return null;
}
