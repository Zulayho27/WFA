import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function fixImages() {
    try {
        console.log('Подключение к базе данных...');

        // Проверяем текущее состояние
        const result = await pool.query(`
            SELECT recipe_id, title_ru, image_url 
            FROM Recipes 
            WHERE recipe_id IN (2, 5)
            ORDER BY recipe_id
        `);

        console.log('\nТекущее состояние:');
        result.rows.forEach(row => {
            console.log(`ID ${row.recipe_id}: ${row.title_ru} -> ${row.image_url}`);
        });

        // Меняем изображения
        console.log('\nМеняем изображения местами...');

        // Используем транзакцию
        await pool.query('BEGIN');

        // Временное значение для recipe_id = 5
        await pool.query(`UPDATE Recipes SET image_url = '/uploads/temp.jpg' WHERE recipe_id = 5`);

        // Меняем местами
        await pool.query(`UPDATE Recipes SET image_url = '/uploads/napoleon-cake.jpg' WHERE recipe_id = 2`);
        await pool.query(`UPDATE Recipes SET image_url = '/uploads/khachapuri.jpg' WHERE recipe_id = 5`);

        await pool.query('COMMIT');

        // Проверяем результат
        const result2 = await pool.query(`
            SELECT recipe_id, title_ru, image_url 
            FROM Recipes 
            WHERE recipe_id IN (2, 5)
            ORDER BY recipe_id
        `);

        console.log('\nПосле исправления:');
        result2.rows.forEach(row => {
            console.log(`ID ${row.recipe_id}: ${row.title_ru} -> ${row.image_url}`);
        });

        console.log('\n✅ Готово!');

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Ошибка:', error.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

fixImages();
