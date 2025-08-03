import mongoose, { Schema, Document } from 'mongoose';

export interface UserCourseData extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  enrolledAt: Date;
}

const UserCourseSchema = new Schema<UserCourseData>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Memastikan keunikan (1 user punya 1 course entry)
UserCourseSchema.index({ user: 1, course: 1 }, { unique: true });

export const UserCourse = mongoose.model<UserCourseData>('UserCourse', UserCourseSchema);
