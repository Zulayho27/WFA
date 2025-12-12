-- SQL команды для добавления изображений к рецептам
-- Выполните эти команды в PostgreSQL

-- 1. Плов (Узбекистан)
UPDATE Recipes 
SET image_url = '/uploads/plov.jpg'
WHERE title_ru = 'Плов' OR title_uz LIKE '%Palov%';

-- 2. Торт "Наполеон" (Россия)
UPDATE Recipes 
SET image_url = '/uploads/napoleon-cake.jpg'
WHERE title_ru LIKE '%Наполеон%' OR title_ru LIKE '%торт%';

-- 3. Тирамису (Италия)
UPDATE Recipes 
SET image_url = '/uploads/tiramisu.jpg'
WHERE title_ru LIKE '%Тирамису%' OR title_uz LIKE '%Tiramisu%';

-- 4. Хачапури (Грузия)
UPDATE Recipes 
SET image_url = '/uploads/khachapuri.jpg'
WHERE title_ru LIKE '%Хачапури%' OR title_uz LIKE '%Xachapuri%';

-- 5. Тако (Мексика)
UPDATE Recipes 
SET image_url = '/uploads/tacos.jpg'
WHERE title_ru LIKE '%Тако%' OR title_uz LIKE '%Tako%';

-- Проверить результат
SELECT recipe_id, title_ru, image_url 
FROM Recipes 
WHERE image_url IS NOT NULL;

-- Если нужно обновить по конкретному ID:
-- UPDATE Recipes SET image_url = '/uploads/plov.jpg' WHERE recipe_id = 1;
-- UPDATE Recipes SET image_url = '/uploads/napoleon-cake.jpg' WHERE recipe_id = 2;
-- И т.д.
