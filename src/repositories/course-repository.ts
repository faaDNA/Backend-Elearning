import { Course } from '../models/course-model';

exports.getAllCourses = async (): Promise<Course[]> => {
  return await Course.query();
};

exports.getCourseBySlug = async (slug: string): Promise<Course> => {
  return await Course.query().findOne({ slug });
};

exports.addCourse = async (data: Partial<Course>): Promise<Course> => {
  return await Course.query().insert(data);
};

exports.updateCourse = async (slug: string, data: Partial<Course>): Promise<Course | undefined> => {
  return await Course.query().patch(data).where('slug', slug).returning('*').first();
};

exports.deleteCourse = async (slug: string): Promise<number> => {
  return await Course.query().delete().where('slug', slug);
};
