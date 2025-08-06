import { User } from '../models/user-model';

exports.findByEmail = async (email: string): Promise<User | undefined> => {
  return User.query().findOne({ email });
};

exports.createUser = async (userData: Partial<User>): Promise<User> => {
  return User.query().insert(userData);
};
