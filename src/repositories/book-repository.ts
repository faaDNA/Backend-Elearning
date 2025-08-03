import { IBook, booksData } from '../models/book-model';

export class BookRepository {
  // Data buku disimpan dalam array (bukan database)
  private books: IBook[] = [...booksData];

  // Helper untuk generate ID baru
  private generateId(): string {
    const maxId = this.books.length > 0 
      ? Math.max(...this.books.map(book => parseInt(book.id))) 
      : 0;
    return (maxId + 1).toString();
  }

  // CREATE - Membuat buku baru
  async createBook(bookData: Partial<IBook>): Promise<IBook> {
    const newBook: IBook = {
      id: this.generateId(),
      title: bookData.title!,
      author: bookData.author!,
      isbn: bookData.isbn!,
      publication_year: bookData.publication_year!,
      genre: bookData.genre!,
      description: bookData.description,
      stock: bookData.stock!,
      price: bookData.price!,
      created_at: new Date(),
      updated_at: new Date()
    };

    this.books.push(newBook);
    return newBook;
  }

  // READ - Mendapatkan semua buku dengan pagination
  async getAllBooks(page: number = 1, limit: number = 10): Promise<{ books: IBook[], total: number, totalPages: number }> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedBooks = this.books.slice(startIndex, endIndex);
    const total = this.books.length;
    const totalPages = Math.ceil(total / limit);

    return { books: paginatedBooks, total, totalPages };
  }

  // READ - Mendapatkan buku berdasarkan ID
  async getBookById(id: string): Promise<IBook | null> {
    return this.books.find(book => book.id === id) || null;
  }

  // READ - Mencari buku berdasarkan ISBN
  async getBookByISBN(isbn: string): Promise<IBook | null> {
    return this.books.find(book => book.isbn === isbn) || null;
  }

  // READ - Mencari buku berdasarkan filter
  async searchBooks(filters: {
    title?: string;
    author?: string;
    genre?: string;
    minPrice?: number;
    maxPrice?: number;
  }, page: number = 1, limit: number = 10): Promise<{ books: IBook[], total: number, totalPages: number }> {
    
    let filteredBooks = this.books.filter(book => {
      let matches = true;

      if (filters.title) {
        matches = matches && book.title.toLowerCase().includes(filters.title.toLowerCase());
      }
      if (filters.author) {
        matches = matches && book.author.toLowerCase().includes(filters.author.toLowerCase());
      }
      if (filters.genre) {
        matches = matches && book.genre.toLowerCase().includes(filters.genre.toLowerCase());
      }
      if (filters.minPrice) {
        matches = matches && book.price >= filters.minPrice;
      }
      if (filters.maxPrice) {
        matches = matches && book.price <= filters.maxPrice;
      }

      return matches;
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
    const total = filteredBooks.length;
    const totalPages = Math.ceil(total / limit);

    return { books: paginatedBooks, total, totalPages };
  }

  // UPDATE - Memperbarui buku berdasarkan ID
  async updateBookById(id: string, updateData: Partial<IBook>): Promise<IBook | null> {
    const bookIndex = this.books.findIndex(book => book.id === id);
    
    if (bookIndex === -1) {
      return null;
    }

    this.books[bookIndex] = {
      ...this.books[bookIndex],
      ...updateData,
      updated_at: new Date()
    };

    return this.books[bookIndex];
  }

  // UPDATE - Memperbarui stok buku
  async updateBookStock(id: string, newStock: number): Promise<IBook | null> {
    return this.updateBookById(id, { stock: newStock });
  }

  // DELETE - Menghapus buku berdasarkan ID
  async deleteBookById(id: string): Promise<IBook | null> {
    const bookIndex = this.books.findIndex(book => book.id === id);
    
    if (bookIndex === -1) {
      return null;
    }

    const deletedBook = this.books[bookIndex];
    this.books.splice(bookIndex, 1);
    return deletedBook;
  }

  // READ - Mendapatkan buku dengan stok tersedia
  async getBooksInStock(): Promise<IBook[]> {
    return this.books.filter(book => book.stock > 0);
  }

  // READ - Mendapatkan genre yang tersedia
  async getAvailableGenres(): Promise<string[]> {
    const genres = [...new Set(this.books.map(book => book.genre))];
    return genres;
  }
}
