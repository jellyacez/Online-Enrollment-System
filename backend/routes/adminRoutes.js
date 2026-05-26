const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// @route   GET api/admin/stats
// @desc    Get dashboard statistics for admin
// @access  Public (should be protected by admin middleware in production)
router.get('/stats', async (req, res) => {
    try {
        const [users] = await pool.query("SELECT COUNT(*) AS total FROM users WHERE role = 'student'");
        const [subjects] = await pool.query("SELECT COUNT(*) AS total FROM subjects");
        const [enrollments] = await pool.query("SELECT COUNT(*) AS total FROM enrollments");

        res.json({
            totalStudents: users[0].total,
            totalSubjects: subjects[0].total,
            totalEnrollments: enrollments[0].total
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Server error while fetching stats' });
    }
});

// @route   GET api/admin/users
// @desc    Get all users
router.get('/users', async (req, res) => {
    try {
        const [users] = await pool.query("SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC");
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error while fetching users' });
    }
});

// @route   POST api/admin/users
// @desc    Create a new user
router.post('/users', async (req, res) => {
    const { full_name, email, password, role } = req.body;
    try {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password || 'password123', salt);

        await pool.query(
            "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
            [full_name, email, hashedPassword, role || 'student']
        );
        res.json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error while creating user' });
    }
});

// @route   PUT api/admin/users/:id
// @desc    Update a user
router.put('/users/:id', async (req, res) => {
    const { full_name, email, role } = req.body;
    try {
        await pool.query(
            "UPDATE users SET full_name = ?, email = ?, role = ? WHERE id = ?",
            [full_name, email, role, req.params.id]
        );
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error while updating user' });
    }
});

// @route   DELETE api/admin/users/:id
// @desc    Delete a user (moves to archived_users first)
router.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        // Fetch user data
        const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = users[0];

        // Fetch user profile data
        const [profiles] = await pool.query("SELECT * FROM user_profiles WHERE user_id = ?", [userId]);
        const profileData = profiles.length > 0 ? JSON.stringify(profiles[0]) : JSON.stringify({});

        // Insert into archived_users
        await pool.query(
            "INSERT INTO archived_users (original_user_id, full_name, email, role, profile_data) VALUES (?, ?, ?, ?, ?)",
            [user.id, user.full_name, user.email, user.role, profileData]
        );

        // Delete from users (will cascade to user_profiles)
        await pool.query("DELETE FROM users WHERE id = ?", [userId]);

        res.json({ message: 'User archived and deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error while deleting user' });
    }
});

// @route   GET api/admin/users/archived
// @desc    Get all archived users
router.get('/archived_users', async (req, res) => {
    try {
        const [archived] = await pool.query("SELECT * FROM archived_users ORDER BY archived_at DESC");
        res.json(archived);
    } catch (error) {
        console.error('Error fetching archived users:', error);
        res.status(500).json({ message: 'Server error while fetching archived users' });
    }
});

module.exports = router;
