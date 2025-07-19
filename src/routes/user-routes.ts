const router = require('express').Router();

const authMiddleware = require('../middlewares/auth-middleware');
const userController = require('../controllers/user-controller');

// GET /api/users
router.get('/', userController.index);

// PATCH /api/users
router.patch('/', authMiddleware, userController.update);

module.exports = router;
