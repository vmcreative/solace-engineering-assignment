"use client";

import { useState, useRef, useEffect } from "react";

interface MultiSelectProps<T extends string> {
  label: string;
  options: T[];
  selected: T[];
  onChange: (values: T[]) => void;
  showSearch?: boolean;
}

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

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ESC to close dropdown */
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

  /* Autofocus search when opened */
  useEffect(() => {
    if (open && showSearch && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 10);
    }
  }, [open, showSearch]);

  /* ---------------------------------------
     SORT OPTIONS SO SELECTED COME FIRST
  ---------------------------------------- */

  const sorted = [...options].sort((a, b) => {
    const aSelected = selected.includes(a);
    const bSelected = selected.includes(b);

    // Selected always first
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;

    // Otherwise fallback alphabetical
    return a.localeCompare(b);
  });

  /* ---------------------------------------
     APPLY SEARCH FILTER (AFTER SORTING)
  ---------------------------------------- */

  const filtered = showSearch
    ? sorted.filter((opt) =>
        opt.toLowerCase().includes(search.toLowerCase())
      )
    : sorted;

  const toggle = (val: T) => {
    const newValues = selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val];

    onChange(newValues);
    setSearch("");

    if (showSearch && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 10);
    }
  };

  return (
    <div ref={wrapperRef} className="filters-bar__field">
      <label>
        {label}

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
          {/* SEARCH INPUT */}
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

          {/* OPTIONS */}
          {filtered.map((opt) => (
            <label key={opt} className="filter-dropdown__option">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
              />
              <span className={selected.includes(opt) ? "font-medium text-green-dark" : ""}>
                {opt}
              </span>
            </label>
          ))}

          {filtered.length === 0 && (
            <p className="filter-dropdown__empty">No results</p>
          )}
        </div>
      )}
    </div>
  );
}