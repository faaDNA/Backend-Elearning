# Backend E-Learning API

Backend sistem E-Learning yang dibangun dengan Express.js, TypeScript, PostgreSQL, dan Cloudinary.

## Features

- ✅ JWT Authentication dengan role-based authorization (admin/student)
- ✅ User, Course, dan Book management
- ✅ Photo upload dengan Cloudinary integration
- ✅ PostgreSQL database dengan migrations
- ✅ Admin-only endpoints untuk data modification
- ✅ Original filename tracking untuk uploads

## Quick Start

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Setup Environment**

   ```bash
   cp .env.example .env
   # Edit .env dengan credentials yang benar
   ```

3. **Database Setup**

   ```bash
   npx knex migrate:latest
   npx knex seed:run
   ```

4. **Start Server**
   ```bash
   npm run dev
   # atau
   npx ts-node src/server.ts
   ```

## Test Accounts

- **Admin**: admin@elearning.com / rahasia
- **Student**: student@elearning.com / rahasia

## Documentation

📖 **Complete API Documentation**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

- Database schema
- All endpoints dengan examples
- Authentication guide
- Photo upload tutorial
- Error handling

## Server

Server akan berjalan di: http://localhost:3000

API Documentation: http://localhost:3000/api 8. Build the app into `dist/` using:

```
npm run build
```

9. Start the app in production mode:
   ```
   npm start
   ```
