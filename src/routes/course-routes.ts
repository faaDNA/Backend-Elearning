const router = require("express").Router();

const courseController = require("../controllers/course-controller");

// GET /api/courses - ambil semua courses
router.get("/", courseController.index);
// GET /api/courses/:id - ambil course berdasarkan id
router.get("/:id", courseController.show);

module.exports = router;
