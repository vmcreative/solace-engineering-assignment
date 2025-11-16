import { Advocate } from "@/types/advocate";

export function advocateMatchesFilters(
  a: Advocate,
  {
    search,
    nameMode,
    exactMatch,
    selectedCities,
    selectedDegrees,
    selectedSpecialties,
    minYears,
  }: {
    search: string;
    nameMode: "full" | "first" | "last";
    exactMatch: boolean;
    selectedCities: string[];
    selectedDegrees: string[];
    selectedSpecialties: string[];
    minYears: number | null;
  }
) {
  const match = (v: string, s: string) =>
    exactMatch ? v === s : v.includes(s);

  /* Name search */
  if (search) {
    const name =
      nameMode === "full"
        ? `${a.firstName} ${a.lastName}`.toLowerCase()
        : nameMode === "first"
        ? a.firstName.toLowerCase()
        : a.lastName.toLowerCase();

    if (!match(name, search)) return false;
  }

  if (selectedCities.length && !selectedCities.includes(a.city)) return false;
  if (selectedDegrees.length && !selectedDegrees.includes(a.degree))
    return false;

  if (selectedSpecialties.length) {
    const ok = a.specialties.some((s) => selectedSpecialties.includes(s));
    if (!ok) return false;
  }

  if (minYears !== null && a.yearsOfExperience < minYears) return false;

  return true;
}