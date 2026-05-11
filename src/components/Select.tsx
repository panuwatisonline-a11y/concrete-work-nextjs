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

  /* Close when clicking outside */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const choose = (opt: SelectOption) => {
    setSelected(opt);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* hidden input carries the value for form submission */}
      <input type="hidden" name={name} value={selected?.value ?? ""} required={required} />

      {/* Trigger */}
      <button
        type="button"
        id={id}
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 bg-white border rounded-lg pl-3 pr-3 py-2.5 text-sm text-left transition focus:outline-none focus:ring-1 focus:ring-orange-500
          ${open ? "border-orange-500 ring-1 ring-orange-500" : "border-gray-300"}
          ${!selected ? "text-gray-400" : "text-gray-900"}`}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <svg
          className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown list */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="max-h-56 overflow-y-auto overscroll-contain">
            {/* Blank / placeholder option */}
            <button
              type="button"
              onClick={() => { setSelected(null); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                ${!selected ? "bg-orange-50 text-orange-600 font-medium" : "text-gray-400 hover:bg-gray-50 active:bg-gray-100"}`}
            >
              {placeholder}
            </button>

            {/* Divider */}
            <div className="h-px bg-gray-100 mx-3" />

            {options.map((opt) => {
              const isSelected = selected?.value === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => choose(opt)}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between gap-2 transition-colors
                    ${isSelected
                      ? "bg-orange-50 text-orange-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                    }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <svg className="w-4 h-4 shrink-0 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
