/**
 * Initiate SQL query builder
 */
import knexConfig from "./init";
import knexLib from "knex";

export const knex = knexLib(knexConfig);
export default knex;
