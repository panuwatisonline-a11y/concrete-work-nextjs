"use client";

import Link from "next/link";
import { NAV_TABS, type NavTabId } from "@/config/nav-tabs";

export default function TabNav({ active }: { active: NavTabId }) {
  return (
    /* Desktop only — mobile uses BottomNav */
    <div className="hidden md:flex justify-center sticky top-14 z-10 px-4 pt-2 pb-3 pointer-events-none">
      <nav
        className="pointer-events-auto inline-flex items-center gap-0.5 rounded-2xl border border-zinc-200/90 bg-white p-1 shadow-md shadow-zinc-900/5 motion-safe:transition-shadow motion-safe:duration-300"
        aria-label="เมนูหลัก"
      >
        {NAV_TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={[
                "rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.982]",
                isActive ? "bg-orange-50 text-orange-600 shadow-sm shadow-orange-500/10" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700",
              ].join(" ")}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
