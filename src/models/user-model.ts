const Model = require("../config/database/orm");

export class User extends Model {
  static softDelete = true;
  static tableName = "users";

  id?: number;
  name!: string;
  email!: string;
  password!: string;
  role!: string;
  tanggalLahir: Date;
  sudahLulus: boolean;
  skorKeseluruhan: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
