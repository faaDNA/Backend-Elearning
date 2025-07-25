const courseData = require("../data/courses");

exports.getCourses = () => {
  return courseData || [];
};

exports.getCourseById = (id: number) => {
  return courseData.find((course: any) => course.id === id);
};
