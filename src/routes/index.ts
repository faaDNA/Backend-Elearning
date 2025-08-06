const router = require('express').Router();

// handle semua route /api/auth ke router otentikasi
router.use('/auth', require('./auth-routes'));

// handle semua route /api/users ke router user
router.use('/users', require('./user-routes'));

router.use('/courses', require('./course-routes'));

module.exports = router;
