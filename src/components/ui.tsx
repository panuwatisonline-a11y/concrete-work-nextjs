import Link from "next/link";
import type { ReactNode } from "react";

/* ── Shared input class ──────────────────────────────────────────── */
export const inputCls =
  "w-full bg-white border border-zinc-200 text-zinc-900 rounded-lg px-3 py-2 text-sm " +
  "focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 " +
  "transition placeholder-zinc-300 disabled:opacity-40";

/* ── Label / FieldError ──────────────────────────────────────────── */
export function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-medium text-zinc-500 mb-1.5">
      {children}
      {required && <span className="ml-0.5 text-orange-500">*</span>}
    </label>
  );
}

export function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-500">{msg}</p>;
}

/* ── Buttons ─────────────────────────────────────────────────────── */
type BtnProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
};

export function BtnPrimary({ children, href, onClick, type = "button", disabled, className = "" }: BtnProps) {
  const cls = `inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-semibold px-3 py-2 rounded-lg transition disabled:opacity-40 ${className}`;
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}

export function BtnGhost({ children, href, onClick, type = "button", disabled, className = "" }: BtnProps) {
  const cls = `inline-flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 active:scale-95 text-zinc-700 text-xs font-medium px-3 py-2 rounded-lg transition disabled:opacity-40 ${className}`;
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}

/* ── Card ────────────────────────────────────────────────────────── */
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-zinc-200 rounded-xl ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">{title}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

export function Section({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader title={title} />
      <div className="px-4 py-4">{children}</div>
    </Card>
  );
}

/* ── App Logo ────────────────────────────────────────────────────── */
export function AppLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 group min-w-0">
      <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
        C
      </div>
      <span className="text-sm font-semibold text-zinc-900 group-hover:text-orange-500 transition truncate">
        Concrete Works
      </span>
    </Link>
  );
}

/* ── Empty state ─────────────────────────────────────────────────── */
export function EmptyState({ message = "ไม่พบข้อมูล" }: { message?: string }) {
  return (
    <Card className="py-16 text-center">
      <p className="text-sm text-zinc-400">{message}</p>
    </Card>
  );
}

/* ── Icons ───────────────────────────────────────────────────────── */
export function PlusIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

export function ChevronLeftIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}
