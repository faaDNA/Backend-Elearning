import { Model } from "../config/database/orm";

export interface BookData {
  id?: number;
  title: string;
  description: string;
  author: string;
  isbn?: string;
  category: string;
  price: number;
  image?: string;
  stock: number;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export class Book extends Model implements BookData {
  static softDelete = true;
  static tableName = "books";

  id!: number;
  title!: string;
  description!: string;
  author!: string;
  isbn?: string;
  category!: string;
  price!: number;
  image?: string;
  stock!: number;
  is_active!: boolean;
  created_at?: Date;
  updated_at?: Date;

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "title",
        "description",
        "author",
        "category",
        "price",
        "stock",
      ],
      properties: {
        id: { type: "integer" },
        title: { type: "string", minLength: 1 },
        description: { type: "string", minLength: 1 },
        author: { type: "string", minLength: 1 },
        isbn: { type: "string" },
        category: { type: "string", minLength: 1 },
        price: { type: "number", minimum: 0 },
        image: { type: "string" },
        stock: { type: "integer", minimum: 0 },
        is_active: { type: "boolean" },
      },
    };
  }

  $beforeInsert() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }
}

// Sample data books untuk development
export const booksData: BookData[] = [
  {
    id: 1,
    title: "Laskar Pelangi",
    author: "Andrea Hirata",
    isbn: "9789792232417",
    category: "Fiction",
    description:
      "Novel tentang perjuangan anak-anak di Belitung untuk mendapatkan pendidikan",
    stock: 25,
    price: 75000,
    is_active: true,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: 2,
    title: "Bumi Manusia",
    author: "Pramoedya Ananta Toer",
    isbn: "9789799731240",
    category: "Historical Fiction",
    description: "Novel pertama dari Tetralogi Buru",
    stock: 30,
    price: 85000,
    is_active: true,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: 3,
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    isbn: "9780747532699",
    category: "Fantasy",
    description: "Petualangan penyihir muda Harry Potter",
    stock: 50,
    price: 120000,
    is_active: true,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: 4,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780060935467",
    category: "Classic Literature",
    description: "Novel klasik Amerika tentang keadilan dan prasangka",
    stock: 15,
    price: 95000,
    is_active: true,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: 5,
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    category: "Dystopian Fiction",
    description: "Novel dystopian tentang totalitarianisme",
    stock: 18,
    price: 89000,
    is_active: false,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
];
