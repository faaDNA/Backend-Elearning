import 'tsconfig-paths/register';
import { Knex } from 'knex';
import { User } from '../../models/user-model';

const bcrypt = require('bcrypt');

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(User.tableName).del();

  const data: User[] = [
    {
      name: 'Test Admin',
      email: 'admin@elearning.com',
      password: await bcrypt.hash('rahasia', 10),
      role: 'admin',
    },
    {
      name: 'Test Student',
      email: 'student@elearning.com',
      password: await bcrypt.hash('rahasia', 10),
      role: 'student',
    },
  ];

  // Inserts seed entries
  await knex(User.tableName).insert(data);
};
