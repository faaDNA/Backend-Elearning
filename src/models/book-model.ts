// Interface untuk data buku
export interface IBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publication_year: number;
  genre: string;
  description?: string;
  stock: number;
  price: number;
  created_at: Date;
  updated_at: Date;
}

// Data buku dalam memori (contoh data)
export const booksData: IBook[] = [
  {
    id: "1",
    title: "Laskar Pelangi",
    author: "Andrea Hirata",
    isbn: "9789792232417",
    publication_year: 2005,
    genre: "Fiction",
    description:
      "Novel tentang perjuangan anak-anak di Belitung untuk mendapatkan pendidikan",
    stock: 25,
    price: 75000,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: "2",
    title: "Bumi Manusia",
    author: "Pramoedya Ananta Toer",
    isbn: "9789799731240",
    publication_year: 1980,
    genre: "Historical Fiction",
    description: "Novel pertama dari Tetralogi Buru",
    stock: 30,
    price: 85000,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: "3",
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    isbn: "9780747532699",
    publication_year: 1997,
    genre: "Fantasy",
    description: "Petualangan penyihir muda Harry Potter",
    stock: 50,
    price: 120000,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: "4",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780060935467",
    publication_year: 1960,
    genre: "Classic Literature",
    description: "Novel klasik Amerika tentang keadilan dan prasangka",
    stock: 15,
    price: 95000,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: "5",
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    publication_year: 1949,
    genre: "Dystopian Fiction",
    description: "Novel dystopian tentang totalitarianisme",
    stock: 18,
    price: 89000,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
];
