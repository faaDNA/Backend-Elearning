// inisialisasi
const express = require('express');
const apiRoutes = require('./routes');
const app = express();
const PORT = 3000;

// middleware request body, jika diperlukan
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handle seluruh request /api/* ke route API
app.use('/api', apiRoutes);

// event loop
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

export default app;
