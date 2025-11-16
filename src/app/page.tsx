"use client";

import { useEffect, useMemo, useState } from "react";
import { Advocate, AdvocatesResponse } from "@/types/advocate";

/* Generate a deterministic, stable ID for an advocate object.
 * CONTEXT: The mock API data does not include unique identifiers. To ensure stable React keys
 * we generate a SHA-256 hash from several non-sensitive, stable fields.
 * This provides deterministic, unique IDs per advocate that fix React reconciliation warnings.
 * (In a real application, IDs should be issued by the backend or database.) */
async function generateStableId(advocate: Advocate) {
  const stableString = `${advocate.firstName}-${advocate.lastName}-${advocate.city}-${advocate.degree}`;

  let hashBuffer: ArrayBuffer;
  try {
    hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(stableString)
    );
  } catch {
    /* Last-resort fallback */
    return `fallback-${Math.random().toString(36).slice(2)}`;
  }

  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /* Fetch and prepare advocate data. */
    const loadAdvocates = async () => {
      try {
        const res = await fetch("/api/advocates");

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const json: AdvocatesResponse = await res.json();

        if (!json?.data || !Array.isArray(json.data)) {
          throw new Error("Malformed API response: missing `data` field.");
        }

        const advocatesWithIds: Advocate[] = await Promise.all(
          json.data.map(async (adv) => ({
            ...adv,
            _id: await generateStableId(adv),
          }))
        );

        setAdvocates(advocatesWithIds);
      } catch (err: any) {
        setError(err.message || "Failed to load advocates.");
      } finally {
        setLoading(false);
      }
    };

    loadAdvocates();
  }, []);

  /* Memoized client-side filtering. */
  const filteredAdvocates = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return advocates.filter((a) => {
      return (
        a.firstName.toLowerCase().includes(term) ||
        a.lastName.toLowerCase().includes(term) ||
        a.city.toLowerCase().includes(term) ||
        a.degree.toLowerCase().includes(term) ||
        a.specialties.some((s) => s.toLowerCase().includes(term)) ||
        a.yearsOfExperience.toString().includes(term)
      );
    });
  }, [searchTerm, advocates]);

  const onReset = () => setSearchTerm("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  if (loading) {
    return <main style={{ margin: "24px" }}>Loading advocates…</main>;
  }

  if (error) {
    return (
      <main style={{ margin: "24px" }}>
        <p>Error loading advocates:</p>
        <pre>{error}</pre>
      </main>
    );
  }

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>

      <div style={{ marginBottom: "16px" }}>
        {/* ACCESSIBILITY FIX:
          * The original implementation included an unlabeled <input>.
          * Adding a proper <label> with a "for" attribute ensures the input is announced
          * correctly by screen readers and provides accessible name computation. */}
        <label htmlFor="search-input">Search advocates:</label>
        <input
          id="search-input"
          style={{ border: "1px solid black" }}
          value={searchTerm}
          onChange={onChange}
        />

        <button onClick={onReset} style={{ marginLeft: "8px" }}>
          Reset Search
        </button>
      </div>

      {filteredAdvocates.length === 0 && (
        <p>No advocates match your search.</p>
      )}

      <table>
        <caption className="sr-only">List of Solace advocate search results</caption>
        <thead>
          {/* FIX:
            * The original code placed <th> elements directly inside <thead>,
            * which violates HTML semantics and caused hydration mismatches.
            * A <tr> wrapper is required for valid markup. */}
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>

        <tbody>
          {filteredAdvocates.map((advocate) => {
            if (!advocate._id) return null;

            return (
              <tr key={advocate._id}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s, i) => (
                    <div key={i}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}