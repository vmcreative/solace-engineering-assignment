"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  items: string[];
  active: string[];
}

export default function SpecialtiesCell({ items, active }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [shouldCollapse, setShouldCollapse] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sort active items first
  const sorted = [
    ...items.filter((i) => active.includes(i)),
    ...items.filter((i) => !active.includes(i)),
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const naturalHeight = containerRef.current.scrollHeight;
    const COLLAPSED_HEIGHT = 96; 

    setShouldCollapse(naturalHeight > COLLAPSED_HEIGHT);
    setIsReady(true);
  }, [items, active]);

  const isCollapsed = shouldCollapse && !expanded;

  return (
    <div className="specialties">
      {/* CONTENT */}
      <div
        ref={containerRef}
        className={`
          specialties__content
          ${!isReady ? "max-h-24" : isCollapsed ? "max-h-24" : "max-h-[1500px]"}
        `}
      >
        <div className="specialties__tags">
          {sorted.map((spec) => {
            const activeMatch = active.includes(spec);
            return (
              <span
                key={spec}
                className={`
                  specialties__tag
                  ${activeMatch ? "specialties__tag--active" : ""}
                `}
              >
                {spec}
              </span>
            );
          })}
        </div>
      </div>

      {/* FADE GRADIENT */}
      {shouldCollapse && (
        <div
          className={`
            specialties__fade
            ${isReady && !expanded ? "opacity-100" : "opacity-0"}
          `}
        />
      )}

      {/* TOGGLE BUTTON */}
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