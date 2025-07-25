import { UserData } from "../models/user-model";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const storedUsers = require("../data/user-data");

const JWT_SECRET = process.env.JWT_SECRET || "rahasia";

// cari user berdasarakan email
const findUserByEmail = (email: string): UserData | undefined => {
  console.log("Mencari user dengan email:", email);
  console.log("Total users tersimpan:", storedUsers.length);
  const user = storedUsers.find((user: UserData) => user.email === email);
  console.log("User ditemukan:", user ? user.email : "tidak ditemukan");
  return user;
};
exports.findUserByEmail = findUserByEmail;

// cari akun pengguna
exports.findAccount = async (
  email: string,
  password: string
): Promise<UserData | undefined> => {
  console.log("findAccount dipanggil dengan email:", email);
  const user = findUserByEmail(email);
  console.log("User dari findUserByEmail:", user);

  if (user) {
    console.log("Melakukan bcrypt compare...");
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isPasswordMatch);
    if (isPasswordMatch) {
      return user;
    }
  }

  return undefined;
};

// simpan user ke storedUsers (penyimpanan sementara)
exports.register = async (input: UserData): Promise<UserData> => {
  const hashedPassword = await bcrypt.hash(input.password, 10);
  input.password = hashedPassword;

  // secara default, assign role menjadi 'student'
  input.role = "student";

  // auto-increment id
  const maxId =
    storedUsers.length > 0
      ? Math.max(...storedUsers.map((user: UserData) => user.id))
      : 0;
  input.id = maxId + 1;

  storedUsers.push(input);

  return storedUsers[storedUsers.length - 1];
};

// otentikasi pengguna dengan memberikan token JWT
exports.authenticate = (user: UserData) => {
  const payload = {
    sub: user.id, // JWT subject claim
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
};
