import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/authenticated-request-type";
import { CourseService } from "../services/course-service";

const courseService = new CourseService();

// CREATE - Membuat course baru
export const createCourse = async (req: Request, res: Response) => {
  try {
    // Validasi request body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is required",
      });
    }

    const course = await courseService.createCourse(req.body);
    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create course",
    });
  }
};

// READ - Mendapatkan semua courses
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await courseService.getAllCourses(page, limit);
    res.status(200).json({
      success: true,
      message: "Courses retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch courses",
    });
  }
};

// READ - Mendapatkan course berdasarkan ID
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const course = await courseService.getCourseById(id);
    res.status(200).json({
      success: true,
      message: "Course retrieved successfully",
      data: course,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Course not found",
    });
  }
};

// READ - Mencari courses
export const searchCourses = async (req: Request, res: Response) => {
  try {
    const filters = {
      title: req.query.title as string,
      instructor: req.query.instructor as string,
      category: req.query.category as string,
      level: req.query.level as string,
      minPrice: req.query.minPrice
        ? parseInt(req.query.minPrice as string)
        : undefined,
      maxPrice: req.query.maxPrice
        ? parseInt(req.query.maxPrice as string)
        : undefined,
      is_active: req.query.is_active
        ? req.query.is_active === "true"
        : undefined,
    };

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await courseService.searchCourses(filters, page, limit);
    res.status(200).json({
      success: true,
      message: "Courses searched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to search courses",
    });
  }
};

// READ - Mendapatkan courses aktif
export const getActiveCourses = async (req: Request, res: Response) => {
  try {
    const courses = await courseService.getActiveCourses();
    res.status(200).json({
      success: true,
      message: "Active courses retrieved successfully",
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch active courses",
    });
  }
};

// READ - Mendapatkan categories
export const getAvailableCategories = async (req: Request, res: Response) => {
  try {
    const categories = await courseService.getAvailableCategories();
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch categories",
    });
  }
};

// UPDATE - Memperbarui course
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    // Validasi ID
    if (isNaN(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "Valid course ID is required",
      });
    }

    // Validasi request body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body with update data is required",
      });
    }

    const course = await courseService.updateCourse(id, req.body);
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update course",
    });
  }
};

// UPDATE - Update status course
export const updateCourseStatus = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { is_active } = req.body;

    const course = await courseService.updateCourseStatus(id, is_active);
    res.status(200).json({
      success: true,
      message: "Course status updated successfully",
      data: course,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update course status",
    });
  }
};

// UPDATE - Update participants
export const updateParticipants = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { current_participants } = req.body;

    const course = await courseService.updateParticipants(
      id,
      current_participants
    );
    res.status(200).json({
      success: true,
      message: "Participants updated successfully",
      data: course,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update participants",
    });
  }
};

// DELETE - Menghapus course
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const course = await courseService.deleteCourse(id);
    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: course,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete course",
    });
  }
};

// Legacy method yang sudah ada - mendapatkan list kursus yang diikuti pengguna
exports.enrolledCourses = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const activeCourses = await courseService.getActiveCourses();

    if (!activeCourses || activeCourses.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: "Data kursus yang diikuti kosong!",
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Sukses mendapatkan kursus yang diikuti!",
      data: activeCourses,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Error internal server!",
    });
  }
};
