# Backend E-Learning API Documentation

## Overview

Backend E-Learning adalah sistem API untuk platform pembelajaran online yang dibangun dengan Express.js, TypeScript, PostgreSQL, dan Cloudinary untuk storage gambar. Sistem ini mendukung manajemen user, course, dan book dengan sistem autentikasi JWT dan role-based authorization.

## Technology Stack

- **Framework**: Express.js 4.18.2
- **Language**: TypeScript
- **Database**: PostgreSQL (Vercel Postgres untuk production)
- **ORM**: Objection.js dengan Knex.js
- **Authentication**: JWT dengan bcrypt (secret: "rahasia")
- **File Upload**: Multer + Cloudinary
- **Image Processing**: Cloudinary dengan auto WebP conversion

## Quick Start

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Setup Environment Variables**
   Create `.env` file:

   ```env
   PORT=3000
   JWT_SECRET=rahasia

   # Database
   DATABASE_URL=postgresql://username:password@host:port/database
   PGHOST=localhost
   PGPORT=5432
   PGUSER=postgres
   PGPASSWORD=your_password
   PGDATABASE=Backend_Elearning

   # Cloudinary
   STORAGE_DRIVER=cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Database Setup**

   ```bash
   npx knex migrate:latest
   npx knex seed:run
   ```

4. **Start Server**
   ```bash
   npm run dev
   # or
   npx ts-node src/server.ts
   ```

## Test Accounts

- **Admin**: admin@elearning.com / rahasia
- **Student**: student@elearning.com / rahasia

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  tanggalLahir DATE,
  sudahLulus BOOLEAN DEFAULT false,
  skorKeseluruhan DECIMAL(5,2),
  profile_picture VARCHAR(500),
  profile_picture_original_name VARCHAR(255),
  profile_picture_cloudinary_url VARCHAR(500),
  role users_role DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);
```

### Courses Table

```sql
CREATE TABLE courses (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR,
  instructor VARCHAR NOT NULL,
  duration VARCHAR NOT NULL,
  level course_level NOT NULL, -- 'Beginner', 'Intermediate', 'Advanced'
  category VARCHAR NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  max_participants INTEGER NOT NULL,
  current_participants INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);
```

### Books Table

```sql
CREATE TABLE books (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  author VARCHAR NOT NULL,
  isbn VARCHAR,
  category VARCHAR NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  image VARCHAR,
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);
```

### User Courses Table (Many-to-Many Relationship)

```sql
CREATE TABLE user_courses (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  course_id BIGINT REFERENCES courses(id),
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress INTEGER DEFAULT 0
);
```

## Environment Variables

Create `.env` file in root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/elearning_db

# Vercel Postgres (Production)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NO_SSL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# JWT Secret
JWT_SECRET=rahasia

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Configuration
PORT=3000
NODE_ENV=development
```

## API Endpoints

### Photo Upload Feature

### Upload Profile Picture

**Endpoint**: `POST /api/users/upload-photo`

**Description**: Upload foto profil user dengan tracking nama file asli dan URL Cloudinary

**Authentication**: Required (Bearer Token)

**Content-Type**: `multipart/form-data`

**Form Data**:

- `photo` (file): Image file (JPG, PNG, JPEG)

**Example Request** (Postman):

1. Set Authorization: `Bearer your_jwt_token`
2. Set Body type to `form-data`
3. Add key `photo` with type `File`
4. Select image file

**Response**:

```json
{
  "success": true,
  "message": "Photo uploaded successfully",
  "data": {
    "original_filename": "profile.jpg",
    "cloudinary_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/elearning/users/profile.webp",
    "user": {
      "id": "1",
      "name": "Test User",
      "email": "user@example.com",
      "profile_picture_original_name": "profile.jpg",
      "profile_picture_cloudinary_url": "https://res.cloudinary.com/..."
    }
  }
}
```

**Features**:

- Automatic WebP conversion untuk optimasi
- Original filename preserved in database
- Cloudinary URL saved for access
- File organized in folder structure

## Authentication

### Register and Login Endpoints

#### POST /api/auth/register

Register new user account

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "tanggalLahir": "1990-01-01",
  "role": "student"
}
```

