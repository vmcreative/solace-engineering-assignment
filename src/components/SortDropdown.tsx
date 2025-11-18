"use client";

import { useState, useRef, useEffect } from "react";

interface SortDropdownProps {
  /** Column label displayed in header */
  label: string;

  /** Upstream sort handlers */
  onAsc: () => void;
  onDesc: () => void;
  onClear: () => void;

  /** Whether this column is currently being sorted */
  isActive: boolean;

  /** Current sort direction ("asc" | "desc") */
  direction: "asc" | "desc" | null;
}

/**
 * SortDropdown
 * ------------------------------------------------------------------
 * A lightweight, accessible dropdown for choosing sort order
 * (ascending, descending, or clearing sort).
 *
 * Design considerations:
 *   • Column headers must remain clickable and keyboard-friendly.
 *   • The active sort direction should be communicated visually.
 *   • The dropdown closes automatically on outside click.
 *   • The component is intentionally simple — full table sorting
 *     logic lives in the parent to keep this UI stateless.
 */
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

  /* --------------------------------------------------------------
     Close dropdown when clicking outside the component
     -------------------------------------------------------------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* --------------------------------------------------------------
     Determine which icon to show in the table header:
       • "sort"         → unsorted column
       • "arrow_upward" → sorted ascending
       • "arrow_downward" → sorted descending
     -------------------------------------------------------------- */
  const headerIcon = !isActive
    ? "sort"
    : direction === "asc"
    ? "arrow_upward"
    : "arrow_downward";

  return (
    <div ref={ref}>
      {/* ----------------------------------------------------------
         Trigger: the clickable column header
         ---------------------------------------------------------- */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Sort ${label}`}
        className="sort-dropdown__button"
      >
        <span>{label}</span>

        {/* Sort direction indicator */}
        <span
          className={`material-symbols-rounded sort-dropdown__button-icon ${
            isActive ? "active" : ""
          }`}
        >
          {headerIcon}
        </span>
      </button>

      {/* ----------------------------------------------------------
         Dropdown menu: choose sort order or clear it
         ---------------------------------------------------------- */}
      {open && (
        <div className="sort-dropdown__panel">

          {/* Ascending */}
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

          {/* Descending */}
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

          {/* Clear Sort */}
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