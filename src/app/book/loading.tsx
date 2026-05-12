import { Pulse } from "@/components/route-loading";

export default function Loading() {
  return (
    <main className="min-h-screen bg-zinc-50" role="status" aria-label="กำลังโหลดแบบฟอร์มจอง">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
        <div className="max-w-screen-md mx-auto px-4 h-14 flex items-center gap-3">
          <Pulse className="h-8 w-8 shrink-0 rounded-lg" />
          <Pulse className="h-8 w-28" />
          <span className="text-zinc-200 text-sm select-none" aria-hidden>
            /
          </span>
          <Pulse className="h-3 w-24" />
        </div>
      </header>

      <div className="max-w-screen-md mx-auto px-4 py-6 space-y-5">
        <div className="space-y-2">
          <Pulse className="h-5 w-48" />
          <Pulse className="h-3 w-64 max-w-full" />
        </div>

        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-900/[0.03]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Pulse className="h-3 w-24" />
              <Pulse className="h-10 w-full rounded-xl" />
            </div>
          ))}
          <Pulse className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </main>
  );
}
