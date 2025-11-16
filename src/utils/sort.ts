import { Advocate } from "@/types/advocate";

export type SortKey =
  | "firstName"
  | "lastName"
  | "city"
  | "degree"
  | "yearsOfExperience"
  | null;

export function sortAdvocates(
  data: Advocate[],
  key: SortKey,
  dir: "asc" | "desc"
): Advocate[] {
  if (!key) return data;

  return [...data].sort((a, b) => {
    const left = a[key];
    const right = b[key];

    if (typeof left === "number" && typeof right === "number") {
      return dir === "asc" ? left - right : right - left;
    }

    const l = String(left).toLowerCase();
    const r = String(right).toLowerCase();

    if (l < r) return dir === "asc" ? -1 : 1;
    if (l > r) return dir === "asc" ? 1 : -1;
    return 0;
  });
}