#### POST /api/auth/login

Login with email and password

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:

```json
{
  "statusCode": 200,
  "message": "Login berhasil!",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### User Management Endpoints

#### GET /api/users

Get all users (public access)

#### GET /api/users/:userId

Get user by ID

#### PATCH /api/users

Update own profile (requires authentication)
**Headers**: `Authorization: Bearer <token>`

#### PATCH /api/users/:userId

Update any user (admin only)
**Headers**: `Authorization: Bearer <admin_token>`

#### DELETE /api/users/:userId

Delete user (admin only)
**Headers**: `Authorization: Bearer <admin_token>`

#### POST /api/users/upload-profile-picture

Upload profile picture (requires authentication)
**Headers**:

- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Body**: Form-data with key `profile_picture` (image file)

**Response**:

```json
{
  "statusCode": 200,
  "message": "Profile picture uploaded successfully!",
  "data": {
    "user": {
      "id": 1,
      "profile_picture": "https://res.cloudinary.com/...",
      "profile_picture_original_name": "my-photo.jpg",
      "profile_picture_cloudinary_url": "https://res.cloudinary.com/..."
    },
    "upload_info": {
      "original_filename": "my-photo.jpg",
      "cloudinary_url": "https://res.cloudinary.com/...",
      "upload_timestamp": "2025-08-08T10:30:00.000Z"
    }
  }
}
```

### Course Management Endpoints

#### GET /api/courses

Get all courses with pagination
**Query Parameters**:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

#### GET /api/courses/:id

Get course by ID

#### GET /api/courses/search

Search courses with filters
**Query Parameters**:

- `title`: Course title
- `instructor`: Instructor name
- `category`: Course category
- `level`: Course level (Beginner, Intermediate, Advanced)
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `is_active`: Active status (true/false)

#### GET /api/courses/active

Get all active courses

#### GET /api/courses/categories

Get available course categories

#### POST /api/courses

Create new course (admin only)
**Headers**: `Authorization: Bearer <admin_token>`

```json
{
  "title": "JavaScript Fundamentals",
  "description": "Learn JavaScript from scratch",
  "instructor": "John Smith",
  "duration": "8 weeks",
  "level": "Beginner",
  "category": "Programming",
  "price": 500000,
  "max_participants": 30
}
```

#### PATCH /api/courses/:id

Update course (admin only)
**Headers**: `Authorization: Bearer <admin_token>`

#### DELETE /api/courses/:id

Delete course (admin only)
**Headers**: `Authorization: Bearer <admin_token>`

### Book Management Endpoints

#### GET /api/books

Get all books with pagination

#### GET /api/books/:id

Get book by ID

#### GET /api/books/search

Search books with filters
**Query Parameters**:

- `title`: Book title
- `author`: Author name
- `category`: Book category
- `isbn`: ISBN number
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `is_active`: Active status (true/false)

#### GET /api/books/active

Get all active books

#### GET /api/books/categories

Get available book categories

#### POST /api/books

Create new book (admin only)
**Headers**: `Authorization: Bearer <admin_token>`

```json
{
  "title": "Clean Code",
  "description": "A Handbook of Agile Software Craftsmanship",
  "author": "Robert C. Martin",
  "isbn": "9780132350884",
  "category": "Programming",
  "price": 250000,
  "stock": 50
}
```

#### PATCH /api/books/:id

Update book (admin only)
**Headers**: `Authorization: Bearer <admin_token>`

#### PATCH /api/books/:id/stock

Update book stock (admin only)
**Headers**: `Authorization: Bearer <admin_token>`

```json
{
  "stock": 100
}
```

#### DELETE /api/books/:id

Delete book (admin only)
**Headers**: `Authorization: Bearer <admin_token>`

## Permission Matrix

| Action                 | Public | Student | Admin |
| ---------------------- | ------ | ------- | ----- |
| View users             | ✅     | ✅      | ✅    |
| Update own profile     | ❌     | ✅      | ✅    |
| Update any user        | ❌     | ❌      | ✅    |
| Delete user            | ❌     | ❌      | ✅    |
| Upload profile picture | ❌     | ✅      | ✅    |
| View courses/books     | ✅     | ✅      | ✅    |
| Create courses/books   | ❌     | ❌      | ✅    |
| Update courses/books   | ❌     | ❌      | ✅    |
| Delete courses/books   | ❌     | ❌      | ✅    |

## File Upload Features

### Profile Picture Upload

- **Accepted formats**: JPG, JPEG, PNG, GIF
- **Max file size**: 10MB
- **Auto conversion**: WebP format for optimization
- **Storage**: Cloudinary with organized folders
- **Metadata stored**:
  - Original filename
  - Cloudinary URL
  - Upload timestamp

### Folder Organization

```
cloudinary/
├── user_profiles/
│   ├── user_1_1725786600000.webp
│   ├── user_2_1725786700000.webp
│   └── ...
└── course_images/
    ├── course_1_image.webp
    └── ...
