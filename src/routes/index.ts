const router = require("express").Router();

// handle semua route /api/auth ke router otentikasi
router.use("/auth", require("./auth-routes"));

// handle semua route /api/users ke router user
router.use("/users", require("./user-routes"));

// handle semua route /api/books ke router book
router.use("/books", require("./book-routes"));

// handle semua route /api/courses ke router course
router.use("/courses", require("./course-routes"));

module.exports = router;
