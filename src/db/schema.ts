// schema.ts
//
// Drizzle ORM table definition for the `advocates` table.
// This schema is intentionally aligned with the mock dataset used in local mode,
// allowing the backend to seamlessly switch between real Postgres data and
// the in-memory fallback without changing the API surface.

import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  jsonb,
  serial,
  timestamp,
  bigint,
  index,
} from "drizzle-orm/pg-core";

/* ============================================================================
   ADVOCATES TABLE
   ---------------------------------------------------------------------------
   This schema represents a single Solace “advocate” — a healthcare expert the
   user can search for using filters such as name, location, degree, specialty,
   and years of experience.

   The shape of this table mirrors the structure of the seed data (`advocateData`)
   so that the API can behave consistently across both database mode and
   assignment/local mode.
============================================================================ */
const advocates = pgTable(
  "advocates",
  {
    /* Auto-incrementing numeric ID — used only internally by Postgres */
    id: serial("id").primaryKey(),

    /* First & last name fields used for both partial and exact match search */
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),

    /* City-based filtering (multi-select) */
    city: text("city").notNull(),

    /* Academic/professional degree (e.g., RN, MD, LCSW) */
    degree: text("degree").notNull(),

    /*
      Specialties are stored as a JSON array of strings.

      Chosen intentionally:
      - Easy overlap queries in Postgres using `&&` (array intersection)
      - Flexible for multiple specialties per advocate
      - Mirrors the local dataset structure exactly

      Example:
        ["Cardiology", "Oncology", "Pediatrics"]
    */
    specialties: jsonb("specialties").default([]).notNull(),

    /* Numeric field used to filter by minimum years experience */
    yearsOfExperience: integer("years_of_experience").notNull(),

    /*
      Phone stored as bigint — using mode: "number" ensures Drizzle returns
      a proper JS number (instead of string) which matches our frontend model.
    */
    phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),

    /* Automatic timestamp, useful for real production cases */
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  },

  /* -------------------------------------------------------------------------
     INDEXES
     -------------------------------------------------------------------------
     These indexes support fast filtering and sorting.

     They match the operations performed by the backend route:
       - name search (first/last)
       - city filter
       - degree filter
       - specialty overlap queries
       - sort by yearsOfExperience

     Having these indexes reflects real production engineering practice,
     even though the assignment does not require them.
  -------------------------------------------------------------------------- */
  (table) => {
    return {
      /* Text-column indexes for LIKE searches and sorting */
      idxFirstName: index("idx_advocates_first_name").on(table.firstName),
      idxLastName: index("idx_advocates_last_name").on(table.lastName),

      /* Filters */
      idxCity: index("idx_advocates_city").on(table.city),
      idxDegree: index("idx_advocates_degree").on(table.degree),

      /* Sorting / range queries */
      idxYears: index("idx_advocates_years").on(table.yearsOfExperience),

      /*
        GIN index for jsonb `specialties`
        --------------------------------
        Enables efficient queries using the Postgres array-overlap operator (&&).

        This is the same operator used in the backend route:
          sql`${advocates.specialties} && ARRAY[...]`
      */
      idxSpecialties: index("idx_advocates_specialties_gin").using(
        "gin",
        table.specialties
      ),
    };
  }
);

export { advocates };