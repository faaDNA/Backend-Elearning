import { BookRepository } from "../repositories/book-repository";
import { BookData } from "../models/book-model";

export class BookService {
  private bookRepository: BookRepository;

  constructor() {
    this.bookRepository = new BookRepository();
  }

  // CREATE - Membuat buku baru
  async createBook(
    bookData: Omit<BookData, "id" | "created_at" | "updated_at">
  ): Promise<BookData> {
    try {
      // Validasi input
      this.validateBookData(bookData);

      // Cek apakah ISBN sudah ada (jika ISBN disediakan)
      if (bookData.isbn) {
        const existingBook = await this.bookRepository.getBookByISBN(
          bookData.isbn
        );
        if (existingBook) {
          throw new Error("Book with this ISBN already exists");
        }
      }

      return await this.bookRepository.createBook(bookData);
    } catch (error) {
      throw new Error(`Failed to create book: ${error}`);
    }
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
    try {
      return await this.bookRepository.getAllBooks(page, limit);
    } catch (error) {
      throw new Error(`Failed to get books: ${error}`);
    }
  }

  // READ - Mendapatkan buku berdasarkan ID
  async getBookById(id: number): Promise<BookData> {
    try {
      if (!id) {
        throw new Error("Book ID is required");
      }

      const book = await this.bookRepository.getBookById(id.toString());
      if (!book) {
        throw new Error("Book not found");
      }

      return book;
    } catch (error) {
      throw new Error(`Failed to get book: ${error}`);
    }
  }

  // READ - Mencari buku
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
    try {
      return await this.bookRepository.searchBooks(filters, page, limit);
    } catch (error) {
      throw new Error(`Failed to search books: ${error}`);
    }
  }

  // READ - Mendapatkan buku aktif
  async getActiveBooks(): Promise<BookData[]> {
    try {
      return await this.bookRepository.getActiveBooks();
    } catch (error) {
      throw new Error(`Failed to get active books: ${error}`);
    }
  }

  // READ - Mendapatkan kategori tersedia
  async getAvailableCategories(): Promise<string[]> {
    try {
      return await this.bookRepository.getAvailableCategories();
    } catch (error) {
      throw new Error(`Failed to get categories: ${error}`);
    }
  }

  // UPDATE - Memperbarui buku
  async updateBook(
    id: number,
    updateData: Partial<BookData>
  ): Promise<BookData> {
    try {
      if (!id) {
        throw new Error("Book ID is required");
      }

      // Validasi data yang akan diupdate
      if (updateData.title && updateData.title.length < 1) {
        throw new Error("Title cannot be empty");
      }

      if (updateData.price && updateData.price < 0) {
        throw new Error("Price cannot be negative");
      }

      if (updateData.stock && updateData.stock < 0) {
        throw new Error("Stock cannot be negative");
      }

      const book = await this.bookRepository.updateBook(
        id.toString(),
        updateData
      );
      if (!book) {
        throw new Error("Book not found");
      }

      return book;
    } catch (error) {
      throw new Error(`Failed to update book: ${error}`);
    }
  }

  // UPDATE - Update stok buku
  async updateBookStock(id: number, stock: number): Promise<BookData> {
    try {
      if (!id) {
        throw new Error("Book ID is required");
      }

      if (stock < 0) {
        throw new Error("Stock cannot be negative");
      }

      const book = await this.bookRepository.updateBook(id.toString(), {
        stock,
      });
      if (!book) {
        throw new Error("Book not found");
      }

      return book;
    } catch (error) {
      throw new Error(`Failed to update book stock: ${error}`);
    }
  }

  // DELETE - Menghapus buku
  async deleteBook(id: number): Promise<BookData> {
    try {
      if (!id) {
        throw new Error("Book ID is required");
      }

      const book = await this.bookRepository.deleteBook(id.toString());
      if (!book) {
        throw new Error("Book not found");
      }

      return book;
    } catch (error) {
      throw new Error(`Failed to delete book: ${error}`);
    }
  }

  // Helper - Validasi data buku
  private validateBookData(bookData: any): void {
    if (!bookData.title || bookData.title.length < 1) {
      throw new Error("Title is required and cannot be empty");
    }

    if (!bookData.author || bookData.author.length < 1) {
      throw new Error("Author is required and cannot be empty");
    }

    if (!bookData.category || bookData.category.length < 1) {
      throw new Error("Category is required and cannot be empty");
    }

    if (bookData.price && bookData.price < 0) {
      throw new Error("Price cannot be negative");
    }

    if (bookData.stock && bookData.stock < 0) {
      throw new Error("Stock cannot be negative");
    }
  }

  // Helper - Mendapatkan buku berdasarkan ISBN
  async getBookByISBN(isbn: string): Promise<BookData | null> {
    try {
      return await this.bookRepository.getBookByISBN(isbn);
    } catch (error) {
      throw new Error(`Failed to get book by ISBN: ${error}`);
    }
  }
}
