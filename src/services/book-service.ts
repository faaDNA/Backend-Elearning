import { BookRepository } from "../repositories/book-repository";
import { IBook } from "../models/book-model";

export class BookService {
  private bookRepository: BookRepository;

  constructor() {
    this.bookRepository = new BookRepository();
  }

  // CREATE - Membuat buku baru
  async createBook(bookData: {
    title: string;
    author: string;
    isbn: string;
    publication_year: number;
    genre: string;
    description?: string;
    stock: number;
    price: number;
  }): Promise<IBook> {
    try {
      // Validasi input
      this.validateBookData(bookData);

      // Cek apakah ISBN sudah ada
      const existingBook = await this.bookRepository.getBookByISBN(
        bookData.isbn
      );
      if (existingBook) {
        throw new Error("Book with this ISBN already exists");
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
    books: IBook[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      if (page < 1 || limit < 1) {
        throw new Error("Page and limit must be positive numbers");
      }

      const result = await this.bookRepository.getAllBooks(page, limit);
      return {
        ...result,
        currentPage: page,
      };
    } catch (error) {
      throw new Error(`Failed to fetch books: ${error}`);
    }
  }

  // READ - Mendapatkan buku berdasarkan ID
  async getBookById(id: string): Promise<IBook> {
    try {
      if (!id) {
        throw new Error("Book ID is required");
      }

      const book = await this.bookRepository.getBookById(id);
      if (!book) {
        throw new Error("Book not found");
      }

      return book;
    } catch (error) {
      throw new Error(`Failed to fetch book: ${error}`);
    }
  }

  // READ - Mencari buku
  async searchBooks(
    filters: {
      title?: string;
      author?: string;
      genre?: string;
      minPrice?: number;
      maxPrice?: number;
    },
    page: number = 1,
    limit: number = 10
  ): Promise<{
    books: IBook[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      if (page < 1 || limit < 1) {
        throw new Error("Page and limit must be positive numbers");
      }

      const result = await this.bookRepository.searchBooks(
        filters,
        page,
        limit
      );
      return {
        ...result,
        currentPage: page,
      };
    } catch (error) {
      throw new Error(`Failed to search books: ${error}`);
    }
  }

  // UPDATE - Memperbarui buku
  async updateBook(id: string, updateData: Partial<IBook>): Promise<IBook> {
    try {
      if (!id) {
        throw new Error("Book ID is required");
      }

      // Cek apakah buku ada
      await this.getBookById(id);

      // Jika ISBN diubah, cek apakah ISBN baru sudah digunakan
      if (updateData.isbn) {
        const existingBook = await this.bookRepository.getBookByISBN(
          updateData.isbn
        );
        if (existingBook && existingBook.id !== id) {
          throw new Error("Book with this ISBN already exists");
        }
      }

      // Validasi data yang akan diupdate
      if (
        updateData.title ||
        updateData.author ||
        updateData.isbn ||
        updateData.publication_year ||
        updateData.genre ||
        updateData.stock !== undefined ||
        updateData.price !== undefined
      ) {
        this.validateBookData(updateData as any, true);
      }

      const updatedBook = await this.bookRepository.updateBookById(
        id,
        updateData
      );
      if (!updatedBook) {
        throw new Error("Failed to update book");
      }

      return updatedBook;
    } catch (error) {
      throw new Error(`Failed to update book: ${error}`);
    }
  }

  // UPDATE - Memperbarui stok buku
  async updateBookStock(id: string, newStock: number): Promise<IBook> {
    try {
      if (!id) {
        throw new Error("Book ID is required");
      }

      if (newStock < 0) {
        throw new Error("Stock cannot be negative");
      }

      // Cek apakah buku ada
      await this.getBookById(id);

      const updatedBook = await this.bookRepository.updateBookStock(
        id,
        newStock
      );
      if (!updatedBook) {
        throw new Error("Failed to update book stock");
      }

      return updatedBook;
    } catch (error) {
      throw new Error(`Failed to update book stock: ${error}`);
    }
  }

  // DELETE - Menghapus buku
  async deleteBook(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error("Book ID is required");
      }

      // Cek apakah buku ada
      await this.getBookById(id);

      const deletedBook = await this.bookRepository.deleteBookById(id);
      if (!deletedBook) {
        throw new Error("Failed to delete book");
      }
    } catch (error) {
      throw new Error(`Failed to delete book: ${error}`);
    }
  }

