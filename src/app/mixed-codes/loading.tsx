import {
  BottomNavReserve,
  BottomNavSkeleton,
  Pulse,
  TabNavSkeleton,
} from "@/components/route-loading";

export default function Loading() {
  return (
    <main className="min-h-screen bg-zinc-50" role="status" aria-label="กำลังโหลด Mixed Code">
      <header className="sticky top-0 z-20 border-b border-zinc-100 bg-white/90 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <Pulse className="h-8 w-32 max-w-[50%]" />
          <Pulse className="h-9 w-28 shrink-0 rounded-xl" />
        </div>
      </header>

      <TabNavSkeleton />

      <div className="max-w-screen-2xl mx-auto px-4 py-5 space-y-4">
        <div className="flex items-center gap-2">
          <Pulse className="h-3 w-24" />
          <Pulse className="h-3 w-16" />
        </div>

        <div className="md:hidden space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4">
              <div className="flex justify-between gap-2">
                <Pulse className="h-5 w-28" />
                <Pulse className="h-8 w-20 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Pulse className="h-3 w-full" />
                <Pulse className="h-3 w-full" />
                <Pulse className="h-3 w-full" />
                <Pulse className="h-3 w-full" />
              </div>
              <Pulse className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="flex gap-0 border-b border-zinc-200 bg-zinc-50 px-2 py-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Pulse key={i} className="mx-2 h-3 flex-1 min-w-[3rem]" />
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, row) => (
            <div key={row} className="flex items-center gap-0 border-b border-zinc-100 py-3">
              {Array.from({ length: 9 }).map((_, col) => (
                <Pulse key={col} className="mx-2 h-3 flex-1 min-w-[2.5rem]" />
              ))}
            </div>
          ))}
        </div>
      </div>

      <BottomNavReserve />
      <BottomNavSkeleton />
    </main>
  );
}
