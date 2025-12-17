import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function swapImages() {
    const client = await pool.connect();

    try {
        console.log('🔍 Проверка текущих изображений...\n');

        // Проверяем текущее состояние
        const checkQuery = `
            SELECT recipe_id, title_ru, title_uz, image_url 
            FROM Recipes 
            WHERE title_ru LIKE '%Наполеон%' OR title_uz LIKE '%Napoleon%' 
               OR title_ru LIKE '%Хачапури%' OR title_uz LIKE '%Xachapuri%'
            ORDER BY recipe_id;
        `;

        const beforeResult = await client.query(checkQuery);
        console.log('До исправления:');
        console.table(beforeResult.rows);

        // Находим ID рецептов
        const napoleonRecipe = beforeResult.rows.find(r =>
            r.title_ru?.includes('Наполеон') || r.title_uz?.includes('Napoleon')
        );
        const khachapuriRecipe = beforeResult.rows.find(r =>
            r.title_ru?.includes('Хачапури') || r.title_uz?.includes('Xachapuri')
        );

        if (!napoleonRecipe || !khachapuriRecipe) {
            console.log('❌ Не удалось найти рецепты');
            return;
        }

        console.log(`\n📝 Найдены рецепты:`);
        console.log(`   Наполеон: ID ${napoleonRecipe.recipe_id}, текущее изображение: ${napoleonRecipe.image_url}`);
        console.log(`   Хачапури: ID ${khachapuriRecipe.recipe_id}, текущее изображение: ${khachapuriRecipe.image_url}`);

        // Меняем изображения местами
        console.log('\n🔄 Меняем изображения местами...');

        await client.query('BEGIN');

        // Временно сохраняем изображение Наполеона
        await client.query(
            'UPDATE Recipes SET image_url = $1 WHERE recipe_id = $2',
            ['/uploads/temp.jpg', napoleonRecipe.recipe_id]
        );

        // Ставим изображение Наполеона на Хачапури
        await client.query(
            'UPDATE Recipes SET image_url = $1 WHERE recipe_id = $2',
            [napoleonRecipe.image_url, khachapuriRecipe.recipe_id]
        );

        // Ставим изображение Хачапури на Наполеон
        await client.query(
            'UPDATE Recipes SET image_url = $1 WHERE recipe_id = $2',
            [khachapuriRecipe.image_url, napoleonRecipe.recipe_id]
        );

        await client.query('COMMIT');

        // Проверяем результат
        const afterResult = await client.query(checkQuery);
        console.log('\n✅ После исправления:');
        console.table(afterResult.rows);

        console.log('\n🎉 Изображения успешно поменяны местами!');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Ошибка:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

swapImages();
