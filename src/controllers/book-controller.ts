import { Request, Response } from "express";
import { BookService } from "../services/book-service";

export class BookController {
  private bookService: BookService;

  constructor() {
    this.bookService = new BookService();
  }

  // CREATE - Membuat buku baru
  createBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const bookData = req.body;
      const newBook = await this.bookService.createBook(bookData);

      res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: newBook,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create book",
      });
    }
  };

  // READ - Mendapatkan semua buku dengan pagination
  getAllBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.bookService.getAllBooks(page, limit);

      res.status(200).json({
        success: true,
        message: "Books retrieved successfully",
        data: result.books,
        pagination: {
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          total: result.total,
          limit,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch books",
      });
    }
  };

  // READ - Mendapatkan buku berdasarkan ID
  getBookById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const book = await this.bookService.getBookById(id);

      res.status(200).json({
        success: true,
        message: "Book retrieved successfully",
        data: book,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : "Book not found",
      });
    }
  };

  // READ - Mencari buku dengan filter
  searchBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const filters = {
        title: req.query.title as string,
        author: req.query.author as string,
        genre: req.query.genre as string,
        minPrice: req.query.minPrice
          ? parseFloat(req.query.minPrice as string)
          : undefined,
        maxPrice: req.query.maxPrice
          ? parseFloat(req.query.maxPrice as string)
          : undefined,
      };

      // Hapus filter yang undefined
      Object.keys(filters).forEach((key) => {
        if (filters[key as keyof typeof filters] === undefined) {
          delete filters[key as keyof typeof filters];
        }
      });

      const result = await this.bookService.searchBooks(filters, page, limit);

      res.status(200).json({
        success: true,
        message: "Books search completed",
        data: result.books,
        pagination: {
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          total: result.total,
          limit,
        },
        filters,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to search books",
      });
    }
  };

  // UPDATE - Memperbarui buku
  updateBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedBook = await this.bookService.updateBook(id, updateData);

      res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: updatedBook,
      });
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message.includes("not found")
          ? 404
          : 400;
      res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update book",
      });
    }
  };

  // UPDATE - Memperbarui stok buku
  updateBookStock = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { stock } = req.body;

      if (stock === undefined || typeof stock !== "number") {
        res.status(400).json({
          success: false,
          message: "Stock is required and must be a number",
        });
        return;
      }

      const updatedBook = await this.bookService.updateBookStock(id, stock);

      res.status(200).json({
        success: true,
        message: "Book stock updated successfully",
        data: updatedBook,
      });
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message.includes("not found")
          ? 404
          : 400;
      res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update book stock",
      });
    }
  };

  // DELETE - Menghapus buku
  deleteBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.bookService.deleteBook(id);

      res.status(200).json({
        success: true,
        message: "Book deleted successfully",
      });
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message.includes("not found")
          ? 404
          : 500;
      res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete book",
      });
    }
  };

  // READ - Mendapatkan buku dengan stok tersedia
  getBooksInStock = async (req: Request, res: Response): Promise<void> => {
    try {
      const books = await this.bookService.getBooksInStock();

      res.status(200).json({
        success: true,
        message: "Books in stock retrieved successfully",
        data: books,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch books in stock",
      });
    }
  };

  // READ - Mendapatkan genre yang tersedia
  getAvailableGenres = async (req: Request, res: Response): Promise<void> => {
    try {
      const genres = await this.bookService.getAvailableGenres();

      res.status(200).json({
        success: true,
        message: "Available genres retrieved successfully",
        data: genres,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch genres",
      });
    }
  };
}
