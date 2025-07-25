import { UserData } from "../models/user-model";

// contoh data LMS user
const users: UserData[] = [
  {
    id: 1,
    name: "User Pertama",
    email: "userpertama@elearning.com",
    password: "$2b$10$iDX6jyvDTkH8DxtxYeeThu81LPLQNb7xD10626EqLBCUtRK56G9hy",
    tanggalLahir: new Date("2005-01-01"),
    sudahLulus: false,
    skorKeseluruhan: 90,
    role: "admin",
  },
  {
    id: 2,
    name: "User Kedua",
    email: "userkedua@elearning.com",
    password: "$2b$10$iDX6jyvDTkH8DxtxYeeThu81LPLQNb7xD10626EqLBCUtRK56G9hy",
    tanggalLahir: new Date("2004-01-01"),
    sudahLulus: true,
    skorKeseluruhan: 85,
    role: "student",
  },
];

module.exports = users;
