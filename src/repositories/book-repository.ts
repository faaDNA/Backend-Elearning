import { BookData, booksData } from "../models/book-model";

export class BookRepository {
  // Data buku disimpan dalam array (bukan database)
  private books: BookData[] = [...booksData];

  // Helper untuk generate ID baru
  private generateId(): number {
    const maxId =
      this.books.length > 0
        ? Math.max(...this.books.map((book) => book.id || 0))
        : 0;
    return maxId + 1;
  }

  // CREATE - Membuat buku baru
  async createBook(
    bookData: Omit<BookData, "id" | "created_at" | "updated_at">
  ): Promise<BookData> {
    const newBook: BookData = {
      id: this.generateId(),
      title: bookData.title,
      description: bookData.description,
      author: bookData.author,
      isbn: bookData.isbn,
      category: bookData.category,
      price: bookData.price,
      image: bookData.image,
      stock: bookData.stock,
      is_active: bookData.is_active,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.books.push(newBook);
    return newBook;
  }

  // READ - Mendapatkan semua buku dengan pagination
  async getAllBooks(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    books: BookData[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const total = this.books.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const books = this.books.slice(skip, skip + limit);

    return {
      books,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // READ - Mendapatkan buku berdasarkan ID
  async getBookById(id: string): Promise<BookData | null> {
    const bookId = parseInt(id);
    const book = this.books.find((book) => book.id === bookId);
    return book || null;
  }

  // READ - Mendapatkan buku berdasarkan ISBN
  async getBookByISBN(isbn: string): Promise<BookData | null> {
    const book = this.books.find((book) => book.isbn === isbn);
    return book || null;
  }

  // READ - Mencari buku dengan filter
  async searchBooks(
    filters: {
      title?: string;
      author?: string;
      category?: string;
      isbn?: string;
      minPrice?: number;
      maxPrice?: number;
      is_active?: boolean;
    },
    page: number = 1,
    limit: number = 10
  ): Promise<{
    books: BookData[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    let filteredBooks = this.books;

    // Apply filters
    if (filters.title) {
      filteredBooks = filteredBooks.filter((book) =>
        book.title.toLowerCase().includes(filters.title!.toLowerCase())
      );
    }

    if (filters.author) {
      filteredBooks = filteredBooks.filter((book) =>
        book.author.toLowerCase().includes(filters.author!.toLowerCase())
      );
    }

    if (filters.category) {
      filteredBooks = filteredBooks.filter((book) =>
        book.category.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }

    if (filters.isbn) {
      filteredBooks = filteredBooks.filter(
        (book) => book.isbn && book.isbn.includes(filters.isbn!)
      );
    }

    if (filters.minPrice) {
      filteredBooks = filteredBooks.filter(
        (book) => book.price >= filters.minPrice!
      );
    }

    if (filters.maxPrice) {
      filteredBooks = filteredBooks.filter(
        (book) => book.price <= filters.maxPrice!
      );
    }

    if (filters.is_active !== undefined) {
      filteredBooks = filteredBooks.filter(
        (book) => book.is_active === filters.is_active
      );
    }

    // Pagination
    const total = filteredBooks.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const books = filteredBooks.slice(skip, skip + limit);

    return {
      books,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // READ - Mendapatkan buku aktif
  async getActiveBooks(): Promise<BookData[]> {
    return this.books.filter((book) => book.is_active === true);
  }

  // READ - Mendapatkan kategori tersedia
  async getAvailableCategories(): Promise<string[]> {
    const categories = [...new Set(this.books.map((book) => book.category))];
    return categories.sort();
  }

  // UPDATE - Memperbarui buku
  async updateBook(
    id: string,
    updateData: Partial<BookData>
  ): Promise<BookData | null> {
    const bookId = parseInt(id);
    const bookIndex = this.books.findIndex((book) => book.id === bookId);

    if (bookIndex === -1) {
      return null;
    }

    const updatedBook = {
      ...this.books[bookIndex],
      ...updateData,
      updated_at: new Date(),
    };

    this.books[bookIndex] = updatedBook;
    return updatedBook;
  }

  // DELETE - Menghapus buku (soft delete)
  async deleteBook(id: string): Promise<BookData | null> {
    const bookId = parseInt(id);
    const bookIndex = this.books.findIndex((book) => book.id === bookId);

    if (bookIndex === -1) {
      return null;
    }

    // Soft delete - set is_active to false
    const deletedBook = {
      ...this.books[bookIndex],
      is_active: false,
      updated_at: new Date(),
    };

    this.books[bookIndex] = deletedBook;
    return deletedBook;
  }

  // UTILITY - Reset data ke data awal
  async resetData(): Promise<void> {
    this.books = [...booksData];
  }

  // UTILITY - Mendapatkan statistik buku
  async getBookStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    totalStock: number;
    categories: number;
  }> {
    const total = this.books.length;
    const active = this.books.filter((book) => book.is_active).length;
    const inactive = total - active;
    const totalStock = this.books.reduce((sum, book) => sum + book.stock, 0);
    const categories = [...new Set(this.books.map((book) => book.category))]
      .length;

    return {
      total,
      active,
      inactive,
      totalStock,
      categories,
    };
  }
}
