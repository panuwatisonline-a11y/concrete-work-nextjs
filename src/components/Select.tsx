"use client";

import { useState, useRef, useEffect, useId, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

export type SelectOption = { value: string; label: string };

export function Select({
  name,
  options,
  placeholder = "— เลือก —",
  required,
  defaultValue = "",
  onValueChange,
}: {
  name: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [selected, setSelected] = useState<SelectOption | null>(
    () => options.find((o) => o.value === defaultValue) ?? null
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useLayoutEffect(() => {
    if (!open || !containerRef.current) {
      setMenuPos(null);
      return;
    }
    const update = () => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setMenuPos({ top: r.bottom + 4, left: r.left, width: r.width });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      const t = e.target as Node;
      if (containerRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const menu =
    open &&
    menuPos &&
    createPortal(
      <div
        ref={menuRef}
        style={{ position: "fixed", top: menuPos.top, left: menuPos.left, width: menuPos.width }}
        className="z-[100] bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden"
        role="listbox"
        aria-labelledby={id}
      >
        <div className="max-h-56 overflow-y-auto overscroll-contain py-1">
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setOpen(false);
              onValueChange?.("");
            }}
            className={`w-full text-left px-3 py-2 text-xs transition-colors ${!selected ? "text-orange-500 bg-orange-50" : "text-zinc-400 hover:bg-zinc-50"}`}
          >
            {placeholder}
          </button>
          <div className="h-px bg-zinc-100 mx-2 my-1" />
          {options.map((opt) => {
            const sel = selected?.value === opt.value;
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => {
                  setSelected(opt);
                  setOpen(false);
                  onValueChange?.(opt.value);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between gap-2 transition-colors ${sel ? "text-orange-500 bg-orange-50" : "text-zinc-700 hover:bg-zinc-50"}`}
              >
                <span className="truncate">{opt.label}</span>
                {sel && (
                  <svg className="w-3.5 h-3.5 shrink-0 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>,
      document.body
    );

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={selected?.value ?? ""} required={required} />

      <button
        type="button"
        id={id}
        onClick={() => setOpen((v) => !v)}
        className={[
          "w-full flex items-center justify-between gap-2 bg-white border rounded-lg pl-3 pr-2.5 py-2 text-sm text-left transition focus:outline-none focus:ring-2 focus:ring-zinc-100",
          open ? "border-zinc-400" : "border-zinc-200 hover:border-zinc-300",
          selected ? "text-zinc-900" : "text-zinc-300",
        ].join(" ")}
      >
        <span className="truncate text-xs">{selected?.label ?? placeholder}</span>
        <svg className={`w-3.5 h-3.5 shrink-0 text-zinc-400 transition-transform duration-150 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {menu}
    </div>
  );
}
