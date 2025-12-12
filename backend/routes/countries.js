import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

// GET all countries
router.get('/', async (req, res) => {
    try {
        const lang = req.query.lang || 'ru';
        const nameField = lang === 'uz' ? 'name_uz' : 'name_ru';

        const result = await pool.query(
            `SELECT country_id, name_ru, name_uz, flag_icon,
              ${nameField} as name
       FROM Countries
       ORDER BY ${nameField}`
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({ error: 'Failed to fetch countries' });
    }
});

// POST create new country (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name_ru, name_uz, flag_icon } = req.body;

        if (!name_ru || !name_uz || !flag_icon) {
            return res.status(400).json({
                error: 'name_ru, name_uz, and flag_icon are required'
            });
        }

        const result = await pool.query(
            `INSERT INTO Countries (name_ru, name_uz, flag_icon)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [name_ru, name_uz, flag_icon]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating country:', error);
        res.status(500).json({ error: 'Failed to create country' });
    }
});

export default router;
