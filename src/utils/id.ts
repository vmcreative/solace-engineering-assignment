/**
 * generateStableId
 * ------------------------------------------------------
 * Produces a *deterministic*, stable, hash-based ID for an
 * advocate — used solely on the client to ensure consistent
 * React list keys.
 *
 * Why this exists:
 * - The mock API + seed dataset don't include a unique ID.
 * - Using indexes as keys breaks React’s reconciliation.
 * - We generate a hash from a subset of fields that uniquely
 *   identify an advocate in the assignment dataset.
 *
 * How it works:
 * - Concatenate key identifying fields into a stable string.
 * - Hash it using Web Crypto's SHA-256 (async).
 * - Convert resulting ArrayBuffer into a hex string.
 *
 * If hashing fails (older browser / non-secure context):
 * - Fallback to a non-deterministic ID to avoid crashes.
 *   (This won’t break the UI; it only affects React keys.)
 */

export async function generateStableId(obj: any) {
  // Fields chosen because they're stable & unique enough
  const stableString = `${obj.firstName}-${obj.lastName}-${obj.city}-${obj.degree}`;

  try {
    // Compute SHA-256 hash of our identifying string
    const hash = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(stableString)
    );

    // Convert ArrayBuffer → hex string
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    // Graceful fallback if hashing unavailable
    return `fallback-${Math.random().toString(36).slice(2)}`;
  }
}