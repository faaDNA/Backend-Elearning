const router = require("express").Router();

const authenticationMiddleware = require("../middlewares/authentication-middleware");
const onlyAdminMiddleware = require("../middlewares/only-admin-middleware");
const userController = require("../controllers/user-controller");

// GET /api/users - hanya boleh oleh ADMIN
router.get(
  "/",
  authenticationMiddleware,
  onlyAdminMiddleware,
  userController.index
);

// PATCH /api/users
router.patch("/", authenticationMiddleware, userController.update);

// PATCH /api/users/:id - hanya boleh oleh ADMIN
router.patch(
  "/:id",
  authenticationMiddleware,
  onlyAdminMiddleware,
  userController.updateById
);

// DELETE /api/users/:id -> hanya boleh oleh ADMIN
router.delete(
  "/:id",
  authenticationMiddleware,
  onlyAdminMiddleware,
  userController.deleteById
);

module.exports = router;
