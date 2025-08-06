# Boilerplate Bootcamp Backend Day 7
Contains the boilerplate code necessary during the 7th day's demonstration of
the KSM Cyber: Backend Development Bootcamp 2025.

## Prerequisites (Local Machine)
1. Node.js runtime version 20 and above
2. Git executables
3. GitHub account

## Usage
1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` into `.env` and fill the correct credentials
4. Migrate and populate the database:
   ```
   npm run db migrate:latest
   npm run db seed:run
   ```
5. Modify codebase and run the development server:
   ```
   npm run dev
   ```
6. View it on your client (Browser, cURL, Postman, etc.)
7. To stop the server, press `CTRL+C`
8. Build the app into `dist/` using:
   ```
   npm run build
   ```
9. Start the app in production mode:
   ```
   npm start
   ```
