# Setup Cloudinary untuk Upload Foto Profile

## � Cara Mendapatkan Kredensial Cloudinary

### 1. Login ke Dashboard Cloudinary

1. Buka [cloudinary.com](https://cloudinary.com/) dan login dengan akun yang baru Anda buat
2. Setelah login, Anda akan langsung masuk ke **Dashboard**

### 2. Dapatkan Kredensial dari Dashboard

Di halaman dashboard, scroll ke bawah hingga menemukan bagian **"Account Details"** atau **"API Environment variable"**:

![Cloudinary Dashboard](https://res.cloudinary.com/demo/image/upload/v1234567890/cloudinary_dashboard_example.png)

Anda akan melihat informasi seperti ini:

```
Cloud name: your-cloud-name
API Key: 123456789012345
API Secret: [Click to reveal] abcdefghijk123456789
```

**Cara mendapatkan masing-masing:**

- **Cloud Name**: Langsung terlihat (contoh: `dh123xyz45`)
- **API Key**: Langsung terlihat (contoh: `123456789012345`)
- **API Secret**: Klik tombol **"👁️ Reveal"** atau **"Click to reveal"** untuk melihat

### 3. Copy Kredensial ke File .env

Buka file `.env` di project Anda dan ubah konfigurasi ini:

```env
# Ubah dari:
STORAGE_DRIVER=cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Menjadi (dengan kredensial asli Anda):
STORAGE_DRIVER=cloudinary
CLOUDINARY_CLOUD_NAME=dh123xyz45
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijk123456789
```

### 4. Update Database

Jalankan SQL ini di database Anda untuk menambah kolom profile_picture:

```sql
ALTER TABLE users ADD COLUMN profile_picture VARCHAR(500);
```

### 5. Test Upload

1. Jalankan server: `npm run dev`
2. Test dengan Postman:
   - **POST** `http://localhost:3000/api/users/upload-profile-picture`
   - **Header**: `Authorization: Bearer YOUR_JWT_TOKEN`
   - **Body**: form-data dengan key `profile_picture` dan pilih file gambar

## ⚠️ Tips Penting

- **Jangan share** kredensial API Secret ke siapapun
- Setelah mengubah `.env`, **restart server**
- Pastikan tidak ada spasi ekstra di nilai kredensial
- File `.env` sudah di-gitignore jadi aman

## 🎯 Folder Upload

Gambar akan tersimpan di folder `profile-pictures` di Cloudinary Anda.

---

✅ **Selesai!** Sekarang Anda bisa upload foto profile ke Cloudinary!
