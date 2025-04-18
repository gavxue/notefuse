import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("database url not found");
}

const connectionString = process.env.DATABASE_URL;

// create database client
const client = postgres(connectionString, {
  prepare: false,
  max: 3,
  idle_timeout: 20,
  connect_timeout: 10,
});

// initialize orm
const db = drizzle(client);

export { db };
