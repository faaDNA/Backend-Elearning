import "tsconfig-paths/register";
import { Knex } from "knex";
import { User, UserData } from "../../models/user-model";
const bcrypt = require("bcrypt");

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(User.tableName).del();

  const data: UserData[] = [
    {
      name: "Test Admin",
      email: "admin@elearning.com",
      password: await bcrypt.hash("rahasia", 10),
      role: "admin",
      tanggalLahir: "1990-01-01",
      sudahLulus: true,
      skorKeseluruhan: 100,
    },
    {
      name: "Test Student",
      email: "student@elearning.com",
      password: await bcrypt.hash("rahasia", 10),
      role: "student",
      tanggalLahir: "1995-05-15",
      sudahLulus: false,
      skorKeseluruhan: 75,
    },
  ];

  // Inserts seed entries
  await knex(User.tableName).insert(data);
}
