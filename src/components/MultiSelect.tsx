"use client";

import { useState, useRef, useEffect } from "react";

interface MultiSelectProps<T extends string> {
  /** Label shown above the multiselect field */
  label: string;

  /** All available selectable options */
  options: T[];

  /** Currently selected values */
  selected: T[];

  /** Upstream change handler */
  onChange: (values: T[]) => void;

  /** Whether to show a search field inside the dropdown */
  showSearch?: boolean;
}

/**
 * MultiSelect
 * --------------------------------------------------------------
 * A lightweight, dependency-free multiselect dropdown component.
 *
 * Design goals:
 *   • Keyboard + mouse friendly
 *   • Click-outside and ESC-to-close behavior
 *   • Searchable dropdown (optional)
 *   • Clear UX: selected items are pinned to the top of the list
 *   • Fully controlled component (parent owns selected state)
 *
 * This keeps the UI declarative while remaining flexible enough
 * for multiple filters in the assignment.
 */
export default function MultiSelect<T extends string>({
  label,
  options,
  selected,
  onChange,
  showSearch = true,
}: MultiSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  /* ------------------------------------------------------------
     Close dropdown when clicking outside
     ------------------------------------------------------------ */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ------------------------------------------------------------
     Allow ESC key to close dropdown
     ------------------------------------------------------------ */
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  /* ------------------------------------------------------------
     Autofocus search field when opening the dropdown
     ------------------------------------------------------------ */
  useEffect(() => {
    if (open && showSearch && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 10);
    }
  }, [open, showSearch]);

  /* ------------------------------------------------------------
     Sort options: selected values pinned at the top
     ------------------------------------------------------------ */
  const sorted = [...options].sort((a, b) => {
    const aSelected = selected.includes(a);
    const bSelected = selected.includes(b);

    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return a.localeCompare(b);
  });

  /* ------------------------------------------------------------
     Apply text search (after sorting)
     ------------------------------------------------------------ */
  const filtered = showSearch
    ? sorted.filter((opt) =>
        opt.toLowerCase().includes(search.toLowerCase())
      )
    : sorted;

  /* ------------------------------------------------------------
     Toggle selection state for a single option
     ------------------------------------------------------------ */
  const toggle = (val: T) => {
    const newValues = selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val];

    onChange(newValues);

    // Reset and refocus search field for faster repeated selection
    setSearch("");

    if (showSearch && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 10);
    }
  };

  /* ------------------------------------------------------------
     RENDER
     ------------------------------------------------------------ */
  return (
    <div ref={wrapperRef} className="filters-bar__field">
      <label>
        {label}

        {/* Button that displays current selection and toggles dropdown */}
        <button
          type="button"
          className="filters-bar__selector"
          onClick={() => setOpen((o) => !o)}
        >
          {selected.length === 0 ? (
            <span className="filters-bar__placeholder">Show All</span>
          ) : (
            selected.join(", ")
          )}
        </button>
      </label>

      {open && (
        <div className="filter-dropdown__panel">

          {/* Optional searchable input */}
          {showSearch && (
            <input
              ref={searchRef}
              type="text"
              placeholder="Search..."
              className="filter-dropdown__search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}

          {/* Option list */}
          {filtered.map((opt) => (
            <label key={opt} className="filter-dropdown__option">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
              />
              <span
                className={
                  selected.includes(opt)
                    ? "font-medium text-green-dark"
                    : ""
                }
              >
                {opt}
              </span>
            </label>
          ))}

          {/* No results state (after filtering) */}
          {filtered.length === 0 && (
            <p className="filter-dropdown__empty">No results</p>
          )}
        </div>
      )}
    </div>
  );
}