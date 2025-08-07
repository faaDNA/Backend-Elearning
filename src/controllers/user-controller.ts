import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/authenticated-request-type";

const userService = require("../services/user-service");
const filesystem = require("../utilities/filesystem");

// mendapatkan list users
exports.index = async (req: Request, res: Response) => {
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
    });
  }
};

// update user
exports.update = async (req: AuthenticatedRequest, res: Response) => {
  // cek apakah role = student
  // alur proses utama untuk update khusus endpoint. mahastudent

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
      message: "Berhasil update data user!",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Error internal server!",
    });
  }
};

// hapus user berdasarkan id nya
exports.deleteById = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.params.id;

  try {
    // cek apakah user ada
    const user = await userService.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User tidak ditemukan!",
      });
    }

    // hapus user
    const deletedUser = await userService.deleteUserById(userId);

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
    });
  }
};

// upload profile picture
exports.uploadProfilePicture = async (
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

    // Check if user exists
    const user = await userService.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User tidak ditemukan!",
      });
    }

    // Prepare file data for cloudinary
    const fileData = {
      data: req.file.buffer,
      name: req.file.originalname,
    };

    console.log("Uploading to cloudinary:", fileData.name);

    // Upload to cloudinary in 'profile-pictures' directory
    const uploadResult = await filesystem.upload(fileData, "profile-pictures");

    // If user has existing profile picture, remove it
    if (user.profile_picture) {
      try {
        await filesystem.remove(user.profile_picture);
      } catch (removeError) {
        console.warn("Failed to remove old profile picture:", removeError);
      }
    }

    // Update user with new profile picture URL
    const updatedUser = await userService.updateUserById(userId, {
      profile_picture: uploadResult.secure_url,
    });

    return res.status(200).json({
      statusCode: 200,
      message: "Profile picture uploaded successfully!",
      data: {
        profile_picture: uploadResult.secure_url,
        user: updatedUser,
      },
    });
  } catch (error: any) {
    console.error("Error uploading profile picture:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Error internal server!",
      error: error.message,
    });
  }
};

// remove profile picture
exports.removeProfilePicture = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user.id;

    // Check if user exists
    const user = await userService.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User tidak ditemukan!",
      });
    }

    if (!user.profile_picture) {
      return res.status(400).json({
        statusCode: 400,
        message: "No profile picture to remove!",
      });
    }

    // Remove from cloudinary
    try {
      await filesystem.remove(user.profile_picture);
    } catch (removeError) {
      console.warn(
        "Failed to remove profile picture from cloudinary:",
        removeError
      );
    }

    // Update user to remove profile picture
    const updatedUser = await userService.updateUserById(userId, {
      profile_picture: null,
    });

    return res.status(200).json({
      statusCode: 200,
      message: "Profile picture removed successfully!",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Error removing profile picture:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Error internal server!",
    });
  }
};

// get profile user sendiri
exports.getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;

    // cek apakah user ada
    const user = await userService.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User tidak ditemukan!",
      });
    }

    // hapus password dari response
    const { password, ...userWithoutPassword } = user;

    return res.status(200).json({
      statusCode: 200,
      message: "Berhasil mendapatkan profile user!",
      data: userWithoutPassword,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Error internal server!",
    });
  }
};
