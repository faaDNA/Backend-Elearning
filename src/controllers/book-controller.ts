import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/authenticated-request-type";
import { BookService } from "../services/book-service";

const bookService = new BookService();

// CREATE - Membuat book baru (hanya admin)
export const createBook = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Check if requester is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied! Only admin can create books.",
      });
    }

    // Validasi request body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is required",
      });
    }

    const book = await bookService.createBook(req.body);
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to create book",
    });
  }
};

// READ - Mendapatkan semua books
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await bookService.getAllBooks(page, limit);
    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch books",
    });
  }
};

// READ - Mendapatkan book berdasarkan ID
export const getBookById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const book = await bookService.getBookById(id);
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

// READ - Mencari books
export const searchBooks = async (req: Request, res: Response) => {
  try {
    const filters = {
      title: req.query.title as string,
      author: req.query.author as string,
      category: req.query.category as string,
      isbn: req.query.isbn as string,
      minPrice: req.query.minPrice
        ? parseInt(req.query.minPrice as string)
        : undefined,
      maxPrice: req.query.maxPrice
        ? parseInt(req.query.maxPrice as string)
        : undefined,
      is_active: req.query.is_active
        ? req.query.is_active === "true"
        : undefined,
    };

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await bookService.searchBooks(filters, page, limit);
    res.status(200).json({
      success: true,
      message: "Books searched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to search books",
    });
  }
};

// READ - Mendapatkan books aktif
export const getActiveBooks = async (req: Request, res: Response) => {
  try {
    const books = await bookService.getActiveBooks();
    res.status(200).json({
      success: true,
      message: "Active books retrieved successfully",
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch active books",
    });
  }
};

// READ - Mendapatkan categories
export const getAvailableCategories = async (req: Request, res: Response) => {
  try {
    const categories = await bookService.getAvailableCategories();
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch categories",
    });
  }
};

// UPDATE - Memperbarui book (hanya admin)
export const updateBook = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Check if requester is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied! Only admin can update books.",
      });
    }

    const id = parseInt(req.params.id);

    // Validasi ID
    if (isNaN(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "Valid book ID is required",
      });
    }

    // Validasi request body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body with update data is required",
      });
    }

    const book = await bookService.updateBook(id, req.body);
    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to update book",
    });
  }
};

// UPDATE - Update stock book (hanya admin)
export const updateBookStock = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    // Check if requester is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied! Only admin can update book stock.",
      });
    }

    const id = parseInt(req.params.id);
    const { stock } = req.body;

    const book = await bookService.updateBookStock(id, stock);
    res.status(200).json({
      success: true,
      message: "Book stock updated successfully",
      data: book,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update book stock",
    });
  }
};

// DELETE - Menghapus book (hanya admin)
export const deleteBook = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Check if requester is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied! Only admin can delete books.",
      });
    }

    const id = parseInt(req.params.id);
    const book = await bookService.deleteBook(id);
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: book,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete book",
    });
  }
};
