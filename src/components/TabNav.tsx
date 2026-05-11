"use client";

import Link from "next/link";

const TABS = [
  { id: "home", label: "รายการคำขอ", href: "/" },
  { id: "mixed-codes", label: "Mixed Code", href: "/mixed-codes" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function TabNav({ active }: { active: TabId }) {
  return (
    <nav className="max-w-screen-2xl mx-auto px-4 flex gap-1 overflow-x-auto">
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={[
              "relative shrink-0 px-4 py-2.5 text-xs font-medium transition-colors",
              isActive
                ? "text-orange-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500 after:rounded-t"
                : "text-gray-500 hover:text-gray-800",
            ].join(" ")}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
