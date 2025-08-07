const router = require("express").Router();

const authenticationMiddleware = require("../middlewares/authentication-middleware");
const onlyAdminMiddleware = require("../middlewares/only-admin-middleware");
const onlyStudentMiddleware = require("../middlewares/only-student-middleware");
const uploadMiddleware = require("../middlewares/upload-middleware");
const userController = require("../controllers/user-controller");

// GET /api/users
router.get("/", userController.index);

// GET /api/users/students
router.get(
  "/students",
  // onlyRole('students'),
  authenticationMiddleware,
  // onlyStudentMiddleware,
  userController.index
);

// GET /api/users/profile - untuk lihat profile sendiri
router.get("/profile", authenticationMiddleware, userController.getProfile);

// PATCH /api/users
router.patch("/", authenticationMiddleware, userController.update);

// POST /api/users/upload-profile-picture
router.post(
  "/upload-profile-picture",
  authenticationMiddleware,
  uploadMiddleware.single("profile_picture"),
  userController.uploadProfilePicture
);

// DELETE /api/users/profile-picture
router.delete(
  "/profile-picture",
  authenticationMiddleware,
  userController.removeProfilePicture
);

// DELETE /api/users/:id -> hanya boleh oleh ADMIN
router.delete(
  "/:id",
  authenticationMiddleware,
  onlyAdminMiddleware,
  userController.deleteById
);

module.exports = router;
