import { Pulse } from "@/components/route-loading";

function SectionSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-900/[0.03]">
      <div className="border-b border-zinc-100 bg-zinc-50 px-4 py-3">
        <Pulse className="h-3 w-40" />
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Pulse className="h-2.5 w-16" />
            <Pulse className="h-4 w-full max-w-[12rem]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main className="min-h-screen bg-zinc-50" role="status" aria-label="กำลังโหลดรายละเอียดคำขอ">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Pulse className="h-8 w-8 shrink-0 rounded-lg" />
          <div className="flex-1 min-w-0 space-y-2 py-0.5">
            <Pulse className="h-4 w-[85%] max-w-md" />
            <Pulse className="h-3 w-40" />
          </div>
          <Pulse className="h-7 w-24 shrink-0 rounded-full" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-3">
        <SectionSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm shadow-zinc-900/[0.03]">
          <Pulse className="h-3 w-24 mb-3" />
          <Pulse className="h-16 w-full" />
        </div>
      </div>
    </main>
  );
}
