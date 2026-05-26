const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// @route   GET api/audit
// @desc    Get all audit logs
// @access  Public (should be admin protected)
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT a.id, a.action, a.details, a.created_at, u.full_name AS user_name, u.email 
            FROM audit_logs a
            LEFT JOIN users u ON a.user_id = u.id
            ORDER BY a.created_at DESC
        `;
        const [logs] = await pool.query(query);
        res.json(logs);
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({ message: 'Server error while fetching logs' });
    }
});

module.exports = router;
