// import { neon, neonConfig } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";

// if (!process.env.DATABASE_URL) {
//   throw new Error("database url not found");
// }

// const sql = neon(process.env.DATABASE_URL);

// export const db = drizzle(sql);

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("database url not found");
}

const connectionString = process.env.DATABASE_URL;

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

export { db };
