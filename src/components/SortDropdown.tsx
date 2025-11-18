"use client";

import { useState, useRef, useEffect } from "react";

interface SortDropdownProps {
  label: string;

  onAsc: () => void;
  onDesc: () => void;
  onClear: () => void;

  isActive: boolean;
  direction: "asc" | "desc" | null;
}

export default function SortDropdown({
  label,
  onAsc,
  onDesc,
  onClear,
  isActive,
  direction,
}: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Determine the correct header icon */
  const headerIcon = !isActive
    ? "sort"
    : direction === "asc"
    ? "arrow_upward"
    : "arrow_downward";

  return (
    <div ref={ref}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Sort ${label}`}
        className="sort-dropdown__button"
      >
        <span>{label}</span>

        {/* Icon */}
        <span className={`material-symbols-rounded sort-dropdown__button-icon ${isActive ? "active" : ""}`}>
          {headerIcon}
        </span>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="sort-dropdown__panel">
          {/* ASC */}
          <button
            onClick={() => {
              onAsc();
              setOpen(false);
            }}
            className="sort-dropdown__option"
          >
            <span className="material-symbols-rounded sort-dropdown__icon">
              arrow_upward
            </span>
            Ascending
          </button>

          {/* DESC */}
          <button
            onClick={() => {
              onDesc();
              setOpen(false);
            }}
            className="sort-dropdown__option"
          >
            <span className="material-symbols-rounded sort-dropdown__icon">
              arrow_downward
            </span>
            Descending
          </button>

          {/* CLEAR */}
          <button
            onClick={() => {
              onClear();
              setOpen(false);
            }}
            className="sort-dropdown__option"
          >
            <span className="material-symbols-rounded sort-dropdown__icon">
              close
            </span>
            Clear
          </button>
        </div>
      )}
    </div>
  );
}