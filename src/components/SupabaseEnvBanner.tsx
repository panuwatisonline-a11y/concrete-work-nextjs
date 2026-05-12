import { isSupabaseConfigured } from "@/lib/supabase/readonly";

export default function SupabaseEnvBanner() {
  if (isSupabaseConfigured()) return null;

  return (
    <div
      role="status"
      className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-center text-sm text-amber-950"
    >
      <p className="font-medium">ยังไม่ได้ตั้งค่า Supabase</p>
      <p className="mt-1 text-xs text-amber-800/90 leading-relaxed max-w-xl mx-auto">
        คัดลอก <code className="rounded bg-amber-100/80 px-1 py-0.5 font-mono text-[11px]">.env.example</code>{" "}
        เป็น <code className="rounded bg-amber-100/80 px-1 py-0.5 font-mono text-[11px]">.env.local</code>{" "}
        แล้วใส่ <code className="font-mono text-[11px]">NEXT_PUBLIC_SUPABASE_URL</code> และ{" "}
        <code className="font-mono text-[11px]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> จาก Supabase → Project Settings → API
      </p>
    </div>
  );
}
