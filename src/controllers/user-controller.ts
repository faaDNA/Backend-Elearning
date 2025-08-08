import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/authenticated-request-type";
import * as userService from "../services/user-service";
import * as cloudinaryUtil from "../utilities/filesystem/cloudinary";

// mendapatkan list users
export const index = async (req: Request, res: Response) => {
  try {
    const userData = await userService.getUsers();

    if (!userData || userData.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: "Data user kosong!",
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Sukses mendapatkan user!",
      data: userData,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Error internal server!",
      error: error.message,
    });
  }
};

// update user (self update)
export const update = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const input = req.body;

  try {
    // cek apakah user ada
    const user = await userService.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User tidak ditemukan!",
      });
    }

    // update data user
    const updatedUser = await userService.updateUserById(userId, input);

    return res.status(200).json({
      statusCode: 200,
      message: "Berhasil update user!",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Error internal server!",
      error: error.message,
    });
  }
};

// update user by admin (patch method - hanya admin yang bisa)
export const updateByAdmin = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { userId } = req.params;
  const input = req.body;

  try {
    // Check if requester is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        statusCode: 403,
        message: "Access denied! Only admin can update user data.",
      });
    }

    // cek apakah target user ada
    const user = await userService.findUserById(parseInt(userId));
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User tidak ditemukan!",
      });
    }

    // update data user
    const updatedUser = await userService.updateUserById(
      parseInt(userId),
      input
    );

    return res.status(200).json({
      statusCode: 200,
      message: "Berhasil update user data by admin!",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Error internal server!",
      error: error.message,
    });
  }
};

// hapus user berdasarkan ID (hanya admin)
export const destroy = async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;

  try {
    // Check if requester is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        statusCode: 403,
        message: "Access denied! Only admin can delete user data.",
      });
    }

    // cek apakah user ada
    const user = await userService.findUserById(parseInt(userId));
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User tidak ditemukan!",
      });
    }

    // hapus user
    const deletedUser = await userService.deleteUserById(parseInt(userId));

    return res.status(200).json({
      statusCode: 200,
      message: "Berhasil hapus user!",
      data: deletedUser,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Error internal server!",
      error: error.message,
    });
  }
};

// upload profile picture
export const uploadProfilePicture = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    console.log("Upload request received");
    console.log("File:", req.file);

    if (!req.file) {
      return res.status(400).json({
        statusCode: 400,
        message:
          "No file uploaded! Make sure to select a file in form-data with key 'profile_picture'.",
      });
    }

    const userId = req.user.id;
    const originalFileName = req.file.originalname;

    // Check if user exists
    const user = await userService.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User tidak ditemukan!",
      });
    }

    console.log("Uploading to cloudinary:", originalFileName);

    // Upload image to cloudinary
    const cloudinaryUrl = await cloudinaryUtil.upload(
      req.file,
      `user_profiles/user_${userId}_${Date.now()}`
    );

    // Update user dengan foto baru dan nama asli
    const updateData = {
      profile_picture: cloudinaryUrl,
      profile_picture_original_name: originalFileName,
      profile_picture_cloudinary_url: cloudinaryUrl,
    };

    // Hapus foto lama dari cloudinary jika ada
    if (user.profile_picture_cloudinary_url) {
      try {
        await cloudinaryUtil.remove(user.profile_picture_cloudinary_url);
        console.log("Old profile picture removed from Cloudinary");
      } catch (removeError) {
        console.warn("Failed to remove old profile picture:", removeError);
      }
    }

    const updatedUser = await userService.updateUserById(userId, updateData);

    return res.status(200).json({
      statusCode: 200,
      message: "Profile picture uploaded successfully!",
      data: {
        user: updatedUser,
        upload_info: {
          original_filename: originalFileName,
          cloudinary_url: cloudinaryUrl,
          upload_timestamp: new Date().toISOString(),
        },
      },
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Error uploading profile picture!",
      error: error.message,
    });
  }
};

// upload photo (alternative endpoint dengan field name "photo")
export const uploadPhoto = async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log("Upload photo request received");
    console.log("File:", req.file);

    if (!req.file) {
      return res.status(400).json({
        statusCode: 400,
        message:
          "File foto tidak ditemukan! Pastikan field name adalah 'photo'",
      });
    }

    const userId = req.user.id;
    const originalFileName = req.file.originalname;

    // Check if user exists
    const user = await userService.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User tidak ditemukan!",
      });
    }

    console.log("Uploading to cloudinary:", originalFileName);

    // Upload image to cloudinary
    const cloudinaryUrl = await cloudinaryUtil.upload(
      req.file,
      `user_profiles/user_${userId}_${Date.now()}`
    );

    // Update user dengan foto baru dan nama asli
    const updateData = {
      profile_picture: cloudinaryUrl,
      profile_picture_original_name: originalFileName,
      profile_picture_cloudinary_url: cloudinaryUrl,
    };

    // Hapus foto lama dari cloudinary jika ada
    if (user.profile_picture_cloudinary_url) {
      try {
        await cloudinaryUtil.remove(user.profile_picture_cloudinary_url);
        console.log("Old profile picture removed from Cloudinary");
      } catch (removeError) {
        console.warn("Failed to remove old profile picture:", removeError);
      }
    }

    const updatedUser = await userService.updateUserById(userId, updateData);

    return res.status(200).json({
      statusCode: 200,
      message: "Foto profil berhasil diupload!",
      data: {
        original_filename: originalFileName,
        cloudinary_url: cloudinaryUrl,
        user: updatedUser,
      },
    });
  } catch (error: any) {
    console.error("Upload photo error:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Gagal mengupload foto profil",
      error: error.message,
    });
  }
};

// mendapatkan detail user berdasarkan ID
export const show = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await userService.findUserById(parseInt(userId));

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User tidak ditemukan!",
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Sukses mendapatkan detail user!",
      data: user,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Error internal server!",
      error: error.message,
    });
  }
};
