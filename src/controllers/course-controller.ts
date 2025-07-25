import { Request, Response } from "express";

const courseService = require("../services/course-service");

exports.index = async (req: Request, res: Response) => {
  try {
    const courseData = courseService.getCourses();
    return res.status(200).json({
      statusCode: 200,
      message: "Sukses mendapatkan courses!",
      data: courseData,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.show = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const course = courseService.getCourseById(id);
    if (!course) {
      return res.status(404).json({ message: "Course tidak ditemukan" });
    }
    return res.status(200).json({
      statusCode: 200,
      message: "Sukses mendapatkan course!",
      data: course,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
