import { User } from "../models/user-model";

// cari user berdasarkan id nya
const findUserById = async (id: number): Promise<User | undefined> => {
  return await User.query().findById(id);
};
exports.findUserById = findUserById;

// dapatkan semua user
exports.getUsers = async (): Promise<User[]> => {
  return await User.query().select(
    "id",
    "name",
    "email",
    "role",
    "tanggal_lahir",
    "sudah_lulus",
    "skor_keseluruhan",
    "profile_picture",
    "created_at"
  );
};

// ubah data user
exports.updateUserById = async (
  id: number,
  input: Partial<User>
): Promise<User | undefined> => {
  const updatedUser = await User.query().patchAndFetchById(id, input);
  return updatedUser;
};

// hapus data user berdasarkan id nya
exports.deleteUserById = async (id: number): Promise<User | undefined> => {
  const user = await User.query().findById(id);
  if (!user) return undefined;

  await User.query().deleteById(id);
  return user;
};
