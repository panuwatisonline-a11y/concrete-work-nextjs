/** บล็อก skeleton ใช้ร่วมในแต่ละไฟล์ loading ภายใต้ app/ */
export function Pulse({ className = "" }: { className?: string }) {
  return <div className={`rounded bg-zinc-200/90 motion-safe:animate-pulse ${className}`.trim()} />;
}

/** จำลอง TabNav เดสก์ท็อป (dashboard / profile / mixed-codes) */
export function TabNavSkeleton() {
  return (
    <div className="hidden md:flex justify-center sticky top-14 z-10 px-4 pt-2 pb-3 pointer-events-none">
      <div className="pointer-events-none inline-flex items-center gap-0.5 rounded-2xl border border-zinc-200/90 bg-white p-1 shadow-md shadow-zinc-900/5">
        <Pulse className="h-9 w-[4.5rem] rounded-xl" />
        <Pulse className="h-9 w-[6.25rem] rounded-xl" />
        <Pulse className="h-9 w-[5rem] rounded-xl" />
      </div>
    </div>
  );
}

/** พื้นที่ว่างด้านล่างให้สอดคล้องกับ BottomNav บนมือถือ */
export function BottomNavReserve() {
  return <div className="pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] md:pb-5" />;
}

/** แถบนำทางล่างบนมือถือ (จำลอง BottomNav) */
export function BottomNavSkeleton() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 md:hidden pointer-events-none p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      aria-hidden
    >
      <div className="pointer-events-none mx-auto flex max-w-md items-center justify-around rounded-2xl border border-zinc-200/90 bg-white p-2 shadow-lg shadow-zinc-900/10">
        <Pulse className="h-10 w-14 rounded-xl" />
        <Pulse className="h-10 w-14 rounded-xl" />
        <Pulse className="h-10 w-14 rounded-xl" />
      </div>
    </nav>
  );
}
