const mysql = require('mysql2/promise');
require('dotenv').config();
async function setupDatabase() {


const tempConnection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || ''
    });

await tempConnection.query(`CREATE DATABASE IF NOT EXISTS enrollment_system_db`);
    
    // 3. Terminate the temporary connection
    await tempConnection.end();

    // 4. Import the standard pool only AFTER the database is guaranteed to exist
const pool = require('./db');
    // Create database if missing
 
    // Select database
    await pool.query(`USE enrollment_system_db`);

    // USERS
    await pool.query(`
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
    await pool.query(`
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
            emergency_contact_name VARCHAR(255),
            emergency_contact_phone VARCHAR(50),
            blood_type VARCHAR(10),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // ARCHIVED USERS
    await pool.query(`
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
    await pool.query(`
        CREATE TABLE IF NOT EXISTS subjects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            subject_code VARCHAR(50) NOT NULL UNIQUE,
            description TEXT,
            units INT NOT NULL,
            subject_type ENUM('general', 'major') DEFAULT 'general',
            aligned_program VARCHAR(100) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // SECTIONS
    await pool.query(`
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
    await pool.query(`
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
    await pool.query(`
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
    console.log('Database ready');
}

module.exports = setupDatabase;