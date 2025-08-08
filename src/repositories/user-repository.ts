import { User, UserData } from "../models/user-model";

export const findByEmail = async (email: string): Promise<UserData | null> => {
  const result = await User.query().findOne({ email });
  return result || null;
};

export const createUser = async (
  userData: Partial<UserData>
): Promise<UserData> => {
  return User.query().insert(userData);
};

export const findById = async (id: number): Promise<UserData | null> => {
  const result = await User.query().findById(id);
  return result || null;
};

export const updateUser = async (
  id: number,
  userData: Partial<UserData>
): Promise<UserData> => {
  return User.query().patchAndFetchById(id, userData);
};

export const deleteUser = async (id: number): Promise<number> => {
  return User.query().deleteById(id);
};

export const getAllUsers = async (): Promise<UserData[]> => {
  return User.query();
};
