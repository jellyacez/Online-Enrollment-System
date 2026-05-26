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

// @route   DELETE api/admin/users/:id
// @desc    Delete a user
router.delete('/users/:id', async (req, res) => {
    try {
        await pool.query("DELETE FROM users WHERE id = ?", [req.params.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error while deleting user' });
    }
});

module.exports = router;
