# 📚 API Buku - Data Lokal

## ✅ **Sudah Berhasil!**

Sistem CRUD buku sudah berjalan di `http://localhost:3000`

### **📋 Endpoint yang Tersedia:**

```
GET    /api/books           - Lihat semua buku
GET    /api/books/:id       - Lihat buku berdasarkan ID
GET    /api/books/search    - Cari buku
POST   /api/books           - Tambah buku baru
PUT    /api/books/:id       - Update buku
DELETE /api/books/:id       - Hapus buku
```

### **📚 5 Buku Contoh Sudah Tersedia:**

1. Laskar Pelangi - Andrea Hirata
2. Bumi Manusia - Pramoedya Ananta Toer
3. Harry Potter - J.K. Rowling
4. To Kill a Mockingbird - Harper Lee
5. 1984 - George Orwell

### **🧪 Test Sekarang:**

```bash
# Lihat semua buku
curl http://localhost:3000/api/books

# Lihat buku ID 1
curl http://localhost:3000/api/books/1

# Cari buku
curl "http://localhost:3000/api/books/search?title=Laskar"

# Tambah buku baru
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Buku Test","author":"Penulis Test","isbn":"123","publication_year":2024,"genre":"Test","stock":10,"price":50000}'
```

### **💾 Cara Kerja:**

- Data disimpan **di memori** (array dalam kode)
- **Restart aplikasi = data reset** ke 5 buku contoh
- **Tidak perlu database** MongoDB

### **📁 File Penting:**

- `src/models/book-model.ts` - Data dan interface buku
- `src/routes/book-routes.ts` - Endpoint API
- `src/controllers/book-controller.ts` - Logic handler
- `src/services/book-service.ts` - Business logic

**Sistem buku sudah siap pakai!** 🎉
