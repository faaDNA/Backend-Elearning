const Model = require('../config/database/orm');

export class Course extends Model {
  static softDelete = true;
  static tableName = 'courses';

  id?: number;
  title!: string;
  slug!: string;
  description!: string;
  image!: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
