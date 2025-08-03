const router = require("express").Router();

const authenticationMiddleware = require("../middlewares/authentication-middleware");
const courseController = require("../controllers/course-controller");

// Import new CRUD controllers
const {
  createCourse,
  getAllCourses,
  getCourseById,
  searchCourses,
  getActiveCourses,
  getAvailableCategories,
  updateCourse,
  updateCourseStatus,
  updateParticipants,
  deleteCourse,
} = require("../controllers/course-controller");

// Public routes (tidak perlu authentication)
router.get("/", getAllCourses); // GET /api/courses
router.get("/search", searchCourses); // GET /api/courses/search
router.get("/active", getActiveCourses); // GET /api/courses/active
router.get("/categories", getAvailableCategories); // GET /api/courses/categories
router.get("/:id", getCourseById); // GET /api/courses/:id

// Legacy endpoint - GET /api/courses/enrolled (perlu auth)
router.get(
  "/enrolled",
  authenticationMiddleware,
  courseController.enrolledCourses
);

// Admin routes (sementara tanpa auth untuk testing)
// Nanti bisa ditambahkan middleware admin
router.post("/", createCourse); // POST /api/courses
router.put("/:id", updateCourse); // PUT /api/courses/:id
router.patch("/:id/status", updateCourseStatus); // PATCH /api/courses/:id/status
router.patch("/:id/participants", updateParticipants); // PATCH /api/courses/:id/participants
router.delete("/:id", deleteCourse); // DELETE /api/courses/:id

module.exports = router;