  // READ - Mendapatkan buku dengan stok tersedia
  async getBooksInStock(): Promise<IBook[]> {
    try {
      return await this.bookRepository.getBooksInStock();
    } catch (error) {
      throw new Error(`Failed to fetch books in stock: ${error}`);
    }
  }

  // READ - Mendapatkan genre yang tersedia
  async getAvailableGenres(): Promise<string[]> {
    try {
      return await this.bookRepository.getAvailableGenres();
    } catch (error) {
      throw new Error(`Failed to fetch genres: ${error}`);
    }
  }

  // Validasi data buku
  private validateBookData(bookData: any, isUpdate: boolean = false): void {
    if (!isUpdate) {
      if (!bookData.title || typeof bookData.title !== "string") {
        throw new Error("Title is required and must be a string");
      }
      if (!bookData.author || typeof bookData.author !== "string") {
        throw new Error("Author is required and must be a string");
      }
      if (!bookData.isbn || typeof bookData.isbn !== "string") {
        throw new Error("ISBN is required and must be a string");
      }
      if (
        !bookData.publication_year ||
        typeof bookData.publication_year !== "number"
      ) {
        throw new Error("Publication year is required and must be a number");
      }
      if (!bookData.genre || typeof bookData.genre !== "string") {
        throw new Error("Genre is required and must be a string");
      }
      if (
        bookData.stock === undefined ||
        typeof bookData.stock !== "number" ||
        bookData.stock < 0
      ) {
        throw new Error("Stock is required and must be a non-negative number");
      }
      if (
        bookData.price === undefined ||
        typeof bookData.price !== "number" ||
        bookData.price < 0
      ) {
        throw new Error("Price is required and must be a non-negative number");
      }
    } else {
      // Validasi untuk update (field opsional)
      if (
        bookData.title !== undefined &&
        (typeof bookData.title !== "string" || !bookData.title)
      ) {
        throw new Error("Title must be a non-empty string");
      }
      if (
        bookData.author !== undefined &&
        (typeof bookData.author !== "string" || !bookData.author)
      ) {
        throw new Error("Author must be a non-empty string");
      }
      if (
        bookData.isbn !== undefined &&
        (typeof bookData.isbn !== "string" || !bookData.isbn)
      ) {
        throw new Error("ISBN must be a non-empty string");
      }
      if (
        bookData.publication_year !== undefined &&
        typeof bookData.publication_year !== "number"
      ) {
        throw new Error("Publication year must be a number");
      }
      if (
        bookData.genre !== undefined &&
        (typeof bookData.genre !== "string" || !bookData.genre)
      ) {
        throw new Error("Genre must be a non-empty string");
      }
      if (
        bookData.stock !== undefined &&
        (typeof bookData.stock !== "number" || bookData.stock < 0)
      ) {
        throw new Error("Stock must be a non-negative number");
      }
      if (
        bookData.price !== undefined &&
        (typeof bookData.price !== "number" || bookData.price < 0)
      ) {
        throw new Error("Price must be a non-negative number");
      }
    }

    // Validasi tahun publikasi
    if (bookData.publication_year !== undefined) {
      const currentYear = new Date().getFullYear();
      if (
        bookData.publication_year < 1000 ||
        bookData.publication_year > currentYear + 1
      ) {
        throw new Error(
          `Publication year must be between 1000 and ${currentYear + 1}`
        );
      }
    }
  }
}
