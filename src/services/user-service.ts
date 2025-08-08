import { UserData } from "../models/user-model";
import * as userRepository from "../repositories/user-repository";

// cari user berdasarkan id nya
export const findUserById = async (id: number): Promise<UserData | null> => {
  return await userRepository.findById(id);
};

// dapatkan semua user
export const getUsers = async (): Promise<UserData[]> => {
  return await userRepository.getAllUsers();
};

// ubah data user
export const updateUserById = async (
  id: number,
  input: Partial<UserData>
): Promise<UserData> => {
  return await userRepository.updateUser(id, input);
};

// hapus data user berdasarkan id nya
export const deleteUserById = async (id: number): Promise<number> => {
  return await userRepository.deleteUser(id);
};
