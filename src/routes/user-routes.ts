const router = require("express").Router();

const userController = require("../controllers/user-controller");

// GET /api/users - ambil semua user
router.get("/", userController.index);
// GET /api/users/:id - ambil user berdasarkan id
router.get("/:id", userController.show);
// POST /api/users - tambah user baru
router.post("/", userController.create);
// PUT /api/users/:id - update user
router.put("/:id", userController.update);
// DELETE /api/users/:id - hapus user
router.delete("/:id", userController.delete);

module.exports = router;
