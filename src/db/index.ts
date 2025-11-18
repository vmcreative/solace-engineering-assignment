// db/index.ts
//
// Centralized Drizzle ORM database initialization.
//
// This file intentionally provides *two execution modes*:
//
//   1. **Database Mode**  
//      Used when the candidate configures Postgres (optional for the assignment).  
//      Drizzle connects through postgres-js using DATABASE_URL.
//
//   2. **No-DB / Assignment Mode**  
//      If DATABASE_URL is missing, we fall back to a no-op stub.  
//      This allows the rest of the application—including filters, sorting,
//      and API endpoints—to continue working entirely off the in-memory
//      `advocateData` dataset.
//
// This approach keeps the codebase production-like without forcing the
// reviewer to set up Postgres unless they want to test that path.

import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let db: PostgresJsDatabase;

/* ------------------------------------------------------------
 * DATABASE INITIALIZATION
 * ------------------------------------------------------------
 * If DATABASE_URL is not provided:
 *   - We log a warning for transparency
 *   - Export a typed no-op DB object so the API can still import `db`
 *   - The /api/advocates route will automatically fall back
 *     to the local dataset + client-side filtering logic
 *
 * If DATABASE_URL is provided:
 *   - Create a postgres-js client
 *   - Wrap it with Drizzle to produce a typed ORM instance
 */
if (!process.env.DATABASE_URL) {
  console.warn(
    "DATABASE_URL is not set — running in fallback mode using local mock data."
  );

  // A "fake" db typed as PostgresJsDatabase.
  // The API checks for db.select() before using it.
  db = {} as PostgresJsDatabase;
} else {
  // Real postgres-js client
  const queryClient = postgres(process.env.DATABASE_URL);

  // Drizzle ORM instance
  db = drizzle(queryClient);
}

export default db;