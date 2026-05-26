CREATE DATABASE IF NOT EXISTS enrollment_system_db;
USE enrollment_system_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    units INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    status ENUM('pending', 'enrolled', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert dummy admin user for testing (Password is 'admin123' - you should change this in production!)
INSERT INTO users (full_name, email, password, role) 
VALUES ('System Admin', 'admin@example.com', '$2b$10$7zBv4l30J.x.tCgXQnL/cOoHh0f7l/d20wEw/XG7d2oZ7p8l5M8nO', 'admin')
ON DUPLICATE KEY UPDATE id=id;

-- Insert Sample Subjects
INSERT IGNORE INTO subjects (subject_code, description, units) VALUES
('SOCSCI 313', 'Science, Technology, and Society', 3),
('IT ELEC 4', 'Integrative Programming 2', 3),
('IAS 323', 'Information Assurance and Security 2', 3),
('CIS 323', 'Social and Professional Issues in Computing', 3),
('SIA 323', 'System Integration and Architecture 1', 3);
