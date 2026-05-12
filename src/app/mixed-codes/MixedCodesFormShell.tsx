import Link from "next/link";
import { AppLogo } from "@/components/ui";
import type { ReactNode } from "react";

export function MixedCodesFormShell({
  badge,
  heading,
  hint,
  children,
}: {
  badge: string;
  heading: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-20">
        <div className="max-w-screen-md mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/mixed-codes" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-50 transition shrink-0">
            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <AppLogo />
          <span className="text-zinc-300 text-sm">/</span>
          <span className="text-xs font-medium text-orange-500 truncate">{badge}</span>
        </div>
      </header>

      <div className="max-w-screen-md mx-auto px-4 py-6 space-y-5">
        <div>
          <h1 className="text-base font-semibold text-zinc-900">{heading}</h1>
          {hint ? (
            <p className="text-xs text-zinc-400 mt-1">{hint}</p>
          ) : null}
        </div>
        {children}
      </div>
    </main>
  );
}
