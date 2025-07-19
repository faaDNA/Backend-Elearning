import { UserData } from '../models/user-model';

// contoh data LMS user
const users: UserData[] = [
  {
    id: 1,
    name: 'User Pertama',
    email: 'userpertama@elearning.com',
    password: 'rahasia',
    tanggalLahir: new Date('2005-01-01'),
    sudahLulus: false,
    skorKeseluruhan: 90,
  },
  {
    id: 2,
    name: 'User Kedua',
    email: 'userkedua@elearning.com',
    password: 'rahasia',
    tanggalLahir: new Date('2004-01-01'),
    sudahLulus: true,
    skorKeseluruhan: 85,
  },
];

module.exports = users;
