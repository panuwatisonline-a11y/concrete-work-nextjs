"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_TABS } from "@/config/nav-tabs";

const ICONS: Record<(typeof NAV_TABS)[number]["id"], ReactNode> = {
  home: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  "mixed-codes": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  profile: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
};

function tabIsActive(tabId: (typeof NAV_TABS)[number]["id"], href: string, pathname: string) {
  if (pathname === href) return true;
  if (tabId === "home" && pathname.startsWith("/requests")) return true;
  if (tabId === "mixed-codes" && pathname.startsWith("/mixed-codes")) return true;
  return false;
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 md:hidden pointer-events-none p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      aria-label="เมนูหลัก"
    >
      <div className="pointer-events-auto mx-auto flex max-w-lg gap-0.5 rounded-2xl border border-zinc-200 bg-white p-1 shadow-lg shadow-zinc-900/10 motion-safe:transition-shadow motion-safe:duration-300">
        {NAV_TABS.map((tab) => {
          const isActive = tabIsActive(tab.id, tab.href, pathname);
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={[
                "relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-2.5 motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.975]",
                isActive ? "bg-orange-50 text-orange-600 shadow-sm shadow-orange-500/10" : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600",
              ].join(" ")}
            >
              {ICONS[tab.id]}
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
