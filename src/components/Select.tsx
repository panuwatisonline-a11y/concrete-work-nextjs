"use client";

import { useState, useRef, useEffect, useId } from "react";

export type SelectOption = { value: string; label: string };

interface SelectProps {
  name: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
}

export function Select({
  name,
  options,
  placeholder = "-- เลือก --",
  required,
  defaultValue = "",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SelectOption | null>(
    () => options.find((o) => o.value === defaultValue) ?? null
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const choose = (opt: SelectOption) => { setSelected(opt); setOpen(false); };

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={selected?.value ?? ""} required={required} />

      <button
        type="button"
        id={id}
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 bg-[--surface] border rounded-[6px] pl-3 pr-2.5 py-2 text-sm text-left transition focus:outline-none focus:ring-1 focus:ring-zinc-400
          ${open ? "border-zinc-400 ring-1 ring-zinc-400" : "border-[--border]"}
          ${!selected ? "text-[--text-faint]" : "text-[--text]"}`}
      >
        <span className="truncate text-xs">{selected?.label ?? placeholder}</span>
        <svg
          className={`w-3.5 h-3.5 shrink-0 text-[--text-faint] transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[--surface] border border-[--border] rounded-[--radius] shadow-sm overflow-hidden">
          <div className="max-h-56 overflow-y-auto overscroll-contain">
            <button
              type="button"
              onClick={() => { setSelected(null); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs transition-colors
                ${!selected ? "text-[--accent] bg-[--accent-bg]" : "text-[--text-faint] hover:bg-[--border-subtle]"}`}
            >
              {placeholder}
            </button>
            <div className="h-px bg-[--border-subtle] mx-2" />
            {options.map((opt) => {
              const isSelected = selected?.value === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => choose(opt)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between gap-2 transition-colors
                    ${isSelected ? "text-[--accent] bg-[--accent-bg]" : "text-[--text-2] hover:bg-[--border-subtle]"}`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <svg className="w-3.5 h-3.5 shrink-0 text-[--accent]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
