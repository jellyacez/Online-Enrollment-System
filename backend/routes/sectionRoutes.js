const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// @route   GET api/sections
// @desc    Get all available sections with their subject details
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT s.id as section_id, s.name as section_name, s.instructor, s.schedule, s.max_slots, s.enrolled_slots,
                   sub.id as subject_id, sub.subject_code, sub.description, sub.units, sub.subject_type, sub.aligned_program
            FROM subjects sub
            LEFT JOIN sections s ON sub.id = s.subject_id
        `;
        const [sections] = await pool.query(query);
        res.json(sections);
    } catch (err) {
        console.error('Fetch sections error:', err);
        res.status(500).json({ message: 'Server error fetching sections' });
    }
});

// @route   POST api/sections
// @desc    Create a new section
router.post('/', async (req, res) => {
    try {
        const { subject_id, name, schedule, max_slots, instructor } = req.body;
        if (!subject_id || !name || !max_slots) {
            return res.status(400).json({ message: 'Subject ID, section name, and max slots are required' });
        }
        
        const [result] = await pool.query(
            'INSERT INTO sections (subject_id, name, schedule, max_slots, instructor) VALUES (?, ?, ?, ?, ?)',
            [subject_id, name, schedule || 'TBA', max_slots, instructor || 'TBA']
        );
        
        res.status(201).json({ message: 'Section created successfully', sectionId: result.insertId });
    } catch (err) {
        console.error('Create section error:', err);
        res.status(500).json({ message: 'Server error creating section' });
    }
});

module.exports = router;
