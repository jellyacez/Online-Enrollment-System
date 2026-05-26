const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// @route   GET api/users/:id
// @desc    Get user profile details
router.get('/:id', async (req, res) => {
    try {
        const query = `
            SELECT u.id, u.full_name, u.email, u.role, 
                   p.student_type, p.address, p.phone, p.dob, p.program, 
                   p.second_choice_course, p.last_school, p.current_level 
            FROM users u
            LEFT JOIN user_profiles p ON u.id = p.user_id
            WHERE u.id = ?
        `;
        const [users] = await pool.query(query, [req.params.id]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(users[0]);
    } catch (err) {
        console.error('Fetch user error:', err);
        res.status(500).json({ message: 'Server error fetching user' });
    }
});

// @route   PUT api/users/:id/profile
// @desc    Update user profile details
router.put('/:id/profile', async (req, res) => {
    const { 
        full_name, address, phone, dob, program, 
        second_choice_course, last_school, current_level
    } = req.body;

    try {
        // Update users table for full_name
        if (full_name) {
            await pool.query('UPDATE users SET full_name = ? WHERE id = ?', [full_name, req.params.id]);
        }

        // Update user_profiles table with UPSERT (ON DUPLICATE KEY UPDATE)
        const query = `
            INSERT INTO user_profiles (
                user_id, address, phone, dob, program, 
                second_choice_course, last_school, current_level
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                address = ?, 
                phone = ?, 
                dob = ?, 
                program = ?, 
                second_choice_course = ?, 
                last_school = ?, 
                current_level = ?
        `;
        
        const addressVal = address || null;
        const phoneVal = phone || null;
        let dobVal = dob || null;
        if (dobVal && dobVal.includes('T')) {
            dobVal = dobVal.split('T')[0];
        }
        const programVal = program || null;
        const secondChoiceVal = second_choice_course || null;
        const lastSchoolVal = last_school || null;
        const currentLevelVal = current_level || null;

        await pool.query(query, [
            req.params.id,
            addressVal, phoneVal, dobVal, programVal, secondChoiceVal, lastSchoolVal, currentLevelVal,
            addressVal, phoneVal, dobVal, programVal, secondChoiceVal, lastSchoolVal, currentLevelVal
        ]);
        
        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ message: err.message || 'Server error updating profile' });
    }
});

module.exports = router;
