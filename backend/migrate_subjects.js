const pool = require('./config/db');

async function migrate() {
    try {
        console.log('Adding columns to subjects table...');
        await pool.query(`
            ALTER TABLE subjects 
            ADD COLUMN subject_type ENUM('general', 'major') DEFAULT 'general',
            ADD COLUMN aligned_program VARCHAR(100) NULL
        `);
        console.log('Migration successful.');
        process.exit(0);
    } catch (err) {
        // Ignore if columns already exist
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('Columns already exist. Migration skipped.');
            process.exit(0);
        }
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
