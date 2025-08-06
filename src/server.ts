// inisialisasi
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");

const apiRoutes = require("./routes");

const app = express();
const upload = multer();
const PORT = process.env.PORT || 3000;

// middleware request body, jika diperlukan
app.use(upload.any());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(__dirname, "../public")));
// handle seluruh request /api/* ke route API
app.use("/api", apiRoutes);

// event loop
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

export default app;
