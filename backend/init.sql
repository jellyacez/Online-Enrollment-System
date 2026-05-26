DROP DATABASE IF EXISTS enrollment_system_db;
CREATE DATABASE enrollment_system_db;
USE enrollment_system_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profiles (
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
);

CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    units INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    instructor VARCHAR(100) DEFAULT 'TBA',
    schedule VARCHAR(100) DEFAULT 'TBA',
    max_slots INT NOT NULL DEFAULT 40,
    enrolled_slots INT DEFAULT 0,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    section_id INT NOT NULL,
    status ENUM('pending', 'enrolled', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
);

CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert dummy admin user for testing
INSERT INTO users (full_name, email, password, role) 
VALUES ('System Admin', 'admin@example.com', '$2b$10$7zBv4l30J.x.tCgXQnL/cOoHh0f7l/d20wEw/XG7d2oZ7p8l5M8nO', 'admin');

-- Insert Sample Subjects
INSERT INTO subjects (id, subject_code, description, units) VALUES
(1, 'SOCSCI 313', 'Science, Technology, and Society', 3),
(2, 'IT ELEC 4', 'Integrative Programming 2', 3),
(3, 'IAS 323', 'Information Assurance and Security 2', 3),
(4, 'CIS 323', 'Social and Professional Issues in Computing', 3),
(5, 'SIA 323', 'System Integration and Architecture 1', 3);

-- Insert Sample Sections for the subjects
INSERT INTO sections (subject_id, name, schedule, max_slots, enrolled_slots) VALUES
(1, 'Info 3-C', 'Mon/Wed 8:00 AM - 9:30 AM', 40, 0),
(1, 'Info 3-B', 'Tue/Thu 10:00 AM - 11:30 AM', 30, 0),
(2, 'Info 3-C', 'Mon/Wed 1:00 PM - 2:30 PM', 40, 0),
(2, 'Info 3-A', 'Fri 8:00 AM - 11:00 AM', 20, 20), -- Fully booked section for testing
(3, 'Info 3-C', 'Tue/Thu 8:00 AM - 9:30 AM', 40, 0),
(4, 'Info 3-C', 'Mon/Wed 10:00 AM - 11:30 AM', 40, 0),
(5, 'Info 3-C', 'Tue/Thu 1:00 PM - 2:30 PM', 40, 0);
