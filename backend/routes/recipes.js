import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'recipe-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
});

// Get all recipes with pagination and language support
router.get('/', async (req, res) => {
    const { page = 1, limit = 12, lang = 'ru' } = req.query;
    const offset = (page - 1) * limit;

    try {
        const result = await pool.query(
            `SELECT r.recipe_id, r.title_${lang} as title, r.description_${lang} as description,
              r.image_url, r.prep_time_min, r.cook_time_min, r.total_time_min,
              r.category, c.name_${lang} as country_name, c.flag_icon,
              COALESCE(AVG(co.rating), 0) as avg_rating, COUNT(DISTINCT co.comment_id) as comment_count
       FROM Recipes r
       LEFT JOIN Countries c ON r.country_id = c.country_id
       LEFT JOIN Comments co ON r.recipe_id = co.recipe_id
       GROUP BY r.recipe_id, c.name_${lang}, c.flag_icon
       ORDER BY r.created_at DESC
       LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const countResult = await pool.query('SELECT COUNT(*) FROM Recipes');
        const totalRecipes = parseInt(countResult.rows[0].count);

        res.json({
            recipes: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalRecipes,
                totalPages: Math.ceil(totalRecipes / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

// Get single recipe by ID with full details
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { lang = 'ru' } = req.query;

    try {
        // Get recipe details
        const recipeResult = await pool.query(
            `SELECT r.recipe_id, r.title_${lang} as title, r.description_${lang} as description,
              r.cultural_context_${lang} as cultural_context, r.image_url,
              r.prep_time_min, r.cook_time_min, r.total_time_min, r.category, r.original_servings,
              c.name_${lang} as country_name, c.flag_icon
       FROM Recipes r
       LEFT JOIN Countries c ON r.country_id = c.country_id
       WHERE r.recipe_id = $1`,
            [id]
        );

        if (recipeResult.rows.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        const recipe = recipeResult.rows[0];

        // Get ingredients
        const ingredientsResult = await pool.query(
            `SELECT ingredient_id, name_${lang} as name, quantity_original as quantity,
              unit_${lang} as unit, is_smart_tooltip, tooltip_content_${lang} as tooltip_content
       FROM Ingredients
       WHERE recipe_id = $1
       ORDER BY ingredient_id`,
            [id]
        );

        // Get steps
        const stepsResult = await pool.query(
            `SELECT step_id, step_number, description_${lang} as description
       FROM Steps
       WHERE recipe_id = $1
       ORDER BY step_number`,
            [id]
        );

        // Get tags
        const tagsResult = await pool.query(
            `SELECT t.tag_id, t.name_${lang} as name, t.icon
       FROM RecipeTags rt
       JOIN TasteTags t ON rt.tag_id = t.tag_id
       WHERE rt.recipe_id = $1`,
            [id]
        );

        // Get comments and ratings
        const commentsResult = await pool.query(
            `SELECT c.comment_id, c.rating, c.comment_text, c.created_at,
              u.display_name, u.user_id
       FROM Comments c
       LEFT JOIN Users u ON c.user_id = u.user_id
       WHERE c.recipe_id = $1 AND c.is_moderated = true
       ORDER BY c.created_at DESC`,
            [id]
        );

        res.json({
            ...recipe,
            ingredients: ingredientsResult.rows,
            steps: stepsResult.rows,
            tags: tagsResult.rows,
            comments: commentsResult.rows,
        });
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ error: 'Failed to fetch recipe details' });
    }
});

// Create new recipe (Admin only)
router.post('/', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
    const {
        title_ru, title_uz, country_id, category,
        description_ru, description_uz,
        cultural_context_ru, cultural_context_uz,
        prep_time_min, cook_time_min, original_servings,
        ingredients, steps, tags
    } = req.body;

    const image_url = req.file ? `/uploads/${req.file.filename}` : '/uploads/placeholder.jpg';

    try {
        // Start transaction
        await pool.query('BEGIN');

        // Insert recipe
        const recipeResult = await pool.query(
            `INSERT INTO Recipes (title_ru, title_uz, country_id, category, description_ru, description_uz,
                            cultural_context_ru, cultural_context_uz, prep_time_min, cook_time_min,
                            image_url, original_servings)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING recipe_id`,
            [title_ru, title_uz, country_id, category, description_ru, description_uz,
                cultural_context_ru, cultural_context_uz, prep_time_min, cook_time_min, image_url, original_servings]
        );

        const recipe_id = recipeResult.rows[0].recipe_id;

        // Insert ingredients
        if (ingredients && Array.isArray(JSON.parse(ingredients))) {
            const ingredientsList = JSON.parse(ingredients);
            for (const ing of ingredientsList) {
                await pool.query(
                    `INSERT INTO Ingredients (recipe_id, name_ru, name_uz, quantity_original, unit_ru, unit_uz,
                                    is_smart_tooltip, tooltip_content_ru, tooltip_content_uz)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                    [recipe_id, ing.name_ru, ing.name_uz, ing.quantity_original, ing.unit_ru, ing.unit_uz,
                        ing.is_smart_tooltip || false, ing.tooltip_content_ru, ing.tooltip_content_uz]
                );
            }
        }

        // Insert steps
        if (steps && Array.isArray(JSON.parse(steps))) {
            const stepsList = JSON.parse(steps);
            for (const step of stepsList) {
                await pool.query(
                    `INSERT INTO Steps (recipe_id, step_number, description_ru, description_uz)
           VALUES ($1, $2, $3, $4)`,
                    [recipe_id, step.step_number, step.description_ru, step.description_uz]
                );
            }
        }

        // Insert tags
        if (tags && Array.isArray(JSON.parse(tags))) {
            const tagsList = JSON.parse(tags);
            for (const tag_id of tagsList) {
                await pool.query(
                    `INSERT INTO RecipeTags (recipe_id, tag_id) VALUES ($1, $2)`,
                    [recipe_id, tag_id]
                );
            }
        }

        await pool.query('COMMIT');

        res.status(201).json({ message: 'Recipe created successfully', recipe_id });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error creating recipe:', error);
        res.status(500).json({ error: 'Failed to create recipe' });
    }
});

