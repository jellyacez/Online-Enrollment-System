const pool = require('../config/db');
const logAction = require('../utils/auditLogger');

// Get all enrollments with student and subject details
exports.getEnrollments = async (req, res) => {
    try {
        const query = `
            SELECT e.id, e.status, e.created_at,
                   u.full_name AS student_name, u.email AS student_email,
                   s.subject_code, s.description AS subject_description
            FROM enrollments e
            JOIN users u ON e.student_id = u.id
            JOIN subjects s ON e.subject_id = s.id
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching enrollments:', error);
        res.status(500).json({ message: 'Server error while fetching enrollments' });
    }
};

// Create a new enrollment
exports.createEnrollment = async (req, res) => {
    try {
        const { student_id, subject_id } = req.body;
        
        if (!student_id || !subject_id) {
            return res.status(400).json({ message: 'Student ID and Subject ID are required' });
        }

        const [result] = await pool.query(
            'INSERT INTO enrollments (student_id, subject_id, status) VALUES (?, ?, ?)',
            [student_id, subject_id, 'pending']
        );
        
        await logAction(student_id, 'ENROLL_SUBJECT', `Enrolled in subject ID ${subject_id}`);

        res.status(201).json({ 
            message: 'Enrollment created successfully', 
            enrollmentId: result.insertId 
        });
    } catch (error) {
        console.error('Error creating enrollment:', error);
        res.status(500).json({ message: 'Server error while creating enrollment' });
    }
};

// Update enrollment status
exports.updateEnrollmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const [result] = await pool.query(
            'UPDATE enrollments SET status = ? WHERE id = ?',
            [status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        
        res.json({ message: 'Enrollment status updated successfully' });
    } catch (error) {
        console.error('Error updating enrollment:', error);
        res.status(500).json({ message: 'Server error while updating enrollment' });
    }
};

// Delete an enrollment
exports.deleteEnrollment = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM enrollments WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        
        await logAction(null, 'DROP_SUBJECT', `Dropped enrollment ID ${req.params.id}`); // Ideally get user id from req.user if auth middleware was present

        res.json({ message: 'Enrollment deleted successfully' });
    } catch (error) {
        console.error('Error deleting enrollment:', error);
        res.status(500).json({ message: 'Server error while deleting enrollment' });
    }
};
