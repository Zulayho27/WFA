import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Установлен' : 'НЕ установлен');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function test() {
    try {
        console.log('Попытка подключения...');
        const result = await pool.query('SELECT NOW()');
        console.log('✅ Подключение успешно!', result.rows[0]);

        const recipes = await pool.query('SELECT recipe_id, title_ru, image_url FROM Recipes LIMIT 5');
        console.log('\nРецепты:');
        console.table(recipes.rows);

    } catch (error) {
        console.error('❌ Ошибка:', error.message);
    } finally {
        await pool.end();
    }
}

test();
