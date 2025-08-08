/**
 * Initiate Object Relational Mapping
 */
import { Model } from "objection";
// import softDelete from 'objection-softdelete';
import { knex } from "./query-builder";

// Initialize Knex with Model
Model.knex(knex);

// Register soft delete plugin (temporarily disabled)
// softDelete.register(Model, { deleteAttr: 'deleted_at' });

// Function to connect and test database connection
export const connectDB = async () => {
  try {
    // Test database connection
    await knex.raw("SELECT 1");
    console.log("✅ Database Connected Successfully");

    // Run migrations if needed
    const [batchNo, log] = await knex.migrate.latest();
    if (log.length === 0) {
      console.log("📄 Database is up to date");
    } else {
      console.log(`📄 Ran ${log.length} migrations`);
      console.log("Latest batch:", batchNo);
    }
  } catch (error) {
    console.error("❌ Database Connection Error:", error);
    throw error;
  }
};

export { Model };
export default Model;
