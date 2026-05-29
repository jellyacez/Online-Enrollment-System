# University Online Enrollment System

This is a full-stack web application for university student enrollments.

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **MySQL Server** (running locally on default port 3306)

## 1. Database Setup (Database File / Export)

This project uses a MySQL database. To initialize it with the required tables and sample data:

1. Open your MySQL command line tool or a GUI like phpMyAdmin / MySQL Workbench.
2. Run the provided `backend/init.sql` script to create the `enrollment_system_db` database.
3. Alternatively, you can open a terminal in the `backend` folder and run `node run-init.js`.

> **Note on Database Credentials:** The backend connects to the database using the credentials stored in `backend/.env`. By default, it expects a local MySQL server with the username `root` and password `root` . If your local MySQL setup uses a different password or username, please update the `backend/.env` file before running the server.

## 2. Running the Backend (API Server)

The backend is built with Node.js and Express.

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   _The backend will run on `http://localhost:5000`_

## 3. Running the Frontend (Web Application)

The frontend is built with React and Vite.

1. Open a **new** separate terminal and navigate to the root folder:
   ```bash
   cd Online-Enrollment-System
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   _The frontend will run on `http://localhost:5173`. Open this link in your browser._

## Default Test Accounts

- **Admin**: `admin@example.com` / Password: `password123`
- **Student**: Any generated student account from the sign-up page.
