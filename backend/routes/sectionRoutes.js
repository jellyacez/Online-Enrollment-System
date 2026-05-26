const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// @route   GET api/sections
// @desc    Get all available sections with their subject details
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT s.id as section_id, s.name as section_name, s.instructor, s.schedule, s.max_slots, s.enrolled_slots,
                   sub.id as subject_id, sub.subject_code, sub.description, sub.units
            FROM sections s
            JOIN subjects sub ON s.subject_id = sub.id
        `;
        const [sections] = await pool.query(query);
        res.json(sections);
    } catch (err) {
        console.error('Fetch sections error:', err);
        res.status(500).json({ message: 'Server error fetching sections' });
    }
});

module.exports = router;
