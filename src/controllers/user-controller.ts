import { Request, Response } from "express";

const userService = require("../services/user-service");
exports.index = async (req: Request, res: Response) => {
  try {
    const userData = userService.getUsers();

    return res.status(200).json({
      statusCode: 200,
      message: "Sukses mendapatkan user!",
      data: userData,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.show = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    return res.status(200).json({
      statusCode: 200,
      message: "Sukses mendapatkan user!",
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.create = async (req: Request, res: Response) => {
  try {
    const newUser = userService.createUser(req.body);
    return res.status(201).json({
      statusCode: 201,
      message: "User berhasil dibuat!",
      data: newUser,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.update = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updatedUser = userService.updateUser(id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    return res.status(200).json({
      statusCode: 200,
      message: "User berhasil diupdate!",
      data: updatedUser,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.delete = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = userService.deleteUser(id);
    if (!deleted) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    return res.status(200).json({
      statusCode: 200,
      message: "User berhasil dihapus!",
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
