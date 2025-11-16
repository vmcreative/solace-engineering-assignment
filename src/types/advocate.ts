/* Advocate type
 * Represents the structure returned from `/api/advocates`.
 * Includes `_id` as a client-generated stable identifier used
 * for React list keys since the mock API provides none. */
export type Advocate = {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
  _id?: string; // Added client-side for stable React keys
};

/* API response shape for the /api/advocates endpoint. */
export type AdvocatesResponse = {
  data: Advocate[];
};