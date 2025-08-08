import { Router } from "express";
import authenticationMiddleware from "../middlewares/authentication-middleware";
import onlyAdminMiddleware from "../middlewares/only-admin-middleware";
import upload from "../middlewares/upload-middleware";
import * as userController from "../controllers/user-controller";

const router = Router();

// GET /api/users - list all users
router.get("/", userController.index);

// GET /api/users/:userId - get user by ID
router.get("/:userId", userController.show);

// PATCH /api/users - update own profile (authenticated users)
router.patch(
  "/",
  authenticationMiddleware as any,
  userController.update as any
);

// PATCH /api/users/:userId - update any user (only admin)
router.patch(
  "/:userId",
  authenticationMiddleware as any,
  onlyAdminMiddleware as any,
  userController.updateByAdmin as any
);

// DELETE /api/users/:userId - delete user (only admin)
router.delete(
  "/:userId",
  authenticationMiddleware as any,
  onlyAdminMiddleware as any,
  userController.destroy as any
);

// POST /api/users/upload-profile-picture - upload profile picture (authenticated users)
router.post(
  "/upload-profile-picture",
  authenticationMiddleware as any,
  upload.single("profile_picture"),
  userController.uploadProfilePicture as any
);

// POST /api/users/upload-photo - alternative endpoint for upload photo (authenticated users)
router.post(
  "/upload-photo",
  authenticationMiddleware as any,
  upload.single("photo"),
  userController.uploadPhoto as any
);

export default router;
