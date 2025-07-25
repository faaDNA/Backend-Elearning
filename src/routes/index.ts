const router = require("express").Router();

// Handle semua route /users ke router user
router.use("/users", require("./user-routes"));

// Handle semua route /courses ke router course
router.use("/courses", require("./course-routes"));

module.exports = router;
