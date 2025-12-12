import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Multi-faceted search endpoint
router.get('/', async (req, res) => {
    const {
        query = '',
        country_id,
        category,
        tags,
        lang = 'ru',
        page = 1,
        limit = 12
    } = req.query;

    const offset = (page - 1) * limit;
    let conditions = [];
    let params = [];
    let paramCounter = 1;

    // Full-text search by recipe name using tsv
    if (query) {
        params.push(`%${query}%`);
        conditions.push(`(r.title_${lang} ILIKE $${paramCounter} OR r.description_${lang} ILIKE $${paramCounter})`);
        paramCounter++;
    }

    // Filter by country
    if (country_id) {
        params.push(country_id);
        conditions.push(`r.country_id = $${paramCounter}`);
        paramCounter++;
    }

    // Filter by category
    if (category) {
        params.push(category);
        conditions.push(`r.category = $${paramCounter}`);
        paramCounter++;
    }

    // Filter by tags
    if (tags) {
        const tagIds = tags.split(',');
        params.push(tagIds);
        conditions.push(`r.recipe_id IN (
      SELECT rt.recipe_id FROM RecipeTags rt 
      WHERE rt.tag_id = ANY($${paramCounter})
    )`);
        paramCounter++;
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    try {
        // Get recipes
        params.push(limit, offset);
        const result = await pool.query(
            `SELECT r.recipe_id, r.title_${lang} as title, r.description_${lang} as description,
              r.image_url, r.prep_time_min, r.cook_time_min, r.total_time_min,
              r.category, c.name_${lang} as country_name, c.flag_icon,
              COALESCE(AVG(co.rating), 0) as avg_rating
       FROM Recipes r
       LEFT JOIN Countries c ON r.country_id = c.country_id
       LEFT JOIN Comments co ON r.recipe_id = co.recipe_id
       ${whereClause}
       GROUP BY r.recipe_id, c.name_${lang}, c.flag_icon
       ORDER BY r.created_at DESC
       LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`,
            params
        );

        // Get total count
        const countResult = await pool.query(
            `SELECT COUNT(DISTINCT r.recipe_id) FROM Recipes r ${whereClause}`,
            params.slice(0, -2)
        );

        const totalRecipes = parseInt(countResult.rows[0].count);

        res.json({
            recipes: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalRecipes,
                totalPages: Math.ceil(totalRecipes / limit),
            },
            searchParams: { query, country_id, category, tags }
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Failed to search recipes' });
    }
});

// Get all countries for filter
router.get('/countries', async (req, res) => {
    const { lang = 'ru' } = req.query;

    try {
        const result = await pool.query(
            `SELECT country_id, name_${lang} as name, flag_icon FROM Countries ORDER BY name_${lang}`
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({ error: 'Failed to fetch countries' });
    }
});

// Get all tags for filter
router.get('/tags', async (req, res) => {
    const { lang = 'ru' } = req.query;

    try {
        const result = await pool.query(
            `SELECT tag_id, name_${lang} as name, icon FROM TasteTags ORDER BY name_${lang}`
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
});

export default router;
