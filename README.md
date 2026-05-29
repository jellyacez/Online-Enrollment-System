# University Online Enrollment System 🎓

A full-stack, responsive web application designed to streamline the university enrollment process. It features a secure student portal for uploading admission requirements and an administrative dashboard for managing subjects, sections, and student data.

## ✨ Key Features
- **Student Portal:** Secure login/registration, profile management, and document vault for ID requirements (Birth Certificate, Form 138, Good Moral).
- **Admin Dashboard:** Centralized hub with statistics and analytics.
- **Subject & Section Management:** Full CRUD operations for curriculum subjects and class sections.
- **Enrollment Tracking:** Real-time tracking of student enrollment status and available slots.
- **Audit Logging:** System-wide action tracking for security and accountability.
- **Modern UI:** Built with React, featuring a clean, responsive layout using modern CSS tokens and Lucide icons.

## 🛠️ Technologies Used
- **Frontend:** React (Vite), React Router, Lucide Icons, CSS3
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Security:** bcrypt (Password Hashing), CORS

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MySQL Server** (running locally on default port `3306`)

### 1. Database Setup
This project uses a MySQL database. To initialize it with the required tables and sample data:

1. Open your MySQL command line tool or a GUI like phpMyAdmin / MySQL Workbench.
2. Run the provided `backend/init.sql` script to create the `enrollment_system_db` database.
3. *Alternatively*, you can open a terminal in the `backend` folder and run `node run-init.js`.

> **⚠️ Note on Database Credentials:** The backend connects to the database using the credentials stored in `backend/.env`. By default, it expects a local MySQL server with the username `root` and password `root`. If your local MySQL setup uses a different password or username, please update the `backend/.env` file before running the server.

### 2. Running the Backend (API Server)
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
   npm start
   ```
   *The backend will run on `http://localhost:5000`*

### 3. Running the Frontend (Web Application)
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
   *The frontend will run on `http://localhost:5173`. Open this link in your browser.*

---

## 🔑 Default Test Accounts
- **Admin:** `admin@example.com` / Password: `password123`
- **Student:** You may register a new student account using the sign-up page.
