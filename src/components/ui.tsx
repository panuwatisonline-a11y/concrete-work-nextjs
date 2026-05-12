import Link from "next/link";
import type { ReactNode } from "react";

/* ── Shared input class ──────────────────────────────────────────── */
export const inputCls =
  "w-full bg-white border border-zinc-200 text-zinc-900 rounded-lg px-3 py-2 text-sm " +
  "focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 " +
  "motion-safe:transition-[border-color,box-shadow,transform] motion-safe:duration-200 motion-safe:ease-out " +
  "placeholder-zinc-300 disabled:opacity-40";

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
  const cls = `inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.985] text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm shadow-orange-500/20 hover:shadow-md hover:shadow-orange-500/25 motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] disabled:opacity-40 ${className}`;
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}

export function BtnGhost({ children, href, onClick, type = "button", disabled, className = "" }: BtnProps) {
  const cls = `inline-flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 active:scale-[0.985] text-zinc-700 text-xs font-medium px-3 py-2 rounded-lg motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] disabled:opacity-40 ${className}`;
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}

/* ── Card ────────────────────────────────────────────────────────── */
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white border border-zinc-200 rounded-xl motion-safe:transition-[box-shadow,transform,border-color] motion-safe:duration-200 motion-safe:ease-out hover:shadow-md hover:shadow-zinc-900/[0.06] hover:border-zinc-200/80 ${className}`}
    >
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
    <Link href="/dashboard" className="flex items-center gap-2.5 group min-w-0 motion-safe:transition-opacity motion-safe:duration-200">
      <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm shadow-orange-500/30 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-active:scale-[0.97]">
        C
      </div>
      <span className="text-xl font-semibold text-zinc-900 group-hover:text-orange-500 motion-safe:transition-colors motion-safe:duration-200 truncate">
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

/** แสดงทันทีหลังกดส่ง (Optimistic UI) ก่อนเซิร์ฟเวอร์ตอบ */
export function OptimisticSavingBanner({ show, message }: { show: boolean; message: string }) {
  if (!show) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900 shadow-sm shadow-sky-900/5 flex items-center gap-2.5"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white" aria-hidden>
        <svg className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </span>
      <span className="font-medium leading-snug">{message}</span>
    </div>
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
