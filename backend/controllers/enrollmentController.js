const pool = require('../config/db');
const logAction = require('../utils/auditLogger');

// Get all enrollments with student and subject details
exports.getEnrollments = async (req, res) => {
    try {
        const query = `
            SELECT e.id, e.status, e.created_at, e.subject_id, e.section_id,
                   u.full_name AS student_name, u.email AS student_email,
                   s.subject_code, s.description AS subject_description,
                   sec.name AS section_name, sec.schedule, sec.instructor
            FROM enrollments e
            JOIN users u ON e.student_id = u.id
            JOIN subjects s ON e.subject_id = s.id
            JOIN sections sec ON e.section_id = sec.id
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
        const { student_id, subject_id, section_id } = req.body;
        
        if (!student_id || !subject_id || !section_id) {
            return res.status(400).json({ message: 'Student ID, Subject ID, and Section ID are required' });
        }

        const [result] = await pool.query(
            'INSERT INTO enrollments (student_id, subject_id, section_id, status) VALUES (?, ?, ?, ?)',
            [student_id, subject_id, section_id, 'pending']
        );
        
        await logAction(student_id, 'ENROLL_SUBJECT', `Enrolled in subject ID ${subject_id} section ID ${section_id}`);

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
        
        const [[enrollment]] = await pool.query('SELECT section_id, status FROM enrollments WHERE id = ?', [req.params.id]);
        if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

        // If newly accepting, check limits and increment
        if (status === 'enrolled' && enrollment.status !== 'enrolled') {
            const [[section]] = await pool.query('SELECT max_slots, enrolled_slots FROM sections WHERE id = ?', [enrollment.section_id]);
            if (section.enrolled_slots >= section.max_slots) {
                return res.status(400).json({ message: 'Section is full. Cannot approve.' });
            }
            await pool.query('UPDATE sections SET enrolled_slots = enrolled_slots + 1 WHERE id = ?', [enrollment.section_id]);
        } 
        // If un-enrolling (e.g., rejecting an already enrolled student)
        else if (status !== 'enrolled' && enrollment.status === 'enrolled') {
            await pool.query('UPDATE sections SET enrolled_slots = enrolled_slots - 1 WHERE id = ? AND enrolled_slots > 0', [enrollment.section_id]);
        }

        const [result] = await pool.query(
            'UPDATE enrollments SET status = ? WHERE id = ?',
            [status, req.params.id]
        );

        res.json({ message: 'Enrollment status updated successfully' });
    } catch (error) {
        console.error('Error updating enrollment:', error);
        res.status(500).json({ message: 'Server error while updating enrollment' });
    }
};

// Delete an enrollment
exports.deleteEnrollment = async (req, res) => {
    try {
        // Fetch before deleting to know the section and status
        const [[enrollment]] = await pool.query('SELECT section_id, status FROM enrollments WHERE id = ?', [req.params.id]);
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }

        const [result] = await pool.query('DELETE FROM enrollments WHERE id = ?', [req.params.id]);
        
        // Decrement section slot if they were actively enrolled
        if (enrollment.status === 'enrolled') {
            await pool.query('UPDATE sections SET enrolled_slots = enrolled_slots - 1 WHERE id = ? AND enrolled_slots > 0', [enrollment.section_id]);
        }
        
        await logAction(null, 'DROP_SUBJECT', `Dropped enrollment ID ${req.params.id}`);

        res.json({ message: 'Enrollment deleted successfully' });
    } catch (error) {
        console.error('Error deleting enrollment:', error);
        res.status(500).json({ message: 'Server error while deleting enrollment' });
    }
};
