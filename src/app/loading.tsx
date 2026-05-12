import { Pulse } from "@/components/route-loading";

/** หน้า `/` — เข้าสู่ระบบ */
export default function Loading() {
  return (
    <main
      className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 py-12"
      role="status"
      aria-label="กำลังโหลด"
    >
      <Pulse className="h-9 w-36 mb-6" />
      <div className="w-full max-w-md space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-900/5">
        <Pulse className="h-4 w-2/3" />
        <Pulse className="h-10 w-full" />
        <Pulse className="h-10 w-full" />
        <Pulse className="h-11 w-full rounded-xl" />
      </div>
      <Pulse className="h-3 w-48 mx-auto mt-6" />
    </main>
  );
}
