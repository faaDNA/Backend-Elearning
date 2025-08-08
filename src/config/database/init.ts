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
  connection: process.env.DATABASE_URL,
  searchPath: process.env.DATABASE_SCHEMA?.split(",") || ["public"],
  migrations: {
    directory: path.resolve(__dirname, "../../database/migrations"),
  },
  seeds: {
    directory: path.resolve(__dirname, "../../database/seeders"),
  },
  pool: {
    min: 2,
    max: 10,
  },
};

export default config;
