import { Pulse } from "@/components/route-loading";

/** ครอบ `auth/error`, `auth/update-password` */
export default function Loading() {
  return (
    <main
      className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 py-12"
      role="status"
      aria-label="กำลังโหลด"
    >
      <Pulse className="h-9 w-40 mb-6" />
      <div className="w-full max-w-md space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm shadow-zinc-900/5">
        <Pulse className="h-4 w-full max-w-xs mx-auto" />
        <Pulse className="h-4 w-full max-w-sm mx-auto" />
        <Pulse className="h-10 w-full max-w-xs mx-auto rounded-xl" />
      </div>
    </main>
  );
}