// Update recipe (Admin only)
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const {
        title_ru, title_uz, country_id, category,
        description_ru, description_uz,
        cultural_context_ru, cultural_context_uz,
        prep_time_min, cook_time_min, original_servings,
        ingredients, steps, tags
    } = req.body;

    try {
        await pool.query('BEGIN');

        // Update recipe
        let updateQuery = `UPDATE Recipes SET 
      title_ru = $1, title_uz = $2, country_id = $3, category = $4,
      description_ru = $5, description_uz = $6,
      cultural_context_ru = $7, cultural_context_uz = $8,
      prep_time_min = $9, cook_time_min = $10, original_servings = $11`;

        let queryParams = [title_ru, title_uz, country_id, category, description_ru, description_uz,
            cultural_context_ru, cultural_context_uz, prep_time_min, cook_time_min, original_servings];

        if (req.file) {
            updateQuery += `, image_url = $12 WHERE recipe_id = $13`;
            queryParams.push(`/uploads/${req.file.filename}`, id);
        } else {
            updateQuery += ` WHERE recipe_id = $12`;
            queryParams.push(id);
        }

        await pool.query(updateQuery, queryParams);

        // Delete and re-insert ingredients, steps, tags
        await pool.query('DELETE FROM Ingredients WHERE recipe_id = $1', [id]);
        await pool.query('DELETE FROM Steps WHERE recipe_id = $1', [id]);
        await pool.query('DELETE FROM RecipeTags WHERE recipe_id = $1', [id]);

        // Re-insert (same logic as create)
        if (ingredients) {
            const ingredientsList = JSON.parse(ingredients);
            for (const ing of ingredientsList) {
                await pool.query(
                    `INSERT INTO Ingredients (recipe_id, name_ru, name_uz, quantity_original, unit_ru, unit_uz,
                                    is_smart_tooltip, tooltip_content_ru, tooltip_content_uz)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                    [id, ing.name_ru, ing.name_uz, ing.quantity_original, ing.unit_ru, ing.unit_uz,
                        ing.is_smart_tooltip || false, ing.tooltip_content_ru, ing.tooltip_content_uz]
                );
            }
        }

        if (steps) {
            const stepsList = JSON.parse(steps);
            for (const step of stepsList) {
                await pool.query(
                    `INSERT INTO Steps (recipe_id, step_number, description_ru, description_uz)
           VALUES ($1, $2, $3, $4)`,
                    [id, step.step_number, step.description_ru, step.description_uz]
                );
            }
        }

        if (tags) {
            const tagsList = JSON.parse(tags);
            for (const tag_id of tagsList) {
                await pool.query(
                    `INSERT INTO RecipeTags (recipe_id, tag_id) VALUES ($1, $2)`,
                    [id, tag_id]
                );
            }
        }

        await pool.query('COMMIT');

        res.json({ message: 'Recipe updated successfully' });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error updating recipe:', error);
        res.status(500).json({ error: 'Failed to update recipe' });
    }
});

// Delete recipe (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM Recipes WHERE recipe_id = $1', [id]);
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ error: 'Failed to delete recipe' });
    }
});

export default router;
