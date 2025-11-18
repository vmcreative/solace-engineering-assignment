"use client";

import MultiSelect from "@/components/MultiSelect";

interface FiltersBarProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;

  nameModes: ("first" | "last")[];
  setNameModes: (v: ("first" | "last")[]) => void;

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

export default function FiltersBar(props: FiltersBarProps) {
  const {
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
  } = props;

  return ( 
    <div className="filters-bar">
      <h1>Solace Advocates Search</h1>
      
      <div className="filters-bar__row">

        {/* SEARCH */}
        <div className="filters-bar__field filters-bar__name">
          <label>
            Search by name

            <input
              id="search"
              value={searchTerm}
              placeholder="Enter a name"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
          
        </div>

        {/* NAME MODE */}
        <MultiSelect
          label="Match"
          options={["first", "last"]}
          selected={nameModes}
          showSearch={false}
          onChange={setNameModes}
        />

        {/* Exact Name Match Filter */}
        <label className="filters-bar__inline">
          <input
            type="checkbox"
            checked={exactMatch}
            onChange={(e) => setExactMatch(e.target.checked)}
          />

          Exact Match
        </label>
      </div>

      {/* Multiselect Filters */}
      <div className="filters-bar__row">

        {/* Location Filter */}
        <MultiSelect
          label="Cities"
          options={cities}
          selected={selectedCities}
          onChange={setSelectedCities}
        />

        {/* Degree Filter */}
        <MultiSelect
          label="Degrees"
          options={degrees}
          selected={selectedDegrees}
          showSearch={false}
          onChange={setSelectedDegrees}
        />

        {/* Specialties Filter */}
        <MultiSelect
          label="Specialties"
          options={specialties}
          selected={selectedSpecialties}
          onChange={setSelectedSpecialties}
        />

        {/* Minimum Years Experience Filter */}
        <div className="filters-bar__field">
          <label>
            Minimum Years

            <input
              id="years-input"
              type="number"
              min={1}
              value={minYears ?? ""}
              placeholder="Any"
              aria-label="Minimum years of experience"
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