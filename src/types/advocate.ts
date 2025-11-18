// types/advocate.ts
//
// Strongly-typed data models for advocate records and API responses.
//
// These types are shared between:
//   • Server API route (/api/advocates)
//   • Client components (FiltersBar, table rendering, sorting)
//   • Mock-data fallback mode (local JSON array)
//
// Keeping these types centralized ensures the frontend and backend
// agree on the structure of an Advocate regardless of whether the
// data comes from Postgres or the mock dataset.

/* ------------------------------------------------------------
 * Advocate
 * ------------------------------------------------------------
 * Represents a single advocate record returned to the client.
 *
 * Note: The database provides an integer `id`, but when the API
 * runs in “mock-data mode” (fallback when DATABASE_URL is absent),
 * records do not have stable IDs. For React list keys, we attach
 * a client-generated `_id` via a hashing function.
 *
 * `_id` is therefore optional:
 *   - Present when using mock data
 *   - Not present when using DB rows unless explicitly attached
 */
export type Advocate = {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;

  // Client-generated, used only for React rendering in mock mode.
  _id?: string;
};

/* ------------------------------------------------------------
 * AdvocatesResponse
 * ------------------------------------------------------------
 * Uniform API response shape consumed by the frontend.
 *
 * The backend always responds with:
 *   {
 *     data: Advocate[];
 *     meta?: { ... } // Additional metadata included by the API
 *   }
 *
 * Only `data` is strictly required for the client’s rendering loop.
 */
export type AdvocatesResponse = {
  data: Advocate[];
  // meta?: { total: number; limit: number; offset: number; source: string };
  // (Meta is provided by the API but optional for client code)
};