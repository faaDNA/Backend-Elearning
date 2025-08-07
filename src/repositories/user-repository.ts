import { User, UserData } from '../models/user-model';

exports.findByEmail = async (email: string): Promise<UserData | null> => {
  return User.findOne({ email }).exec();
};

exports.createUser = async (userData: Partial<UserData>): Promise<UserData> => {
  const user = new User(userData);
  return user.save();
};
