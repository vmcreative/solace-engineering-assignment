"use client";

import React from "react";
import MultiSelect from "@/components/MultiSelect";

interface FiltersBarProps {
  // Name search
  searchTerm: string;
  setSearchTerm: (v: string) => void;

  // Whether to match first name, last name, or both
  nameModes: ("first" | "last")[];
  setNameModes: (v: ("first" | "last")[]) => void;

  // Enforces exact string equality instead of "contains"
  exactMatch: boolean;
  setExactMatch: (v: boolean) => void;

  // Minimum years experience
  minYears: number | null;
  setMinYears: (v: number | null) => void;

  // Dynamic dropdown options generated from current dataset
  cities: string[];
  degrees: string[];
  specialties: string[];

  // Active selections for multiselect fields
  selectedCities: string[];
  setSelectedCities: (v: string[]) => void;

  selectedDegrees: string[];
  setSelectedDegrees: (v: string[]) => void;

  selectedSpecialties: string[];
  setSelectedSpecialties: (v: string[]) => void;
}

/**
 * FiltersBarComponent
 * -----------------------------------------------------------
 * Pure presentational component for all filtering controls.
 * This component:
 *   • Does not fetch data
 *   • Does not compute derived state
 *   • Simply reflects user input outward through callbacks
 *
 * Using isolated state + controlled inputs allows the parent
 * page component to manage how filters interact with backend
 * queries without unnecessary re-renders.
 */
function FiltersBarComponent({
  searchTerm,
  setSearchTerm,
  nameModes,
  setNameModes,
  exactMatch,
  setExactMatch,
  minYears,
  setMinYears,
  cities,
  degrees,
  specialties,
  selectedCities,
  setSelectedCities,
  selectedDegrees,
  setSelectedDegrees,
  selectedSpecialties,
  setSelectedSpecialties,
}: FiltersBarProps) {
  return (
    <div className="filters-bar">
      <h1>Solace Advocates Search</h1>

      {/* --------------------------------------------- */}
      {/* Row 1 — Name search, match mode, exact match */}
      {/* --------------------------------------------- */}
      <div className="filters-bar__row">

        {/* Name text search */}
        <div className="filters-bar__field filters-bar__name">
          <label>
            Search by name
            <input
              key="stable-search-input" // prevents focus loss on re-render
              id="search"
              value={searchTerm}
              placeholder="Enter a name"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>

        {/* Match "first", "last", or both */}
        <MultiSelect
          label="Match"
          options={["first", "last"]}
          selected={nameModes}
          showSearch={false}
          onChange={setNameModes}
        />

        {/* Boolean toggle for strict equality */}
        <label className="filters-bar__inline">
          <input
            type="checkbox"
            checked={exactMatch}
            onChange={(e) => setExactMatch(e.target.checked)}
          />
          Exact Match
        </label>
      </div>

      {/* --------------------------------------------- */}
      {/* Row 2 — Cities, Degrees, Specialties, Min Years */}
      {/* --------------------------------------------- */}
      <div className="filters-bar__row">

        <MultiSelect
          label="Cities"
          options={cities}
          selected={selectedCities}
          onChange={setSelectedCities}
        />

        <MultiSelect
          label="Degrees"
          options={degrees}
          selected={selectedDegrees}
          showSearch={false}
          onChange={setSelectedDegrees}
        />

        <MultiSelect
          label="Specialties"
          options={specialties}
          selected={selectedSpecialties}
          onChange={setSelectedSpecialties}
        />

        {/* Minimum years of experience */}
        <div className="filters-bar__field">
          <label>
            Minimum Years
            <input
              id="years-input"
              type="number"
              min={1}
              value={minYears ?? ""}
              placeholder="Any"
              onChange={(e) =>
                setMinYears(e.target.value ? Number(e.target.value) : null)
              }
            />
          </label>
        </div>

      </div>
    </div>
  );
}

/**
 * Memoization
 * -----------------------------------------------------------
 * The filters bar re-renders frequently as the parent component
 * updates advocate results. Wrapping in `React.memo` ensures
 * this component only re-renders when a *filter input* actually
 * changes — improving responsiveness and preventing flicker.
 */
const FiltersBar = React.memo(FiltersBarComponent);

export default FiltersBar;