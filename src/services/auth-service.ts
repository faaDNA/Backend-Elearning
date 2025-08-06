import { User } from '../models/user-model';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user-repository');

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia';

/**
 * cari user berdasarakan email
 * 
 * @param email 
 * @returns 
 */
const findUserByEmail = async (
  email: string,
): Promise<User | undefined> => {
  return await userRepository.findByEmail(email);
};

/**
 * cari akun pengguna
 * 
 * @param email 
 * @param password 
 * @returns 
 */
const findAccount = async (
  email: string,
  password: string,
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

/**
 * daftarkan pengguna
 * 
 * @param input 
 * @returns 
 */
const register = async (
  input: User,
): Promise<User> => {
  const hashedPassword = await bcrypt.hash(input.password, 10);
  input.password = hashedPassword;

  // secara default, assign role menjadi 'student'
  input.role = 'student';

  return await userRepository.createUser(input);
};

/**
 * otentikasi pengguna dengan memberikan token JWT
 * 
 * @param user 
 * @returns 
 */
const authenticate = (
  user: User,
) => {
  const payload = {
    sub: user.id, // JWT subject claim
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h',
  });

  return token;
};

module.exports = {
  findUserByEmail,
  findAccount,
  register,
  authenticate,
};
