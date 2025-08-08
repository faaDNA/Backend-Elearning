import { UserData } from "../models/user-model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userRepository from "../repositories/user-repository";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia";

/**
 * cari user berdasarakan email
 *
 * @param email
 * @returns
 */
export const findUserByEmail = async (
  email: string
): Promise<UserData | null> => {
  return await userRepository.findByEmail(email);
};

/**
 * cari akun pengguna
 *
 * @param email
 * @param password
 * @returns
 */
export const findAccount = async (
  email: string,
  password: string
): Promise<UserData | null> => {
  const user = await findUserByEmail(email);

  if (user) {
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      return user;
    }
  }

  return null;
};

/**
 * daftarkan pengguna
 *
 * @param input
 * @returns
 */
export const register = async (input: UserData): Promise<UserData> => {
  const hashedPassword = await bcrypt.hash(input.password, 10);
  input.password = hashedPassword;

  // secara default, assign role menjadi 'student'
  input.role = "student";

  return await userRepository.createUser(input);
};

/**
 * otentikasi pengguna dengan memberikan token JWT
 *
 * @param user
 * @returns
 */
export const authenticate = (user: UserData) => {
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