```

## Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Cloudinary account

### Installation

```bash
# Clone repository
git clone <repository-url>
cd Backend-Elearning

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server

# Database
npm run db:migrate   # Run database migrations
npm run db:rollback  # Rollback last migration
npm run db:seed      # Seed database with sample data

# Testing
npm test            # Run tests (if available)
```

## Production Deployment (Vercel)

### Database Setup

1. Create Vercel Postgres database
2. Update environment variables with Vercel Postgres connection string
3. Run migrations in production environment

### Environment Variables (Vercel)

```env
DATABASE_URL=<vercel_postgres_url>
JWT_SECRET=rahasia
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
NODE_ENV=production
```

### Deployment Steps

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Run migrations on production
vercel env pull .env.production
npm run db:migrate
```

## Error Handling

### Standard Error Response

```json
{
  "statusCode": 400,
  "message": "Error message description",
  "error": "Detailed error information"
}
```

### Common HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Security Features

### JWT Authentication

- Token expires in 24 hours
- Secret key: "rahasia" (configurable via JWT_SECRET)
- Bearer token format: `Authorization: Bearer <token>`

### Password Security

- bcrypt hashing with salt rounds: 10
- Minimum password length: 6 characters

### File Upload Security

- File type validation
- File size limits
- Secure filename generation
- Cloudinary virus scanning

### Role-Based Access Control

- Student: Limited to own profile management
- Admin: Full system access including user/course/book management

## API Testing

### Sample Admin Credentials

```json
{
  "email": "admin@elearning.com",
  "password": "rahasia"
}
```

### Sample Student Credentials

```json
{
  "email": "student@elearning.com",
  "password": "rahasia"
}
```

### Testing with Postman

1. Register/Login to get authentication token
2. Add token to Authorization header for protected routes
3. Test file upload with form-data
4. Verify admin-only operations require admin token

## Troubleshooting

### Common Issues

#### Database Connection Error

- Verify DATABASE_URL in .env file
- Check PostgreSQL service is running
- Ensure database exists

#### Cloudinary Upload Error

- Verify Cloudinary credentials in .env
- Check file size and format
- Ensure network connectivity

#### JWT Token Error

- Check token format: `Bearer <token>`
- Verify token hasn't expired
- Ensure JWT_SECRET matches

#### Permission Denied Error

- Verify user role (admin vs student)
- Check authentication token is valid
- Ensure correct endpoint permissions

### Logs and Debugging

- Check console logs for detailed error messages
- Use `npm run dev` for development mode with automatic restarts
- Enable debug mode: `DEBUG=* npm run dev`
