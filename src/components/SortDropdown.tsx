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
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Sort ${label}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          cursor: "pointer",
          border: "none",
          background: "transparent",
          padding: "2px 4px",
          fontSize: "14px",
        }}
      >
        {/* Label is now clickable */}
        <span>{label}</span>

        {/* Icon */}
        <span
          className="material-symbols-rounded"
          style={{
            fontSize: "18px",
            color: isActive ? "#000" : "#777",
          }}
        >
          {headerIcon}
        </span>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "6px",
            zIndex: 200,
            padding: "4px 0",
            width: "160px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          {/* ASC */}
          <button
            onClick={() => {
              onAsc();
              setOpen(false);
            }}
            style={menuItemStyle}
          >
            <span className="material-symbols-rounded" style={iconStyle}>
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
            style={menuItemStyle}
          >
            <span className="material-symbols-rounded" style={iconStyle}>
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
            style={menuItemStyle}
          >
            <span className="material-symbols-rounded" style={iconStyle}>
              close
            </span>
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

/* Styles */
const menuItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  width: "100%",
  padding: "6px 10px",
  background: "none",
  border: "none",
  textAlign: "left",
  fontSize: "14px",
  cursor: "pointer",
  color: "#333",
};

const iconStyle: React.CSSProperties = {
  fontSize: "18px",
  color: "#444",
  flexShrink: 0,
};