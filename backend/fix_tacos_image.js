import pool from './config/database.js';

async function fixTacosImage() {
    try {
        console.log('🔍 Ищем рецепт Такос...\n');

        // Ищем рецепт такос
        const findResult = await pool.query(`
            SELECT recipe_id, title_ru, title_uz, image_url 
            FROM Recipes 
            WHERE title_ru LIKE '%Такос%' OR title_uz LIKE '%Tacos%'
        `);

        if (findResult.rows.length === 0) {
            console.log('❌ Рецепт Такос не найден');
            await pool.end();
            process.exit(1);
        }

        const tacosRecipe = findResult.rows[0];
        console.log('Найден рецепт:');
        console.log(`  ID: ${tacosRecipe.recipe_id}`);
        console.log(`  Название: ${tacosRecipe.title_ru}`);
        console.log(`  Текущее изображение: ${tacosRecipe.image_url}\n`);

        // Обновляем изображение
        console.log('🔧 Обновляем изображение на правильное...\n');

        await pool.query(`
            UPDATE Recipes 
            SET image_url = '/uploads/tacos-new.jpg' 
            WHERE recipe_id = $1
        `, [tacosRecipe.recipe_id]);

        // Проверяем результат
        const afterResult = await pool.query(`
            SELECT recipe_id, title_ru, image_url 
            FROM Recipes 
            WHERE recipe_id = $1
        `, [tacosRecipe.recipe_id]);

        console.log('✅ После обновления:');
        console.log(`  ID: ${afterResult.rows[0].recipe_id}`);
        console.log(`  Название: ${afterResult.rows[0].title_ru}`);
        console.log(`  Новое изображение: ${afterResult.rows[0].image_url}\n`);

        console.log('🎉 Изображение такоса успешно обновлено!');

    } catch (error) {
        console.error('❌ Ошибка:', error.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

fixTacosImage();
