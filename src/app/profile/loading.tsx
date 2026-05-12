import {
  BottomNavReserve,
  BottomNavSkeleton,
  Pulse,
  TabNavSkeleton,
} from "@/components/route-loading";

export default function Loading() {
  return (
    <main className="min-h-screen bg-zinc-50" role="status" aria-label="กำลังโหลดโปรไฟล์">
      <header className="sticky top-0 z-20 border-b border-zinc-100 bg-white/90 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <Pulse className="h-8 w-32 max-w-[45%]" />
          <Pulse className="h-9 w-20 shrink-0 rounded-xl" />
        </div>
      </header>

      <TabNavSkeleton />

      <div className="max-w-screen-2xl mx-auto px-4 py-5 space-y-5">
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-900/[0.03]">
          <div className="border-b border-zinc-100 bg-zinc-50/80 px-4 py-3">
            <Pulse className="h-3 w-24" />
          </div>
          <div className="space-y-4 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Pulse className="h-10 w-full rounded-xl" />
              <Pulse className="h-10 w-full rounded-xl" />
              <Pulse className="h-10 w-full rounded-xl sm:col-span-2" />
            </div>
            <Pulse className="h-11 w-full max-w-xs rounded-xl" />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-900/[0.03]">
          <div className="border-b border-zinc-100 bg-zinc-50/80 px-4 py-3">
            <Pulse className="h-3 w-36" />
          </div>
          <div className="space-y-3 p-4">
            <Pulse className="h-10 w-full rounded-xl" />
            <Pulse className="h-10 w-full rounded-xl" />
            <Pulse className="h-11 w-full max-w-xs rounded-xl" />
          </div>
        </div>
      </div>

      <BottomNavReserve />
      <BottomNavSkeleton />
    </main>
  );
}
