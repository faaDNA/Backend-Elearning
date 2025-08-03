import { Router } from "express";
import { BookController } from "../controllers/book-controller";

// const authenticationMiddleware = require("../middlewares/authentication-middleware");
// const onlyAdminMiddleware = require("../middlewares/only-admin-middleware");

const router = Router();
const bookController = new BookController();

// Public routes - bisa diakses tanpa autentikasi
router.get("/", bookController.getAllBooks); // GET /books - Mendapatkan semua buku
router.get("/search", bookController.searchBooks); // GET /books/search - Mencari buku
router.get("/in-stock", bookController.getBooksInStock); // GET /books/in-stock - Buku dengan stok tersedia
router.get("/genres", bookController.getAvailableGenres); // GET /books/genres - Genre yang tersedia
router.get("/:id", bookController.getBookById); // GET /books/:id - Mendapatkan buku berdasarkan ID

// Sementara semua endpoint bisa diakses tanpa authentication untuk testing
router.post("/", bookController.createBook); // POST /books - Membuat buku baru
router.put("/:id", bookController.updateBook); // PUT /books/:id - Update buku
router.patch("/:id/stock", bookController.updateBookStock); // PATCH /books/:id/stock - Update stok
router.delete("/:id", bookController.deleteBook); // DELETE /books/:id - Hapus buku

export default router;

module.exports = router;
