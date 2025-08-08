import { Router } from "express";
import authenticationMiddleware from "../middlewares/authentication-middleware";
import onlyAdminMiddleware from "../middlewares/only-admin-middleware";
import * as courseController from "../controllers/course-controller";

const router = Router();

// Public routes (tidak perlu authentication)
router.get("/", courseController.getAllCourses); // GET /api/courses
router.get("/search", courseController.searchCourses); // GET /api/courses/search
router.get("/active", courseController.getActiveCourses); // GET /api/courses/active
router.get("/categories", courseController.getAvailableCategories); // GET /api/courses/categories
router.get("/:id", courseController.getCourseById); // GET /api/courses/:id

// Admin routes - perlu autentikasi dan role admin
router.post(
  "/",
  authenticationMiddleware as any,
  onlyAdminMiddleware as any,
  courseController.createCourse as any
); // POST /api/courses (admin only)

router.patch(
  "/:id",
  authenticationMiddleware as any,
  onlyAdminMiddleware as any,
  courseController.updateCourse as any
); // PATCH /api/courses/:id (admin only)

router.patch(
  "/:id/status",
  authenticationMiddleware as any,
  onlyAdminMiddleware as any,
  courseController.updateCourseStatus as any
); // PATCH /api/courses/:id/status (admin only)

router.delete(
  "/:id",
  authenticationMiddleware as any,
  onlyAdminMiddleware as any,
  courseController.deleteCourse as any
); // DELETE /api/courses/:id (admin only)

export default router;
