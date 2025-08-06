const router = require('express').Router();

const authenticationMiddleware = require('../middlewares/authentication-middleware');
const onlyAdminMiddleware = require('../middlewares/only-admin-middleware');
const courseController = require('../controllers/course-controller');

// // GET /api/courses/enrolled
// router.get(
//   '/enrolled',
//   authenticationMiddleware,
//   courseController.enrolledCourses,
// );

// GET /api/courses
router.get('/', courseController.index);

// GET /api/courses/{slug}
router.get('/:slug', courseController.show);

// auth guard untuk operasi CUD
router.use(authenticationMiddleware, onlyAdminMiddleware);

// POST /api/courses
router.post('/', courseController.create);

// PATCH /api/courses/{slug}
router.patch('/:slug', courseController.update);

// DELETE /api/courses/{slug}
router.delete('/:slug', courseController.destroy);

module.exports = router;
