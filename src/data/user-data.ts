import { UserData } from '../models/user-model';

// contoh data LMS user
const users: UserData[] = [
  {
    id: 1,
    name: 'User Pertama',
    email: 'userpertama@elearning.com',
    password: '$2b$10$tIyAxLWmdBX/x/TVDDkuIuPkrvau8kGPZTew23tu0Q90D4Mmo6aqi',
    tanggalLahir: new Date('2005-01-01'),
    sudahLulus: false,
    skorKeseluruhan: 90,
    role: 'admin',
  },
  {
    id: 2,
    name: 'User Kedua',
    email: 'userkedua@elearning.com',
    password: '$2b$10$tIyAxLWmdBX/x/TVDDkuIuPkrvau8kGPZTew23tu0Q90D4Mmo6aqi',
    tanggalLahir: new Date('2004-01-01'),
    sudahLulus: true,
    skorKeseluruhan: 85,
    role: 'student',
  },
];

module.exports = users;
