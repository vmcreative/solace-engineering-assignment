"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  /** List of all specialty strings for this advocate */
  items: string[];

  /** List of specialties currently selected in filters (used for highlighting) */
  active: string[];
}

/**
 * SpecialtiesCell
 * ------------------------------------------------------------------
 * A compact, auto-collapsing tag list used inside the advocates table.
 *
 * Purpose:
 *   • Long specialty lists can push table rows to extreme heights.
 *   • This component measures its natural height and collapses when
 *     required, revealing a "More / Less" toggle.
 *   • Active specialties (from user filters) surface to the top and
 *     are visually highlighted.
 *
 * UX Notes:
 *   • Measuring uses scrollHeight — avoids layout thrashing.
 *   • Fade gradient indicates hidden content when collapsed.
 *   • Expand/collapse transitions are smooth and CSS-driven.
 */
export default function SpecialtiesCell({ items, active }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [shouldCollapse, setShouldCollapse] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  /* --------------------------------------------------------------
     Sort specialties so "active" items (user-selected filters)
     appear first. This improves scannability and visual relevance.
     -------------------------------------------------------------- */
  const sorted = [
    ...items.filter((i) => active.includes(i)),
    ...items.filter((i) => !active.includes(i)),
  ];

  /* --------------------------------------------------------------
     Measure rendered height to determine whether collapsing is needed.
     We only measure after mount so layout is fully settled.
     -------------------------------------------------------------- */
  useEffect(() => {
    if (!containerRef.current) return;

    const naturalHeight = containerRef.current.scrollHeight;
    const COLLAPSED_HEIGHT = 96; // ~6rem — prevents table row overflow

    setShouldCollapse(naturalHeight > COLLAPSED_HEIGHT);
    setIsReady(true);
  }, [items, active]);

  const isCollapsed = shouldCollapse && !expanded;

  return (
    <div className="specialties">
      {/* ------------------------------------------------------------
         VISIBLE TAG CONTENT
         Height is constrained only if collapsing is required.
         ------------------------------------------------------------ */}
      <div
        ref={containerRef}
        className={`
          specialties__content
          ${!isReady ? "max-h-24" : isCollapsed ? "max-h-24" : "max-h-[1500px]"}
        `}
      >
        <div className="specialties__tags">
          {sorted.map((spec) => {
            const isActive = active.includes(spec);

            return (
              <span
                key={spec}
                className={`
                  specialties__tag
                  ${isActive ? "specialties__tag--active" : ""}
                `}
              >
                {spec}
              </span>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------
         Fade gradient appears when collapsed to indicate overflow.
         ------------------------------------------------------------ */}
      {shouldCollapse && (
        <div
          className={`
            specialties__fade
            ${isReady && !expanded ? "opacity-100" : "opacity-0"}
          `}
        />
      )}

      {/* ------------------------------------------------------------
         Expand / Collapse Toggle
         ------------------------------------------------------------ */}
      {shouldCollapse && (
        <button
          type="button"
          onClick={() => setExpanded((x) => !x)}
          className="specialties__toggle"
        >
          <span>{expanded ? "Less" : "More"}</span>
          <span className="material-symbols-rounded">
            {expanded ? "expand_less" : "expand_more"}
          </span>
        </button>
      )}
    </div>
  );
}