import { Model } from "../config/database/orm";

export interface UserData {
  id?: number;
  email: string;
  password: string;
  name?: string;
  tanggalLahir?: string;
  sudahLulus?: boolean;
  skorKeseluruhan?: number;
  role?: string;
  profile_picture?: string | null;
  profile_picture_original_name?: string | null;
  profile_picture_cloudinary_url?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class User extends Model implements UserData {
  static softDelete = false; // Disable soft delete untuk sementara
  static tableName = "users";

  id!: number;
  email!: string;
  password!: string;
  name?: string;
  tanggalLahir?: string;
  sudahLulus?: boolean;
  skorKeseluruhan?: number;
  role?: string;
  profile_picture?: string | null;
  profile_picture_original_name?: string | null;
  profile_picture_cloudinary_url?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "password"],
      properties: {
        id: { type: "integer" },
        email: { type: "string", format: "email" },
        password: { type: "string", minLength: 6 },
        name: { type: "string" },
        tanggalLahir: { type: "string", format: "date" },
        sudahLulus: { type: "boolean" },
        skorKeseluruhan: { type: "number" },
        role: { type: "string", enum: ["admin", "student"] },
        profile_picture: { type: "string" },
        profile_picture_original_name: { type: "string" },
        profile_picture_cloudinary_url: { type: "string" },
      },
    };
  }

  $beforeInsert() {
    this.created_at = new Date().toISOString();
    this.updated_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}
