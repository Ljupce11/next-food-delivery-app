import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL (or POSTGRES_URL) is not set.");
}

/**
 * Neon's HTTP query function. Each tagged-template call runs one query and
 * resolves to the result rows. Several writes can run atomically with
 * `sql.transaction([...])` (non-interactive: queries can't use each other's results).
 */
export const sql = neon(connectionString);
