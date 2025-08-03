import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/authenticated-request-type';

const userService = require('../services/user-service');

// mendapatkan list users
exports.index = async (req: Request, res: Response) => {
  try {
    const userData = userService.getUsers();

    if (!userData || userData.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Data user kosong!',
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Sukses mendapatkan user!',
      data: userData,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Error internal server!',
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
    const user = userService.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: 'User tidak ditemukan!',
      });
    }

    // update data user
    const updatedUser = userService.updateUserById(userId, input);

    return res.status(200).json({
      statusCode: 200,
      message: 'Berhasil update data user!',
      data: updatedUser,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Error internal server!',
    });
  }
};

// hapus user berdasarkan id nya
exports.deleteById = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.params.id;

  try {
    // cek apakah user ada
    const user = userService.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: 'User tidak ditemukan!',
      });
    }

    // hapus user
    const deletedUser = userService.deleteUserById(userId);

    return res.status(200).json({
      statusCode: 200,
      message: 'Berhasil hapus user!',
      data: deletedUser,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Error internal server!',
    });
  }
};
