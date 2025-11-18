"use client";

import { useEffect, useState } from "react";

import { Advocate, AdvocatesResponse } from "@/types/advocate";
import { generateStableId } from "@/utils/id";
import { formatPhone } from "@/utils/format";

import FiltersBar from "@/components/FiltersBar";
import SortDropdown from "@/components/SortDropdown";
import SpecialtiesCell from "@/components/SpecialtiesCell";

export type SortKey =
  | "firstName"
  | "lastName"
  | "degree"
  | "yearsOfExperience"
  | "city";

/**
 * Utility: Adds a stable deterministic _id to each advocate.
 * This keeps React list keys consistent whether data is coming
 * from mock data or a real database.
 */
async function attachIds(rows: Advocate[]) {
  return Promise.all(
    rows.map(async (a) => ({
      ...a,
      _id: await generateStableId(a),
    }))
  );
}

export default function Home() {
  /**
   * ------------------------------------------------------------
   *  Client State
   * ------------------------------------------------------------
   * Advocates are fully driven by the backend; the frontend
   * simply keeps track of filters and displays results.
   */
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* Filter state */
  const [searchTerm, setSearchTerm] = useState("");
  const [nameModes, setNameModes] = useState<("first" | "last")[]>(["first", "last"]);
  const [exactMatch, setExactMatch] = useState(false);
  const [minYears, setMinYears] = useState<number | null>(null);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  /* Sorting */
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  /**
   * ------------------------------------------------------------
   *  Initial Fetch (runs once)
   * ------------------------------------------------------------
   * Loads the full dataset before user interaction begins.
   * This gives us the complete lists of cities/ degrees/
   * specialties to populate filter dropdowns.
   */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/advocates");
        const json: AdvocatesResponse = await res.json();
        setAdvocates(await attachIds(json.data));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setInitializing(false);
      }
    };

    load();
  }, []);

  /**
   * ------------------------------------------------------------
   *  Reactive Fetch (debounced)
   * ------------------------------------------------------------
   * When any filter or sort option changes:
   *    → Build query params
   *    → Re-query the backend
   *    → Replace advocate list
   *
   * Debouncing prevents excessive network traffic as the user
   * types, and `AbortController` avoids race conditions.
   */
  useEffect(() => {
    if (initializing) return;

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        const params = new URLSearchParams();

        // Only include parameters when they are actively set
        if (searchTerm) params.set("search", searchTerm);
        if (exactMatch) params.set("exactMatch", "1");
        if (nameModes.length) params.set("nameModes", nameModes.join(","));
        if (selectedCities.length) params.set("city", selectedCities.join(","));
        if (selectedDegrees.length) params.set("degree", selectedDegrees.join(","));
        if (selectedSpecialties.length)
          params.set("specialties", selectedSpecialties.join(","));
        if (minYears != null) params.set("minYears", String(minYears));

        if (sortKey) params.set("sort", sortKey);
        params.set("dir", sortDir);

        const res = await fetch(`/api/advocates?${params}`, {
          signal: controller.signal,
        });

        const json: AdvocatesResponse = await res.json();
        setAdvocates(await attachIds(json.data));
      } catch (err: any) {
        if (err.name !== "AbortError") setError(err.message);
      }
    }, 150); // small debounce for UX responsiveness

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [
    initializing,
    searchTerm,
    nameModes,
    exactMatch,
    selectedCities,
    selectedDegrees,
    selectedSpecialties,
    minYears,
    sortKey,
    sortDir,
  ]);

  /**
   * ------------------------------------------------------------
   *  One-time fade-in animation
   * ------------------------------------------------------------
   * This prevents the fade animation from triggering every time
   * filters change — it only runs on first render.
   */
  const [animateOnce, setAnimateOnce] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateOnce(false);
    }, 400); // matches CSS fade-in
    return () => clearTimeout(timer);
  }, []);

  /**
   * ------------------------------------------------------------
   *  Loading / Error states
   * ------------------------------------------------------------
   */
  if (initializing) {
    return (
      <main>
        <div className="preloader">
          <span className="preloader__text">Loading…</span>
        </div>
      </main>
    );
  }

  if (error) return <main>Error: {error}</main>;

  /**
   * ------------------------------------------------------------
   *  Derived Data (dropdown options)
   * ------------------------------------------------------------
   * These reflect only the advocates currently in view.
   */
  const cities = Array.from(new Set(advocates.map(a => a.city))).sort();
  const degrees = Array.from(new Set(advocates.map(a => a.degree))).sort();
  const specialties = Array.from(
    new Set(advocates.flatMap(a => a.specialties))
  ).sort();

  const columns = [
    { key: "firstName", label: "First" },
    { key: "lastName", label: "Last" },
    { key: "degree", label: "Degree" },
    { key: "yearsOfExperience", label: "Years" },
    { key: "city", label: "City" },
  ];

  /**
   * ------------------------------------------------------------
   *  Render
   * ------------------------------------------------------------
   */
  return (
    <main className={animateOnce ? "fade-in" : ""}>
      <FiltersBar
        {...{
          searchTerm,
          setSearchTerm,
          exactMatch,
          setExactMatch,
          nameModes,
          setNameModes,
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
        }}
      />

      <div className="advocates-container">
        <div className="advocates-scroll">
          <table className="advocates">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className={`advocates-header__${col.key}`}>
                    <SortDropdown
                      label={col.label}
                      onAsc={() => {
                        setSortKey(col.key as SortKey);
                        setSortDir("asc");
                      }}
                      onDesc={() => {
                        setSortKey(col.key as SortKey);
                        setSortDir("desc");
                      }}
                      onClear={() => setSortKey(null)}
                      isActive={sortKey === col.key}
                      direction={sortDir}
                    />
                  </th>
                ))}
                <th>Specialties</th>
                <th>Phone</th>
              </tr>
            </thead>

            <tbody>
              {advocates.length === 0 ? (
                /**
                 * Empty-state row shown when no results match.
                 */
                <tr className="advocate">
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-neutral-dark bg-white"
                  >
                    <div className="flex flex-col items-center gap-2 opacity-70">
                      <span className="material-symbols-rounded text-4xl">
                        search_off
                      </span>
                      <span className="text-sm">
                        No advocates match your criteria
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                advocates.map((a) => (
                  <tr key={a._id} className="advocate">
                    <td className="advocate__firstname">{a.firstName}</td>
                    <td className="advocate__lastname">{a.lastName}</td>
                    <td className="advocate__degree">{a.degree}</td>
                    <td className="advocate__experience">
                      {a.yearsOfExperience}
                    </td>
                    <td className="advocate__city">{a.city}</td>

                    <td className="advocate__specialties">
                      <SpecialtiesCell
                        items={a.specialties}
                        active={selectedSpecialties}
                      />
                    </td>

                    <td className="advocate__phone">
                      {formatPhone(a.phoneNumber)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}