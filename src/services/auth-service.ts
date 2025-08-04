import { User } from "../models/user-model";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user-repository");

const JWT_SECRET = process.env.JWT_SECRET || "rahasia";

// cari user berdasarakan email
const findUserByEmail = async (email: string): Promise<User | undefined> => {
  return await User.query().findOne({ email });
};
exports.findUserByEmail = findUserByEmail;

// cari akun pengguna
exports.findAccount = async (
  email: string,
  password: string
): Promise<User | undefined> => {
  const user = await findUserByEmail(email);

  if (user) {
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      return user;
    }
  }

  return undefined;
};

// register user baru ke database
exports.register = async (input: Partial<User>): Promise<User> => {
  const hashedPassword = await bcrypt.hash(input.password, 10);

  const userData = {
    ...input,
    password: hashedPassword,
    role: input.role || "student",
    sudah_lulus: false,
    skor_keseluruhan: 0,
  };

  return await User.query().insert(userData);
};

// otentikasi pengguna dengan memberikan token JWT
exports.authenticate = (user: User) => {
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
