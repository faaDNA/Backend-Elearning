import { Course } from '../models/course-model';

const courseRepository = require('../repositories/course-repository');
const filesystem = require('../utilities/filesystem');

// dapatkan semua kursus
exports.getAllCourses = async (): Promise<Course[]> => {
  return await courseRepository.getAllCourses();
};

// dapatkan kursus dari slug
exports.getCourseBySlug = async (slug: string) => {
  const courses = await courseRepository.getCourseBySlug(slug);

  // cek 'falsy'
  if (!courses || courses.length === 0) {
    return null;
  }

  return courses;
};

// menambahkan kursus baru
exports.addCourse = async (data: Partial<Course>) => {
  const image = data.files.filter((file: any) => file.fieldname === 'image');

  const imagePath = await filesystem.upload(image[0], 'courses');
  data.image = imagePath;
  delete data.files;

  return await courseRepository.addCourse(data);
};

// mengubah kursus
exports.updateCourse = async (existingCourse: Course, data: Partial<Course>) => {
  if (data.files && data.files.length > 0) {
    const image = data.files.filter((file: any) => file.fieldname === 'image');
  
    const imagePath = await filesystem.update(existingCourse.image, image[0], 'courses');
    data.image = imagePath;
  }
  
  delete data.files;

  return await courseRepository.updateCourse(existingCourse.slug, data);
};

// menghapus kursus
exports.deleteCourse = async (existingCourse: Course) => {
  await filesystem.remove(existingCourse.image);

  return await courseRepository.deleteCourse(existingCourse.slug);
};
