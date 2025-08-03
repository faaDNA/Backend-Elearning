import { CourseRepository } from "../repositories/course-repository";
import { CourseData } from "../models/course-model";

export class CourseService {
  private courseRepository: CourseRepository;

  constructor() {
    this.courseRepository = new CourseRepository();
  }

  // CREATE - Membuat course baru
  async createCourse(courseData: {
    title: string;
    description: string;
    instructor: string;
    duration: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    category: string;
    price: number;
    max_participants: number;
    current_participants?: number;
    is_active?: boolean;
  }): Promise<CourseData> {
    try {
      // Validasi input
      this.validateCourseData(courseData);

      const newCourseData = {
        ...courseData,
        current_participants: courseData.current_participants || 0,
        is_active:
          courseData.is_active !== undefined ? courseData.is_active : true,
      };

      return await this.courseRepository.createCourse(newCourseData);
    } catch (error) {
      throw new Error(`Failed to create course: ${error}`);
    }
  }

  // READ - Mendapatkan semua courses dengan pagination
  async getAllCourses(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    courses: CourseData[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      if (page < 1 || limit < 1) {
        throw new Error("Page and limit must be positive numbers");
      }

      const result = await this.courseRepository.getAllCourses(page, limit);
      return {
        ...result,
        currentPage: page,
      };
    } catch (error) {
      throw new Error(`Failed to fetch courses: ${error}`);
    }
  }

  // READ - Mendapatkan course berdasarkan ID
  async getCourseById(id: number): Promise<CourseData> {
    try {
      if (!id || id < 1) {
        throw new Error("Valid course ID is required");
      }

      const course = await this.courseRepository.getCourseById(id);
      if (!course) {
        throw new Error("Course not found");
      }

      return course;
    } catch (error) {
      throw new Error(`Failed to fetch course: ${error}`);
    }
  }

  // READ - Mencari courses
  async searchCourses(
    filters: {
      title?: string;
      instructor?: string;
      category?: string;
      level?: string;
      minPrice?: number;
      maxPrice?: number;
      is_active?: boolean;
    },
    page: number = 1,
    limit: number = 10
  ): Promise<{
    courses: CourseData[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      if (page < 1 || limit < 1) {
        throw new Error("Page and limit must be positive numbers");
      }

      const result = await this.courseRepository.searchCourses(
        filters,
        page,
        limit
      );
      return {
        ...result,
        currentPage: page,
      };
    } catch (error) {
      throw new Error(`Failed to search courses: ${error}`);
    }
  }

  // READ - Mendapatkan courses aktif
  async getActiveCourses(): Promise<CourseData[]> {
    try {
      return await this.courseRepository.getActiveCourses();
    } catch (error) {
      throw new Error(`Failed to fetch active courses: ${error}`);
    }
  }

  // READ - Mendapatkan categories
  async getAvailableCategories(): Promise<string[]> {
    try {
      return await this.courseRepository.getAvailableCategories();
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error}`);
    }
  }

  // UPDATE - Memperbarui course
  async updateCourse(
    id: number,
    updateData: Partial<CourseData>
  ): Promise<CourseData> {
    try {
      if (!id || id < 1) {
        throw new Error("Valid course ID is required");
      }

      // Cek apakah course ada
      await this.getCourseById(id);

      // Validasi data yang akan diupdate (hanya field yang ada)
      this.validateUpdateData(updateData);

      const updatedCourse = await this.courseRepository.updateCourseById(
        id,
        updateData
      );
      if (!updatedCourse) {
        throw new Error("Failed to update course");
      }

      return updatedCourse;
    } catch (error) {
      throw new Error(`Failed to update course: ${error}`);
    }
  }

  // UPDATE - Update status course
  async updateCourseStatus(
    id: number,
    is_active: boolean
  ): Promise<CourseData> {
    try {
      if (!id || id < 1) {
        throw new Error("Valid course ID is required");
      }

      const updatedCourse = await this.courseRepository.updateCourseStatus(
        id,
        is_active
      );
      if (!updatedCourse) {
        throw new Error("Course not found");
      }

      return updatedCourse;
    } catch (error) {
      throw new Error(`Failed to update course status: ${error}`);
    }
  }

  // UPDATE - Enroll/unenroll participant
  async updateParticipants(
    id: number,
    current_participants: number
  ): Promise<CourseData> {
    try {
      if (!id || id < 1) {
        throw new Error("Valid course ID is required");
      }

      if (current_participants < 0) {
        throw new Error("Current participants cannot be negative");
      }

      const updatedCourse = await this.courseRepository.updateParticipants(
        id,
        current_participants
      );
      if (!updatedCourse) {
        throw new Error("Course not found");
      }

      return updatedCourse;
    } catch (error) {
      throw new Error(`Failed to update participants: ${error}`);
    }
  }

  // DELETE - Menghapus course
  async deleteCourse(id: number): Promise<CourseData> {
    try {
      if (!id || id < 1) {
        throw new Error("Valid course ID is required");
      }

      const deletedCourse = await this.courseRepository.deleteCourseById(id);
      if (!deletedCourse) {
        throw new Error("Course not found");
      }

      return deletedCourse;
    } catch (error) {
      throw new Error(`Failed to delete course: ${error}`);
    }
  }

  // HELPER - Validasi data course untuk create
  private validateCourseData(courseData: any): void {
    if (!courseData.title || courseData.title.trim().length < 3) {
      throw new Error("Course title must be at least 3 characters long");
    }

    if (!courseData.instructor || courseData.instructor.trim().length < 2) {
      throw new Error("Instructor name must be at least 2 characters long");
    }

    if (!courseData.description || courseData.description.trim().length < 10) {
      throw new Error("Course description must be at least 10 characters long");
    }

    if (courseData.price !== undefined && courseData.price < 0) {
      throw new Error("Course price cannot be negative");
    }

    if (
      courseData.max_participants !== undefined &&
      courseData.max_participants < 1
    ) {
      throw new Error("Max participants must be at least 1");
    }

    const validLevels = ["Beginner", "Intermediate", "Advanced"];
    if (courseData.level && !validLevels.includes(courseData.level)) {
      throw new Error(
        "Course level must be one of: Beginner, Intermediate, Advanced"
      );
    }
  }

  // HELPER - Validasi data course untuk update (hanya field yang ada)
  private validateUpdateData(updateData: any): void {
    if (updateData.title !== undefined) {
      if (!updateData.title || updateData.title.trim().length < 3) {
        throw new Error("Course title must be at least 3 characters long");
      }
    }

    if (updateData.instructor !== undefined) {
      if (!updateData.instructor || updateData.instructor.trim().length < 2) {
        throw new Error("Instructor name must be at least 2 characters long");
      }
    }

    if (updateData.description !== undefined) {
      if (
        !updateData.description ||
        updateData.description.trim().length < 10
      ) {
        throw new Error(
          "Course description must be at least 10 characters long"
        );
      }
    }

    if (updateData.price !== undefined && updateData.price < 0) {
      throw new Error("Course price cannot be negative");
    }

    if (
      updateData.max_participants !== undefined &&
      updateData.max_participants < 1
    ) {
      throw new Error("Max participants must be at least 1");
    }

    const validLevels = ["Beginner", "Intermediate", "Advanced"];
    if (updateData.level && !validLevels.includes(updateData.level)) {
      throw new Error(
        "Course level must be one of: Beginner, Intermediate, Advanced"
      );
    }
  }
}
