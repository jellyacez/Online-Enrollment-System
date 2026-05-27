const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
    // First connection WITHOUT database
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    // Create database if missing
    await connection.query(`
        CREATE DATABASE IF NOT EXISTS enrollment_system_db
    `);

    // Select database
    await connection.query(`USE enrollment_system_db`);

    // USERS
    await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM('admin', 'student') DEFAULT 'student',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // USER PROFILES
    await connection.query(`
        CREATE TABLE IF NOT EXISTS user_profiles (
            user_id INT PRIMARY KEY,
            student_type ENUM('old', 'new', 'transferee') DEFAULT 'old',
            address VARCHAR(255),
            phone VARCHAR(50),
            dob DATE,
            current_level VARCHAR(50),
            program VARCHAR(100),
            second_choice_course VARCHAR(100),
            last_school VARCHAR(255),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // ARCHIVED USERS
    await connection.query(`
        CREATE TABLE IF NOT EXISTS archived_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            original_user_id INT,
            full_name VARCHAR(255),
            email VARCHAR(255),
            role VARCHAR(50),
            profile_data JSON,
            archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // SUBJECTS
    await connection.query(`
        CREATE TABLE IF NOT EXISTS subjects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            subject_code VARCHAR(50) NOT NULL UNIQUE,
            description TEXT,
            units INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // SECTIONS
    await connection.query(`
        CREATE TABLE IF NOT EXISTS sections (
            id INT AUTO_INCREMENT PRIMARY KEY,
            subject_id INT NOT NULL,
            name VARCHAR(50) NOT NULL,
            instructor VARCHAR(100) DEFAULT 'TBA',
            schedule VARCHAR(100) DEFAULT 'TBA',
            max_slots INT NOT NULL DEFAULT 40,
            enrolled_slots INT DEFAULT 0,
            FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
        )
    `);

    // ENROLLMENTS
    await connection.query(`
        CREATE TABLE IF NOT EXISTS enrollments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_id INT NOT NULL,
            subject_id INT NOT NULL,
            section_id INT NOT NULL,
            status ENUM('pending', 'enrolled', 'rejected') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
            FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
        )
    `);

    // AUDIT LOGS
    await connection.query(`
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            action VARCHAR(255) NOT NULL,
            details TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        )
    `);

    console.log('Database and tables ready');

    await connection.end();

    // Create reusable pool
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    return pool;
}

module.exports = setupDatabase;