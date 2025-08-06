import { User } from '../models/user-model';
const storedUsers = require('../data/user-data');

// cari user berdasarkan id nya
const findUserById = (id: number): User | undefined => {
  return storedUsers.find((user: User) => user.id == id);
};
exports.findUserById = findUserById;

// dapatkan semua user
exports.getUsers = (): User => {
  const data: User = storedUsers;

  return data || [];
};

// ubah data user
exports.updateUserById = (
  id: number,
  input: User,
): User | undefined => {
  const user = findUserById(id);
  if (!user) return undefined;

  Object.assign(user, input);
  return user;
};

// hapus data user berdasarkan id nya
exports.deleteUserById = (
  id: number,
): User | undefined => {
  const user = findUserById(id);
  if (!user) return undefined;

  const index = storedUsers.indexOf(user);
  if (index !== -1) {
    storedUsers.splice(index, 1);
    return user;
  }

  return undefined;
};
