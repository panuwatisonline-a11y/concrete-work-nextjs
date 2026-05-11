"use client";

import { useState, useRef, useEffect } from "react";

export type MultiSelectOption = { value: string; label: string };

interface MultiSelectProps {
  name: string;
  options: MultiSelectOption[];
  placeholder?: string;
  defaultValue?: string; // comma-separated labels, e.g. "Beam, Column"
}

export function MultiSelect({
  name,
  options,
  placeholder = "-- เลือก --",
  defaultValue = "",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(() => {
    if (!defaultValue) return new Set();
    const parts = defaultValue.split(",").map((s) => s.trim()).filter(Boolean);
    return new Set(parts);
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const displayText =
    selected.size === 0
      ? placeholder
      : Array.from(selected).join(", ");

  const storedValue = Array.from(selected).join(", ");

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={storedValue} />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "w-full flex items-center justify-between gap-2 bg-white border rounded-lg pl-3 pr-3 py-2 text-sm text-left transition focus:outline-none focus:ring-1 focus:ring-orange-500",
          open ? "border-orange-500 ring-1 ring-orange-500" : "border-gray-300",
          selected.size === 0 ? "text-gray-400" : "text-gray-900",
        ].join(" ")}
      >
        <span className="truncate text-xs">{displayText}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {selected.size > 0 && (
            <span className="text-[10px] font-semibold bg-orange-100 text-orange-600 rounded-full px-1.5 py-0.5">
              {selected.size}
            </span>
          )}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {selected.size > 0 && (
            <div className="px-3 pt-2 pb-1 flex items-center justify-between">
              <span className="text-[10px] text-gray-400">เลือกแล้ว {selected.size} รายการ</span>
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="text-[10px] text-red-400 hover:text-red-600 transition"
              >
                ล้างทั้งหมด
              </button>
            </div>
          )}
          <div className="max-h-52 overflow-y-auto overscroll-contain">
            {options.map((opt) => {
              const isSelected = selected.has(opt.label);
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => toggle(opt.label)}
                  className={[
                    "w-full text-left px-4 py-2.5 text-xs flex items-center gap-3 transition-colors",
                    isSelected
                      ? "bg-orange-50 text-orange-700"
                      : "text-gray-700 hover:bg-gray-50 active:bg-gray-100",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "w-4 h-4 shrink-0 rounded border-2 flex items-center justify-center transition-colors",
                      isSelected
                        ? "bg-orange-500 border-orange-500"
                        : "border-gray-300 bg-white",
                    ].join(" ")}
                  >
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
