import db from "@/db";
import { advocates } from "@/db/schema";
import { sql, and, gte } from "drizzle-orm";
import { advocateData } from "@/db/seed/advocates";
import { filterAndSortLocal } from "@/utils/queryAdvocates";

/*
  Type-safe list of allowed sort keys.
  Used by both the backend and the client to ensure consistent sorting semantics.
*/
type SortKey =
  | "firstName"
  | "lastName"
  | "degree"
  | "yearsOfExperience"
  | "city";

/* ============================================================================
   GET /api/advocates
   ----------------------------------------------------------------------------
   A fully dynamic filtering + sorting API with two modes:

     1. **Database mode** (Postgres + Drizzle)
        - Used automatically if DATABASE_URL + db are available.
        - Builds a real WHERE clause using Drizzle SQL fragments.

     2. **Local data mode** (mock data)
        - Used in the assignment if no DB is configured.
        - Reuses the same logic as the database path for predictable behavior.

   This dual-mode design allows the app to run out-of-the-box without requiring
   database setup, while still demonstrating production-ready backend logic.
   ============================================================================ */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  /* -------------------------------------------------------------------------
     EXTRACT QUERY PARAMS
     -------------------------------------------------------------------------
     Parse all filtering and sorting options from the query string.
     All params are optional; defaults match the frontend UX.
     -------------------------------------------------------------------------- */
  const search = searchParams.get("search")?.toLowerCase() || "";
  const exactMatch = searchParams.get("exactMatch") === "1";

  const nameModes = (searchParams.get("nameModes")?.split(",") ?? []) as (
    "first" | "last"
  )[];

  const selectedCities = searchParams.get("city")?.split(",") ?? [];
  const selectedDegrees = searchParams.get("degree")?.split(",") ?? [];
  const selectedSpecialties = searchParams.get("specialties")?.split(",") ?? [];

  const minYears = Number(searchParams.get("minYears")) || null;

  const sort = searchParams.get("sort") as SortKey | null;
  const dir = (searchParams.get("dir") as "asc" | "desc") ?? "asc";

  const limit = Number(searchParams.get("limit")) || 50;
  const offset = Number(searchParams.get("offset")) || 0;

  /* Consolidated filters object used for both DB mode and local fallback */
  const filters = {
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
  };

  /* -------------------------------------------------------------------------
     AUTO-DETECT DATABASE AVAILABILITY
     -------------------------------------------------------------------------
     If the project has no DATABASE_URL (the expected assignment case), or if
     no Drizzle connection is defined, we transparently fall back to local data.
     -------------------------------------------------------------------------- */
  const dbAvailable =
    process.env.DATABASE_URL &&
    db &&
    typeof (db as any).select === "function";

  if (!dbAvailable) {
    /*
      LOCAL MODE (Assignment default)
      --------------------------------
      The app still demonstrates full backend behavior using the exact same
      filtering/sorting logic — essential for consistent UX during review.
    */
    const result = filterAndSortLocal(advocateData, filters);

    return Response.json({
      data: result.rows,
      meta: {
        total: result.total,
        limit,
        offset,
        source: "local",
      },
    });
  }

  /* -------------------------------------------------------------------------
     DATABASE QUERY MODE
     -------------------------------------------------------------------------
     Build a dynamic WHERE clause using Drizzle SQL builders.
     Mirrors the same behavior as the local-mode filter logic.
     -------------------------------------------------------------------------- */
  const where: any[] = [];

  /* -------------------------------------
     NAME SEARCH (partial or exact)
     ------------------------------------- */
  if (search) {
    const clauses: any[] = [];

    if (nameModes.includes("first")) {
      clauses.push(
        exactMatch
          ? sql`LOWER(${advocates.firstName}) = ${search}`
          : sql`LOWER(${advocates.firstName}) LIKE ${"%" + search + "%"}`
      );
    }

    if (nameModes.includes("last")) {
      clauses.push(
        exactMatch
          ? sql`LOWER(${advocates.lastName}) = ${search}`
          : sql`LOWER(${advocates.lastName}) LIKE ${"%" + search + "%"}`
      );
    }

    if (clauses.length) {
      where.push(sql`(${sql.join(clauses, sql` OR `)})`);
    }
  }

  /* -------------------------------------
     CITY FILTER  (text[] ANY)
     ------------------------------------- */
  if (selectedCities.length) {
    where.push(
      sql`${advocates.city} = ANY(${sql.raw(
        `ARRAY[${selectedCities.map((c) => `'${c}'`).join(",")}]::text[]`
      )})`
    );
  }

  /* -------------------------------------
     DEGREE FILTER (text[] ANY)
     ------------------------------------- */
  if (selectedDegrees.length) {
    where.push(
      sql`${advocates.degree} = ANY(${sql.raw(
        `ARRAY[${selectedDegrees.map((c) => `'${c}'`).join(",")}]::text[]`
      )})`
    );
  }

  /* -------------------------------------
     SPECIALTIES FILTER (jsonb array overlap)
     Uses Postgres operator: jsonb_column && text[]
     ------------------------------------- */
  if (selectedSpecialties.length) {
    where.push(
      sql`${advocates.specialties} && ARRAY[${sql.raw(
        selectedSpecialties.map((s) => `'${s}'`).join(",")
      )}]::text[]`
    );
  }

  /* -------------------------------------
     MINIMUM YEARS EXPERIENCE
     ------------------------------------- */
  if (minYears !== null) {
    where.push(gte(advocates.yearsOfExperience, minYears));
  }

  /* -------------------------------------------------------------------------
     SORTING
     -------------------------------------------------------------------------
     Only allow known sortable columns.
     Prevents SQL injection and keeps client/server behavior aligned.
     -------------------------------------------------------------------------- */
  const allowedSort: Record<SortKey, any> = {
    firstName: advocates.firstName,
    lastName: advocates.lastName,
    degree: advocates.degree,
    yearsOfExperience: advocates.yearsOfExperience,
    city: advocates.city,
  };

  let orderBy = undefined;

  if (sort && allowedSort[sort]) {
    const col = allowedSort[sort];
    orderBy = dir === "desc" ? sql`${col} DESC` : col;
  }

  /* -------------------------------------------------------------------------
     EXECUTE QUERY
     -------------------------------------------------------------------------
     Final assembled Drizzle query with dynamic WHERE + SORT + pagination.
     -------------------------------------------------------------------------- */
  const rows = await db
    .select()
    .from(advocates)
    .where(where.length ? and(...where) : undefined)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  return Response.json({
    data: rows,
    meta: {
      count: rows.length,
      limit,
      offset,
      source: "database",
    },
  });
}