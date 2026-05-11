"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

export type MultiSelectOption = { value: string; label: string };

interface MultiSelectProps {
  name: string;
  options: MultiSelectOption[];
  placeholder?: string;
  title?: string;
  defaultValue?: string;
}

function MultiSelectPortal({
  title,
  options,
  selected,
  onToggle,
  onSelectAll,
  onDone,
}: {
  title: string;
  options: MultiSelectOption[];
  selected: Set<string>;
  onToggle: (label: string) => void;
  onSelectAll: () => void;
  onDone: () => void;
}) {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((o) => selected.has(o.label));

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <div className="mt-3">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 placeholder-gray-400"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">ไม่พบรายการ</p>
          ) : (
            filtered.map((opt) => {
              const isSelected = selected.has(opt.label);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onToggle(opt.label)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                >
                  <span
                    className={[
                      "w-5 h-5 shrink-0 rounded border-2 flex items-center justify-center transition-colors",
                      isSelected ? "bg-orange-500 border-orange-500" : "border-gray-300 bg-white",
                    ].join(" ")}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className="text-sm text-gray-800">{opt.label}</span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onSelectAll}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
          >
            {allFilteredSelected ? "ยกเลิกทั้งหมด" : "Select All"}
          </button>
          <button
            type="button"
            onClick={onDone}
            className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function MultiSelect({
  name,
  options,
  placeholder = "-- เลือก --",
  title = "เลือกรายการ",
  defaultValue = "",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(() => {
    if (!defaultValue) return new Set();
    return new Set(defaultValue.split(",").map((s) => s.trim()).filter(Boolean));
  });

  const toggle = useCallback((label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected((prev) => {
      const allSelected = options.every((o) => prev.has(o.label));
      if (allSelected) return new Set();
      return new Set(options.map((o) => o.label));
    });
  }, [options]);

  const storedValue = Array.from(selected).join(", ");
  const displayText = selected.size === 0 ? placeholder : Array.from(selected).join(", ");

  return (
    <>
      <input type="hidden" name={name} value={storedValue} />

      <button
        type="button"
        onClick={() => setOpen(true)}
        className={[
          "w-full flex items-center justify-between gap-2 bg-white border rounded-lg px-3 py-2 text-xs text-left transition focus:outline-none focus:ring-1 focus:ring-orange-500",
          "border-gray-300",
          selected.size === 0 ? "text-gray-400" : "text-gray-900",
        ].join(" ")}
      >
        <span className="truncate">{displayText}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {selected.size > 0 && (
            <span className="text-[10px] font-semibold bg-orange-100 text-orange-600 rounded-full px-1.5 py-0.5">
              {selected.size}
            </span>
          )}
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <MultiSelectPortal
          title={title}
          options={options}
          selected={selected}
          onToggle={toggle}
          onSelectAll={selectAll}
          onDone={() => setOpen(false)}
        />
      )}
    </>
  );
}
