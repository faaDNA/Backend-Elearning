-- Migration untuk menambahkan kolom profile_picture ke tabel users
-- Jalankan SQL ini di database Anda

ALTER TABLE users ADD COLUMN profile_picture VARCHAR(500);

-- Optional: Tambahkan comment untuk dokumentasi
COMMENT ON COLUMN users.profile_picture IS 'URL foto profil user dari Cloudinary';
