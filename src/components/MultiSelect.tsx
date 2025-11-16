"use client";

import { useState, useRef, useEffect } from "react";

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}

export default function MultiSelect({
  label,
  options,
  selected,
  onChange
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  return (
    <div ref={ref} style={{ position: "relative", width: "220px" }}>
      <label>{label}</label>

      <button
        type="button"
        style={{
          border: "1px solid black",
          padding: "4px",
          width: "100%",
          textAlign: "left",
        }}
        onClick={() => setOpen((o) => !o)}
      >
        {selected.length === 0 ? "Show All" : selected.join(", ")}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 20,
            background: "white",
            border: "1px solid #ccc",
            width: "100%",
            maxHeight: "200px",
            overflowY: "auto",
            padding: "6px"
          }}
        >
          {/* Search field */}
          <input
            type="text"
            placeholder="Search..."
            style={{ width: "100%", marginBottom: "6px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Options */}
          {filtered.map((opt) => (
            <label
              key={opt}
              style={{ display: "flex", gap: "6px", alignItems: "center" }}
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
              />
              {opt}
            </label>
          ))}

          {filtered.length === 0 && <p>No results</p>}
        </div>
      )}
    </div>
  );
}