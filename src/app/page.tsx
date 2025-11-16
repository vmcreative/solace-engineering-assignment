"use client";

import { useEffect, useState, useMemo } from "react";

import { Advocate, AdvocatesResponse } from "@/types/advocate";
import { NameFilterMode } from "@/types/filters";

import { generateStableId } from "@/utils/id";
import { sortAdvocates, SortKey } from "@/utils/sort";
import { advocateMatchesFilters } from "@/utils/filter";
import { formatPhone } from "@/utils/format";

import FiltersBar from "@/components/FiltersBar";
import SortDropdown from "@/components/SortDropdown";
import SpecialtiesCell from "@/components/SpecialtiesCell";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [nameMode, setNameMode] = useState<NameFilterMode>("full");
  const [exactMatch, setExactMatch] = useState(false);
  const [minYears, setMinYears] = useState<number | null>(null);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  // Sorting
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/advocates");
        const json: AdvocatesResponse = await res.json();

        const withIds = await Promise.all(
          json.data.map(async (a) => ({
            ...a,
            _id: await generateStableId(a),
          }))
        );

        setAdvocates(withIds);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const res = advocates.filter((a) =>
      advocateMatchesFilters(a, {
        search,
        nameMode,
        exactMatch,
        selectedCities,
        selectedDegrees,
        selectedSpecialties,
        minYears,
      })
    );

    return sortAdvocates(res, sortKey, sortDir);
  }, [
    advocates,
    searchTerm,
    nameMode,
    exactMatch,
    selectedCities,
    selectedDegrees,
    selectedSpecialties,
    minYears,
    sortKey,
    sortDir,
  ]);

  if (loading) return <main>Loading…</main>;
  if (error) return <main>Error: {error}</main>;

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

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>

      <FiltersBar
        {...{
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
        }}
      />

      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>
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
          {filtered.map((a) => (
            <tr key={a._id}>
              <td>{a.firstName}</td>
              <td>{a.lastName}</td>
              <td>{a.degree}</td>
              <td>{a.yearsOfExperience}</td>
              <td>{a.city}</td>

              <td>
                <SpecialtiesCell items={a.specialties} />
              </td>

              <td>{formatPhone(a.phoneNumber)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}