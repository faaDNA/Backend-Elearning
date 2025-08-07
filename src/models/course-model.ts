const Model = require("../config/database/orm");

export class Course extends Model {
  static softDelete = true;
  static tableName = "courses";

export interface CourseData {
  id: number;
  title: string;
  description: string;
  image!: string;
  instructor: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  price: number;
  max_participants: number;
  current_participants: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Sample data courses untuk development
export const coursesData: CourseData[] = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    description: "Belajar dasar-dasar JavaScript dari nol hingga mahir",
    instructor: "John Doe",
    duration: "8 weeks",
    level: "Beginner",
    category: "Programming",
    price: 500000,
    max_participants: 30,
    current_participants: 15,
    is_active: true,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: 2,
    title: "React Advanced",
    description: "Pelajari React untuk aplikasi web modern dan scalable",
    instructor: "Jane Smith",
    duration: "12 weeks",
    level: "Advanced",
    category: "Frontend",
    price: 750000,
    max_participants: 25,
    current_participants: 20,
    is_active: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date("2024-01-15"),
  },
  {
    id: 3,
    title: "Node.js Backend Development",
    description: "Bangun API dan backend yang robust dengan Node.js",
    instructor: "Mike Johnson",
    duration: "10 weeks",
    level: "Intermediate",
    category: "Backend",
    price: 650000,
    max_participants: 20,
    current_participants: 12,
    is_active: true,
    created_at: new Date("2024-02-01"),
    updated_at: new Date("2024-02-01"),
  },
  {
    id: 4,
    title: "Python Data Science",
    description: "Analisis data dengan Python dan libraries populer",
    instructor: "Sarah Wilson",
    duration: "14 weeks",
    level: "Intermediate",
    category: "Data Science",
    price: 800000,
    max_participants: 15,
    current_participants: 8,
    is_active: true,
    created_at: new Date("2024-02-15"),
    updated_at: new Date("2024-02-15"),
  },
  {
    id: 5,
    title: "Mobile App Development",
    description: "Buat aplikasi mobile dengan React Native",
    instructor: "David Brown",
    duration: "16 weeks",
    level: "Advanced",
    category: "Mobile",
    price: 900000,
    max_participants: 18,
    current_participants: 5,
    is_active: false,
    created_at: new Date("2024-03-01"),
    updated_at: new Date("2024-03-01"),
  },
];
