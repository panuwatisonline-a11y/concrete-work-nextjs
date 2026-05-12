import {
  BottomNavReserve,
  BottomNavSkeleton,
  Pulse,
  TabNavSkeleton,
} from "@/components/route-loading";

export default function Loading() {
  return (
    <main className="min-h-screen bg-zinc-50" role="status" aria-label="กำลังโหลดแดชบอร์ด">
      <header className="sticky top-0 z-20 border-b border-zinc-100 bg-white/90 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <Pulse className="h-8 w-32 max-w-[45%]" />
          <Pulse className="h-9 w-[8.5rem] shrink-0 rounded-xl" />
        </div>
      </header>

      <TabNavSkeleton />

      <div className="max-w-screen-2xl mx-auto px-4 py-5 space-y-5">
        <div className="flex items-center justify-between">
          <Pulse className="h-3 w-28" />
          <Pulse className="h-4 w-20" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Pulse key={i} className="h-[3.35rem] w-full rounded-xl border border-zinc-200/60 bg-white" />
          ))}
        </div>
        <div className="flex items-center justify-between pt-1">
          <Pulse className="h-3 w-32" />
          <Pulse className="h-3 w-24" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Pulse key={i} className="h-[4.5rem] w-full rounded-xl border border-zinc-200/60 bg-white" />
          ))}
        </div>
      </div>

      <BottomNavReserve />
      <BottomNavSkeleton />
    </main>
  );
}
