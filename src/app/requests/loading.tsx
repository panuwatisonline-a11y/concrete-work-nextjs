import { Pulse } from "@/components/route-loading";

export default function Loading() {
  return (
    <main className="min-h-screen bg-zinc-50" role="status" aria-label="กำลังโหลดรายการตามสถานะ">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Pulse className="h-8 w-8 shrink-0 rounded-lg" />
          <Pulse className="h-8 w-32 max-w-[40%]" />
          <span className="text-zinc-200 select-none" aria-hidden>
            /
          </span>
          <Pulse className="h-7 w-36 max-w-[35%] rounded-full" />
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <Pulse className="h-3 w-20" />
          <Pulse className="h-3 w-24" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Pulse key={i} className="h-[4.25rem] w-full rounded-xl border border-zinc-200/60 bg-white" />
          ))}
        </div>
      </div>
    </main>
  );
}
