import { Model } from "../config/database/orm";
import { User } from "./user-model";
import { Course } from "./course-model";

export interface UserCourseData {
  id?: number;
  user_id: number;
  course_id: number;
  enrolled_at?: Date;
  completed_at?: Date;
  progress?: number;
}

export class UserCourse extends Model implements UserCourseData {
  static tableName = "user_courses";

  id?: number;
  user_id!: number;
  course_id!: number;
  enrolled_at?: Date;
  completed_at?: Date;
  progress?: number;

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "user_courses.user_id",
        to: "users.id",
      },
    },

    course: {
      relation: Model.BelongsToOneRelation,
      modelClass: Course,
      join: {
        from: "user_courses.course_id",
        to: "courses.id",
      },
    },
  };
}
