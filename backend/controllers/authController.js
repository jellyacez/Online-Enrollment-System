const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logAction = require('../utils/auditLogger');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { 
            full_name, email, password, student_type,
            address, phone, dob, program, second_choice_course, last_school, current_level, role
        } = req.body;

        if (!full_name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userRole = role === 'admin' ? 'admin' : 'student';

        // 1. Insert into users table
        const queryUsers = `
            INSERT INTO users (full_name, email, password, role) 
            VALUES (?, ?, ?, ?)
        `;
        
        const [userResult] = await pool.query(queryUsers, [
            full_name, email, hashedPassword, userRole
        ]);

        const newUserId = userResult.insertId;

        // 2. Insert into user_profiles table
        const queryProfiles = `
            INSERT INTO user_profiles (
                user_id, student_type, address, phone, dob, 
                program, second_choice_course, last_school, current_level
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await pool.query(queryProfiles, [
            newUserId, 
            student_type || 'old',
            address || null, 
            phone || null, 
            dob || null, 
            program || null,
            second_choice_course || null, 
            last_school || null, 
            current_level || null
        ]);

        await logAction(newUserId, 'REGISTER', `User ${email} registered as ${userRole}`);

        res.status(201).json({ message: 'User registered successfully', userId: newUserId });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Check if user exists
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1h' },
            async (err, token) => {
                if (err) throw err;
                
                await logAction(user.id, 'LOGIN', `User ${email} logged in`);

                res.json({
                    token,
                    user: {
                        id: user.id,
                        full_name: user.full_name,
                        email: user.email,
                        role: user.role
                    }
                });
            }
        );
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};
