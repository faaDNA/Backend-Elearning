import { Request, Response } from 'express';

const authService = require('../services/auth-service');

// registrasi user
exports.register = async (req: Request, res: Response) => {
  const input = req.body;
  const requiredFields: string[] = [
    'email', 'password', 'name',
  ];

  try {
    // cek apakah semua required fields ada di input
    if (!requiredFields.every(prop => prop in input)) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Input harus lengkap!',
      });
    }
    
    // cek apakah akun sudah terdaftar
    if (await authService.findUserByEmail(input.email)) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Akun sudah terdaftar!',
      });
    }

    // daftarkan akun ke penyimpanan data
    const registeredUser = await authService.register(input);

    return res.status(200).json({
      statusCode: 200,
      message: 'Akun baru telah terdaftar!',
      data: registeredUser,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Error internal server!',
    });
  }
};

// login user
exports.login = async (req: Request, res: Response) => {
  const input = req.body;
  const requiredFields: string[] = ['email', 'password'];

  try {
    // cek apakah semua required fields ada di input
    if (!requiredFields.every(prop => prop in input)) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Input harus lengkap!',
      });
    }

    // cek apakah akun belum terdaftar
    const user = await authService.findAccount(input.email, input.password);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Akun tidak ditemukan!',
      });
    }

    // otentikasi pengguna dengan memberikan JWT token
    const token = authService.authenticate(user);

    return res.status(200).json({
      statusCode: 200,
      message: 'Berhasil login!',
      data: { user, token },
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Error internal server!',
    });
  }
};
