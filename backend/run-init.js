const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function runSQL() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true
        });

        const sql = fs.readFileSync('init.sql', 'utf8');
        console.log('Executing init.sql...');
        
        await connection.query(sql);
        console.log('init.sql executed successfully!');
        await connection.end();

        console.log('Automatically creating default admin account...');
        require('child_process').execSync('node createAdmin.js', { stdio: 'inherit' });
    } catch (err) {
        console.error('Error executing SQL:', err);
    }
}

runSQL();
