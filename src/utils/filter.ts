import { Advocate } from "@/types/advocate";

export function advocateMatchesFilters(
  a: Advocate,
  {
    search,
    nameModes,
    exactMatch,
    selectedCities,
    selectedDegrees,
    selectedSpecialties,
    minYears,
  }: {
    search: string;
    nameModes: ("first" | "last")[];
    exactMatch: boolean;
    selectedCities: string[];
    selectedDegrees: string[];
    selectedSpecialties: string[];
    minYears: number | null;
  }
) {
  const match = (v: string, s: string) =>
    exactMatch ? v === s : v.includes(s);

  /* ---------------- NAME SEARCH ---------------- */
  if (search) {
    const checks: boolean[] = [];

    if (nameModes.includes("first")) {
      checks.push(match(a.firstName.toLowerCase(), search));
    }

    if (nameModes.includes("last")) {
      checks.push(match(a.lastName.toLowerCase(), search));
    }

    if (!checks.some(Boolean)) return false;
  }

  /* -------------- OTHER FILTERS --------------- */

  if (selectedCities.length && !selectedCities.includes(a.city)) return false;
  if (selectedDegrees.length && !selectedDegrees.includes(a.degree)) return false;

  if (selectedSpecialties.length) {
    const ok = a.specialties.some((s) => selectedSpecialties.includes(s));
    if (!ok) return false;
  }

  if (minYears !== null && a.yearsOfExperience < minYears) return false;

  return true;
}