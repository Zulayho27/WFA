import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get comments for a recipe
router.get('/:recipeId', async (req, res) => {
    const { recipeId } = req.params;

    try {
        const result = await pool.query(
            `SELECT c.comment_id, c.rating, c.comment_text, c.created_at,
              u.display_name, u.user_id
       FROM Comments c
       LEFT JOIN Users u ON c.user_id = u.user_id
       WHERE c.recipe_id = $1 AND c.is_moderated = true
       ORDER BY c.created_at DESC`,
            [recipeId]
        );

        res.json({ comments: result.rows });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Add comment/rating to recipe
router.post(
    '/:recipeId',
    authenticateToken,
    [
        body('rating').isInt({ min: 1, max: 5 }),
        body('comment_text').optional().trim(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { recipeId } = req.params;
        const userId = req.user.userId;
        const { rating, comment_text } = req.body;

        try {
            const result = await pool.query(
                `INSERT INTO Comments (recipe_id, user_id, rating, comment_text, is_moderated)
         VALUES ($1, $2, $3, $4, true)
         RETURNING comment_id, created_at`,
                [recipeId, userId, rating, comment_text || null]
            );

            res.status(201).json({
                message: 'Comment added successfully',
                comment: {
                    comment_id: result.rows[0].comment_id,
                    created_at: result.rows[0].created_at,
                    rating,
                    comment_text,
                },
            });
        } catch (error) {
            console.error('Error adding comment:', error);
            res.status(500).json({ error: 'Failed to add comment' });
        }
    }
);

export default router;
