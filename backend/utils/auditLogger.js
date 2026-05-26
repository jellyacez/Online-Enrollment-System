const pool = require('../config/db');

/**
 * Logs an action to the audit_logs table.
 * @param {number} userId - The ID of the user performing the action.
 * @param {string} action - A short string describing the action type (e.g., 'LOGIN', 'ENROLL_SUBJECT').
 * @param {string} details - Detailed information about the action.
 */
const logAction = async (userId, action, details) => {
    try {
        await pool.query(
            'INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)',
            [userId, action, details]
        );
    } catch (error) {
        console.error('Error writing to audit log:', error);
    }
};

module.exports = logAction;
