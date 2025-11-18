/**
 * filterAndSortLocal
 * ------------------------------------------------------
 * This function implements **the exact same filtering and
 * sorting logic as the backend**, but runs entirely client-side.
 *
 * Why this exists:
 * - When no Postgres instance is configured (the default state
 *   of the assignment), `/api/advocates` falls back to a bundled
 *   mock dataset.
 * - To keep UI behavior consistent regardless of environment,
 *   the mock dataset must run through the *same logic* the
 *   database uses.
 *
 * This function mirrors the SQL filters in `route.ts`:
 *   - Name search (partial or exact match)
 *   - City / Degree filters
 *   - Specialties array intersection
 *   - Minimum years of experience
 *   - Sorting on any supported column
 *   - Pagination (limit + offset)
 *
 * NOTE:
 * This is intentionally “dumb filtering”—no indexing, no
 * optimization—because it only runs on a very small
 * in-memory dataset used for the assignment.
 */

import { Advocate } from "@/types/advocate";
import { SortKey } from "@/app/page";

/** Small helper: safely extract a sort field */
function getField(a: Advocate, key: SortKey) {
  return a[key];
}

export function filterAndSortLocal(
  data: Advocate[],
  {
    search,
    nameModes,
    exactMatch,
    selectedCities,
    selectedDegrees,
    selectedSpecialties,
    minYears,
    sort,
    dir,
    limit,
    offset,
  }: {
    search: string;
    nameModes: ("first" | "last")[];
    exactMatch: boolean;
    selectedCities: string[];
    selectedDegrees: string[];
    selectedSpecialties: string[];
    minYears: number | null;
    sort: SortKey | null;
    dir: "asc" | "desc";
    limit: number;
    offset: number;
  }
) {
  /* -------------------------------------------------------
   * 1. FILTERING
   *    Mirrors the SQL WHERE clauses in /api/advocates
   * ------------------------------------------------------- */
  let filtered = data.filter((a) => {
    /* -------------------------
       NAME SEARCH + EXACT MATCH 
       (matches SQL LIKE / =)
    -------------------------- */
    if (search) {
      const s = search.toLowerCase();

      const matches: boolean[] = [];

      if (nameModes.includes("first")) {
        matches.push(
          exactMatch
            ? a.firstName.toLowerCase() === s
            : a.firstName.toLowerCase().includes(s)
        );
      }

      if (nameModes.includes("last")) {
        matches.push(
          exactMatch
            ? a.lastName.toLowerCase() === s
            : a.lastName.toLowerCase().includes(s)
        );
      }

      // At least one name field must match
      if (!matches.some(Boolean)) return false;
    }

    /* -------------------------
       CITY FILTER (exact match)
    -------------------------- */
    if (selectedCities.length && !selectedCities.includes(a.city)) {
      return false;
    }

    /* -------------------------
       DEGREE FILTER (exact match)
    -------------------------- */
    if (selectedDegrees.length && !selectedDegrees.includes(a.degree)) {
      return false;
    }

    /* -------------------------
       SPECIALTIES FILTER
       (array intersection, like SQL `&&`)
    -------------------------- */
    if (selectedSpecialties.length) {
      const intersects = a.specialties.some((tag) =>
        selectedSpecialties.includes(tag)
      );
      if (!intersects) return false;
    }

    /* -------------------------
       MINIMUM YEARS EXPERIENCE
    -------------------------- */
    if (minYears != null && a.yearsOfExperience < minYears) {
      return false;
    }

    return true;
  });

  /* -------------------------------------------------------
   * 2. SORTING
   *    Matches SQL ORDER BY semantics as closely as possible.
   * ------------------------------------------------------- */
  if (sort) {
    filtered = [...filtered].sort((a, b) => {
      const valA = getField(a, sort);
      const valB = getField(b, sort);

      // String comparison: localeCompare for SQL-ish ordering
      if (typeof valA === "string") {
        return dir === "asc"
          ? valA.localeCompare(valB as string)
          : (valB as string).localeCompare(valA);
      }

      // Numeric comparison
      return dir === "asc"
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    });
  }

  /* -------------------------------------------------------
   * 3. PAGINATION
   *    Applied last, same as SQL LIMIT + OFFSET.
   * ------------------------------------------------------- */
  const slice = filtered.slice(offset, offset + limit);

  return {
    rows: slice,
    total: filtered.length,
  };
}