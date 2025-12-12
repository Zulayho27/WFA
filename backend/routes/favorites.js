import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's favorite recipes
router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const { lang = 'ru' } = req.query;

    try {
        const result = await pool.query(
            `SELECT r.recipe_id, r.title_${lang} as title, r.description_${lang} as description,
              r.image_url, r.prep_time_min, r.cook_time_min, r.total_time_min,
              r.category, c.name_${lang} as country_name, c.flag_icon
       FROM Favorites f
       JOIN Recipes r ON f.recipe_id = r.recipe_id
       LEFT JOIN Countries c ON r.country_id = c.country_id
       WHERE f.user_id = $1
       ORDER BY r.title_${lang}`,
            [userId]
        );

        res.json({ favorites: result.rows });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

// Add recipe to favorites
router.post('/:recipeId', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const { recipeId } = req.params;

    try {
        // Check if already favorited
        const existing = await pool.query(
            'SELECT * FROM Favorites WHERE user_id = $1 AND recipe_id = $2',
            [userId, recipeId]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Recipe already in favorites' });
        }

        await pool.query(
            'INSERT INTO Favorites (user_id, recipe_id) VALUES ($1, $2)',
            [userId, recipeId]
        );

        res.status(201).json({ message: 'Recipe added to favorites' });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ error: 'Failed to add favorite' });
    }
});

// Remove recipe from favorites
router.delete('/:recipeId', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const { recipeId } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM Favorites WHERE user_id = $1 AND recipe_id = $2',
            [userId, recipeId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        res.json({ message: 'Recipe removed from favorites' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ error: 'Failed to remove favorite' });
    }
});

// Check if recipe is favorited
router.get('/check/:recipeId', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const { recipeId } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM Favorites WHERE user_id = $1 AND recipe_id = $2',
            [userId, recipeId]
        );

        res.json({ isFavorite: result.rows.length > 0 });
    } catch (error) {
        console.error('Error checking favorite:', error);
        res.status(500).json({ error: 'Failed to check favorite status' });
    }
});

export default router;
