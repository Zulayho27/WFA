import pool from './config/database.js';

async function fixImages() {
    try {
        console.log('🔍 Проверка текущих изображений...\n');

        // Проверяем текущее состояние
        const beforeResult = await pool.query(`
            SELECT recipe_id, title_ru, image_url 
            FROM Recipes 
            WHERE recipe_id IN (2, 5)
            ORDER BY recipe_id
        `);

        console.log('До исправления:');
        beforeResult.rows.forEach(row => {
            console.log(`  ID ${row.recipe_id}: ${row.title_ru}`);
            console.log(`  Изображение: ${row.image_url}\n`);
        });

        // Исправляем изображения
        console.log('🔧 Исправляем изображения...\n');

        await pool.query('BEGIN');

        // Хачапури (ID 2) должен иметь khachapuri.jpg
        await pool.query(`UPDATE Recipes SET image_url = '/uploads/khachapuri.jpg' WHERE recipe_id = 2`);

        // Торт Наполеон (ID 5) должен иметь napoleon-cake.jpg
        await pool.query(`UPDATE Recipes SET image_url = '/uploads/napoleon-cake.jpg' WHERE recipe_id = 5`);

        await pool.query('COMMIT');

        // Проверяем результат
        const afterResult = await pool.query(`
            SELECT recipe_id, title_ru, image_url 
            FROM Recipes 
            WHERE recipe_id IN (2, 5)
            ORDER BY recipe_id
        `);

        console.log('✅ После исправления:');
        afterResult.rows.forEach(row => {
            console.log(`  ID ${row.recipe_id}: ${row.title_ru}`);
            console.log(`  Изображение: ${row.image_url}\n`);
        });

        console.log('🎉 Изображения успешно исправлены!');

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('❌ Ошибка:', error.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

fixImages();
