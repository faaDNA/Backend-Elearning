import { Router } from "express";
import authRoutes from "./auth-routes";
import userRoutes from "./user-routes";
import bookRoutes from "./book-routes";
import courseRoutes from "./course-routes";

const router = Router();

// handle semua route /api/auth ke router otentikasi
router.use("/auth", authRoutes);

// handle semua route /api/users ke router user
router.use("/users", userRoutes);

// handle semua route /api/books ke router book
router.use("/books", bookRoutes);

// handle semua route /api/courses ke router course
router.use("/courses", courseRoutes);

// API documentation endpoint
router.get("/", (req, res) => {
  res.json({
    message: "E-Learning API Documentation",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth - Authentication endpoints",
      users: "/api/users - User management endpoints",
      books: "/api/books - Book management endpoints",
      courses: "/api/courses - Course management endpoints",
    },
  });
});

export default router;
