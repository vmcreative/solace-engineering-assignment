"use client";

import { useEffect, useState, useMemo } from "react";

import { Advocate, AdvocatesResponse } from "@/types/advocate";

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
  const [nameModes, setNameModes] = useState<("first" | "last")[]>(["first", "last"]);
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
        nameModes,
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
    nameModes,
    exactMatch,
    selectedCities,
    selectedDegrees,
    selectedSpecialties,
    minYears,
    sortKey,
    sortDir,
  ]);

  if (loading) {
    return (
      <main>
        <div className="preloader">
          <span className="preloader__text">Loading…</span>
        </div>
      </main>
    );
  }
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
    <main className="fade-in"> 
      <FiltersBar
        {...{
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
        }}
      />

      {/* Table Container */}
      <div className="advocates-container">
        <div className="advocates-scroll">
          <table className="advocates" role="table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`advocates-header__${col.key}`}
                  >
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
              {filtered.map((a, i) => (
                <tr key={a._id} className="advocate">
                  <td className="advocate__firstname">{a.firstName}</td>
                  <td className="advocate__lastname">{a.lastName}</td>
                  <td className="advocate__degree">{a.degree}</td>
                  <td className="advocate__experience">{a.yearsOfExperience}</td>
                  <td className="advocate__city">{a.city}</td>

                  <td className="advocate__specialties">
                      <SpecialtiesCell items={a.specialties} active={selectedSpecialties} />
                  </td>

                  <td className="advocate__phone">
                    {formatPhone(a.phoneNumber)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}