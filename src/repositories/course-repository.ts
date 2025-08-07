import { CourseData, coursesData } from "../models/course-model";

export class CourseRepository {
  // Data courses disimpan dalam array (bukan database)
  private courses: CourseData[] = [...coursesData];

  // Helper untuk generate ID baru
  private generateId(): number {
    const maxId =
      this.courses.length > 0 ? Math.max(...this.courses.map((c) => c.id)) : 0;
    return maxId + 1;
  }

  // CREATE - Membuat course baru
  async createCourse(
    courseData: Omit<CourseData, "id" | "created_at" | "updated_at">
  ): Promise<CourseData> {
    const newCourse: CourseData = {
      ...courseData,
      id: this.generateId(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.courses.push(newCourse);
    return newCourse;
  }

  // READ - Mendapatkan semua courses dengan pagination
  async getAllCourses(
    page: number = 1,
    limit: number = 10
  ): Promise<{ courses: CourseData[]; total: number; totalPages: number }> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedCourses = this.courses.slice(startIndex, endIndex);
    const total = this.courses.length;
    const totalPages = Math.ceil(total / limit);

    return { courses: paginatedCourses, total, totalPages };
  }

  // READ - Mendapatkan course berdasarkan ID
  async getCourseById(id: number): Promise<CourseData | null> {
    return this.courses.find((course) => course.id === id) || null;
  }

  // READ - Mencari courses berdasarkan filter
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
  ): Promise<{ courses: CourseData[]; total: number; totalPages: number }> {
    let filteredCourses = this.courses.filter((course) => {
      let matches = true;

      if (filters.title) {
        matches =
          matches &&
          course.title.toLowerCase().includes(filters.title.toLowerCase());
      }
      if (filters.instructor) {
        matches =
          matches &&
          course.instructor
            .toLowerCase()
            .includes(filters.instructor.toLowerCase());
      }
      if (filters.category) {
        matches =
          matches &&
          course.category
            .toLowerCase()
            .includes(filters.category.toLowerCase());
      }
      if (filters.level) {
        matches =
          matches && course.level.toLowerCase() === filters.level.toLowerCase();
      }
      if (filters.minPrice !== undefined) {
        matches = matches && course.price >= filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        matches = matches && course.price <= filters.maxPrice;
      }
      if (filters.is_active !== undefined) {
        matches = matches && course.is_active === filters.is_active;
      }

      return matches;
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);
    const total = filteredCourses.length;
    const totalPages = Math.ceil(total / limit);

    return { courses: paginatedCourses, total, totalPages };
  }

  // READ - Mendapatkan courses yang aktif
  async getActiveCourses(): Promise<CourseData[]> {
    return this.courses.filter((course) => course.is_active);
  }

  // READ - Mendapatkan categories yang tersedia
  async getAvailableCategories(): Promise<string[]> {
    const categories = [
      ...new Set(this.courses.map((course) => course.category)),
    ];
    return categories;
  }

  // UPDATE - Memperbarui course berdasarkan ID
  async updateCourseById(
    id: number,
    updateData: Partial<CourseData>
  ): Promise<CourseData | null> {
    const courseIndex = this.courses.findIndex((course) => course.id === id);

    if (courseIndex === -1) {
      return null;
    }

    this.courses[courseIndex] = {
      ...this.courses[courseIndex],
      ...updateData,
      updated_at: new Date(),
    };

    return this.courses[courseIndex];
  }

  // UPDATE - Update status course (aktif/tidak aktif)
  async updateCourseStatus(
    id: number,
    is_active: boolean
  ): Promise<CourseData | null> {
    return this.updateCourseById(id, { is_active });
  }

  // UPDATE - Update participants course
  async updateParticipants(
    id: number,
    current_participants: number
  ): Promise<CourseData | null> {
    const course = await this.getCourseById(id);
    if (!course) return null;

    if (current_participants > course.max_participants) {
      throw new Error("Current participants cannot exceed max participants");
    }

    return this.updateCourseById(id, { current_participants });
  }

  // DELETE - Menghapus course berdasarkan ID
  async deleteCourseById(id: number): Promise<CourseData | null> {
    const courseIndex = this.courses.findIndex((course) => course.id === id);

    if (courseIndex === -1) {
      return null;
    }

    const deletedCourse = this.courses[courseIndex];
    this.courses.splice(courseIndex, 1);
    return deletedCourse;
  }
}
