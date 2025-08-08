import { Router } from "express";
import authenticationMiddleware from "../middlewares/authentication-middleware";
import onlyAdminMiddleware from "../middlewares/only-admin-middleware";
import * as bookController from "../controllers/book-controller";

const router = Router();

// Public routes - bisa diakses tanpa autentikasi
router.get("/", bookController.getAllBooks); // GET /books - Mendapatkan semua buku
router.get("/search", bookController.searchBooks); // GET /books/search - Mencari buku
router.get("/active", bookController.getActiveBooks); // GET /books/active - Buku aktif
router.get("/categories", bookController.getAvailableCategories); // GET /books/categories - Kategori yang tersedia
router.get("/:id", bookController.getBookById); // GET /books/:id - Mendapatkan buku berdasarkan ID

// Admin only routes - perlu autentikasi dan role admin
router.post(
  "/",
  authenticationMiddleware as any,
  onlyAdminMiddleware as any,
  bookController.createBook as any
); // POST /books - Membuat buku baru (admin only)

router.patch(
  "/:id",
  authenticationMiddleware as any,
  onlyAdminMiddleware as any,
  bookController.updateBook as any
); // PATCH /books/:id - Update buku (admin only)

router.patch(
  "/:id/stock",
  authenticationMiddleware as any,
  onlyAdminMiddleware as any,
  bookController.updateBookStock as any
); // PATCH /books/:id/stock - Update stok (admin only)

router.delete(
  "/:id",
  authenticationMiddleware as any,
  onlyAdminMiddleware as any,
  bookController.deleteBook as any
); // DELETE /books/:id - Hapus buku (admin only)

export default router;
