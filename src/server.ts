import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes";
import { connectDB } from "./config/database/orm";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple test routes
app.get("/", (req, res) => {
  res.json({
    message: "Backend E-Learning API is running!",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "API endpoint is working!",
    version: "1.0.0",
  });
});

// Routes
app.use("/api", routes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    message: "Backend E-Learning API is running!",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      message: "Something went wrong!",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error",
    });
  }
);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Initialize database for production
let dbInitialized = false;

// Middleware to ensure database is connected
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await connectDB();
      console.log("✅ Database Connected Successfully");
      dbInitialized = true;
    } catch (error) {
      console.error("❌ Database connection failed:", error);
    }
  }
  next();
});

// Start server for local development only
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    try {
      // Initialize database
      await connectDB();

      app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`📝 API Documentation: http://localhost:${PORT}/api`);
      });
    } catch (error) {
      console.error("❌ Failed to start server:", error);
      process.exit(1);
    }
  }
};

// Only start server in development
if (process.env.NODE_ENV !== "production") {
  startServer();
}

// Export app for Vercel serverless function
export default app;
