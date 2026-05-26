const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
    try {
        const pool = mysql.createPool({ 
            host: process.env.DB_HOST || 'localhost', 
            user: process.env.DB_USER || 'root', 
            password: process.env.DB_PASSWORD || '', 
            database: process.env.DB_NAME || 'enrollment_system_db' 
        });

        await pool.query(`
            CREATE TABLE IF NOT EXISTS archived_users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                original_user_id INT,
                full_name VARCHAR(255),
                email VARCHAR(255),
                role VARCHAR(50),
                profile_data JSON,
                archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('archived_users table created successfully.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
