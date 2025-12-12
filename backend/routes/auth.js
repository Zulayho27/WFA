import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';

const router = express.Router();

// Register new user
router.post(
    '/register',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
        body('display_name').trim().notEmpty(),
        body('preferred_language').optional().isIn(['ru', 'uz']),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, display_name, preferred_language = 'ru' } = req.body;

        try {
            // Check if user already exists
            const existingUser = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
            if (existingUser.rows.length > 0) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            // Hash password
            const password_hash = await bcrypt.hash(password, 10);

            // Insert new user
            const result = await pool.query(
                'INSERT INTO Users (email, password_hash, display_name, preferred_language, role) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, email, display_name, preferred_language, role, created_at',
                [email, password_hash, display_name, preferred_language, 'User']
            );

            const user = result.rows[0];

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.user_id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    user_id: user.user_id,
                    email: user.email,
                    display_name: user.display_name,
                    preferred_language: user.preferred_language,
                    role: user.role,
                },
                token,
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Server error during registration' });
        }
    }
);

// Login user
router.post(
    '/login',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // Find user by email
            const result = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);

            if (result.rows.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const user = result.rows[0];

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.user_id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.json({
                message: 'Login successful',
                user: {
                    user_id: user.user_id,
                    email: user.email,
                    display_name: user.display_name,
                    preferred_language: user.preferred_language,
                    role: user.role,
                },
                token,
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Server error during login' });
        }
    }
);

export default router;
