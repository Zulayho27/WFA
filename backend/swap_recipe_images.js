import pool from './config/database.js';

async function swapImages() {
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

        // Меняем изображения местами
        console.log('🔄 Меняем изображения местами...\n');

        await pool.query('BEGIN');

        // Временно сохраняем изображение recipe_id = 5
        await pool.query(`UPDATE Recipes SET image_url = '/uploads/temp.jpg' WHERE recipe_id = 5`);

        // Меняем местами
        await pool.query(`UPDATE Recipes SET image_url = '/uploads/napoleon-cake.jpg' WHERE recipe_id = 2`);
        await pool.query(`UPDATE Recipes SET image_url = '/uploads/khachapuri.jpg' WHERE recipe_id = 5`);

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

        console.log('🎉 Изображения успешно поменяны местами!');

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('❌ Ошибка:', error.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

swapImages();
