import Link from "next/link";
import type { ReactNode } from "react";

/* ─── Typography helpers ──────────────────────────────────── */

export function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-medium text-[--text-muted] mb-1.5 tracking-wide">
      {children}
      {required && <span className="ml-1 text-[--accent]">*</span>}
    </label>
  );
}

export function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-500">{msg}</p>;
}

/* ─── Input / Textarea ────────────────────────────────────── */

export const inputCls =
  "w-full bg-[--surface] border border-[--border] text-[--text] rounded-[--radius-sm] px-3 py-2 text-sm focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition placeholder-[--text-faint] disabled:opacity-40";

/* ─── Buttons ─────────────────────────────────────────────── */

export function BtnPrimary({
  children,
  href,
  onClick,
  type = "button",
  disabled,
  className = "",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const cls = `inline-flex items-center gap-1.5 bg-[--accent] hover:opacity-90 active:scale-95 transition text-white text-xs font-semibold px-3 py-2 rounded-[--radius-sm] disabled:opacity-40 ${className}`;
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}

export function BtnGhost({
  children,
  onClick,
  type = "button",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 bg-[--border-subtle] hover:bg-[--border] active:scale-95 transition text-[--text-2] text-xs font-medium px-3 py-2 rounded-[--radius-sm] disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

/* ─── Card ────────────────────────────────────────────────── */

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-[--surface] border border-[--border] rounded-[--radius] ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[--border-subtle]">
      <p className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider">{title}</p>
      {action}
    </div>
  );
}

/* ─── Section (card with header) ──────────────────────────── */

export function Section({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader title={title} />
      <div className="px-4 py-4">
        {children}
      </div>
    </Card>
  );
}

/* ─── Page shell ──────────────────────────────────────────── */

export function PageContainer({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) {
  return (
    <div className={`${narrow ? "max-w-screen-md" : "max-w-screen-2xl"} mx-auto px-4 py-5 space-y-4`}>
      {children}
    </div>
  );
}

/* ─── App Header ──────────────────────────────────────────── */

export function AppLogo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 group">
      <div className="w-6 h-6 rounded-md bg-[--accent] flex items-center justify-center text-white font-bold text-[10px] shrink-0">
        C
      </div>
      <div className="hidden sm:block">
        <p className="text-sm font-semibold text-[--text] leading-none group-hover:text-[--accent] transition">
          Concrete Works
        </p>
      </div>
    </Link>
  );
}

/* ─── Empty state ─────────────────────────────────────────── */

export function EmptyState({ message = "ไม่พบข้อมูล" }: { message?: string }) {
  return (
    <Card className="py-16 text-center">
      <p className="text-sm text-[--text-faint]">{message}</p>
    </Card>
  );
}

/* ─── Back button ─────────────────────────────────────────── */

export function BackButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="w-8 h-8 flex items-center justify-center rounded-[--radius-sm] hover:bg-[--border-subtle] active:bg-[--border] transition shrink-0"
    >
      <svg className="w-4 h-4 text-[--text-muted]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </Link>
  );
}

/* ─── Plus icon ───────────────────────────────────────────── */

export function PlusIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}
