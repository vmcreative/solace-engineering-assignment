"use client";

import MultiSelect from "@/components/MultiSelect";
import { NameFilterMode } from "@/types/filters";

interface FiltersBarProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;

  nameMode: NameFilterMode;
  setNameMode: (v: NameFilterMode) => void;

  exactMatch: boolean;
  setExactMatch: (v: boolean) => void;

  minYears: number | null;
  setMinYears: (v: number | null) => void;

  cities: string[];
  degrees: string[];
  specialties: string[];

  selectedCities: string[];
  setSelectedCities: (v: string[]) => void;

  selectedDegrees: string[];
  setSelectedDegrees: (v: string[]) => void;

  selectedSpecialties: string[];
  setSelectedSpecialties: (v: string[]) => void;
}

export default function FiltersBar({
  searchTerm,
  setSearchTerm,
  nameMode,
  setNameMode,
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
    <div style={{ marginBottom: "20px" }}>
      {/* SEARCH */}
      <label htmlFor="search">Search by name:</label>
      <input
        id="search"
        value={searchTerm}
        placeholder="Enter a name..."
        style={{ border: "1px solid black", marginLeft: "6px" }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* NAME FILTER MODE */}
      <label htmlFor="name-mode" style={{ marginLeft: "12px" }}>
        Name Mode:
      </label>
      <select
        id="name-mode"
        title="Filter by first, last, or full name"
        value={nameMode}
        onChange={(e) => setNameMode(e.target.value as NameFilterMode)}
        style={{ marginLeft: "6px" }}
      >
        <option value="full">Full Name</option>
        <option value="first">First Name</option>
        <option value="last">Last Name</option>
      </select>

      {/* EXACT MATCH */}
      <label style={{ marginLeft: "12px" }}>
        <input
          type="checkbox"
          checked={exactMatch}
          onChange={(e) => setExactMatch(e.target.checked)}
        />
        Exact Match
      </label>

      {/* MULTISELECT FILTERS */}
      <div style={{ display: "flex", gap: "20px", marginTop: "12px" }}>
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
          onChange={setSelectedDegrees}
        />

        <MultiSelect
          label="Specialties"
          options={specialties}
          selected={selectedSpecialties}
          onChange={setSelectedSpecialties}
        />

        {/* MIN YEARS */}
        <div>
          <label htmlFor="years-input">Min Years Experience</label>
          <input
            id="years-input"
            type="number"
            min={1}
            value={minYears ?? ""}
            placeholder="Show All"
            aria-label="Minimum years of experience"
            onChange={(e) =>
              setMinYears(e.target.value ? Number(e.target.value) : null)
            }
          />
        </div>
      </div>
    </div>
  );
}