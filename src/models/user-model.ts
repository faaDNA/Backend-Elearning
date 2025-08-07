const Model = require("../config/database/orm");

export class User extends Model {
  static softDelete = false; // Disable soft delete untuk sementara
  static tableName = "users";

  id!: number;
  email!: string;
  password!: string;
  name?: string;
  tanggal_lahir?: string;
  sudah_lulus?: boolean;
  skor_keseluruhan?: number;
  role?: string;
  profile_picture?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
