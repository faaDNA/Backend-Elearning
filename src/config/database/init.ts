/**
 * Database configuration
 */
import dotenv from "dotenv";
import path from "path";
import type { Knex } from "knex";

// Load environment variables
dotenv.config({
  path: path.resolve(
    process.cwd(),
    `.env${process.env.NODE_ENV === "test" ? ".test" : ""}`
  ),
});

const config: Knex.Config = {
  client: process.env.DATABASE_DRIVER || "pg",
  connection: process.env.NODE_ENV === "production" 
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    : process.env.DATABASE_URL,
  searchPath: process.env.DATABASE_SCHEMA?.split(",") || ["public"],
  migrations: {
    directory: path.resolve(__dirname, "../../database/migrations"),
  },
  seeds: {
    directory: path.resolve(__dirname, "../../database/seeders"),
  },
  pool: {
    min: process.env.NODE_ENV === "production" ? 1 : 2,
    max: process.env.NODE_ENV === "production" ? 3 : 10,
  },
  acquireConnectionTimeout: process.env.NODE_ENV === "production" ? 60000 : 30000,
};

export default config;
