"use client";

import Link from "next/link";

const TABS = [
  { id: "home",        label: "รายการคำขอ", href: "/" },
  { id: "mixed-codes", label: "Mixed Code",  href: "/mixed-codes" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function TabNav({ active }: { active: TabId }) {
  return (
    <div className="bg-white border-b border-zinc-100 sticky top-14 z-10">
      <div className="max-w-screen-2xl mx-auto px-4 flex gap-1">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={[
                "relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                isActive
                  ? "text-orange-500 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-orange-500 after:rounded-t-full"
                  : "text-zinc-400 hover:text-zinc-600",
              ].join(" ")}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
