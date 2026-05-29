const pool = require('../config/db');

// Get all subjects
exports.getSubjects = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM subjects');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ message: 'Server error while fetching subjects' });
    }
};

// Get a single subject
exports.getSubjectById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM subjects WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching subject:', error);
        res.status(500).json({ message: 'Server error while fetching subject' });
    }
};

// Create a new subject
    exports.createSubject = async (req, res) => {
    try {
        const { subject_code, description, units, subject_type, aligned_program } = req.body;
        
        if (!subject_code || !units) {
            return res.status(400).json({ message: 'Subject code and units are required' });
        }

        const type = subject_type || 'general';
        const program = (type === 'major' && aligned_program) ? aligned_program : null;

        const [result] = await pool.query(
            'INSERT INTO subjects (subject_code, description, units, subject_type, aligned_program) VALUES (?, ?, ?, ?, ?)',
            [subject_code, description, units, type, program]
        );
        
        res.status(201).json({ 
            message: 'Subject created successfully', 
            subjectId: result.insertId 
        });
    } catch (error) {
        console.error('Error creating subject:', error);
        res.status(500).json({ message: 'Server error while creating subject' });
    }
};

// Update a subject
exports.updateSubject = async (req, res) => {
    try {
        const { subject_code, description, units, subject_type, aligned_program } = req.body;
        
        const type = subject_type || 'general';
        const program = (type === 'major' && aligned_program) ? aligned_program : null;

        const [result] = await pool.query(
            'UPDATE subjects SET subject_code = ?, description = ?, units = ?, subject_type = ?, aligned_program = ? WHERE id = ?',
            [subject_code, description, units, type, program, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        
        res.json({ message: 'Subject updated successfully' });
    } catch (error) {
        console.error('Error updating subject:', error);
        res.status(500).json({ message: 'Server error while updating subject' });
    }
};

// Delete a subject
exports.deleteSubject = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM subjects WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        
        res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
        console.error('Error deleting subject:', error);
        res.status(500).json({ message: 'Server error while deleting subject' });
    }
};
