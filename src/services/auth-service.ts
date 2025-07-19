import { UserData } from '../models/user-model';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const storedUsers = require('../data/user-data');

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia';

// cari user berdasarakan email
const findUserByEmail = (email: string): UserData | undefined => {
  return storedUsers.find((user: UserData) => user.email === email);
};
exports.findUserByEmail = findUserByEmail;

// cari akun pengguna
exports.findAccount = async (
  email: string,
  password: string,
): Promise<UserData | undefined> => {
  const user = findUserByEmail(email);

  if (user) {
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      return user;
    }
  }

  return undefined;
};

// simpan user ke storedUsers (penyimpanan sementara)
exports.register = async (
  input: UserData,
): Promise<UserData> => {
  const hashedPassword = await bcrypt.hash(input.password, 10);
  input.password = hashedPassword;

  // secara default, assign role menjadi 'student'
  input.role = 'student';

  // auto-increment id
  const maxId = storedUsers.length > 0
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
    expiresIn: '1h',
  });

  return token;
};
