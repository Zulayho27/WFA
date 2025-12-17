-- Исправление перепутанных изображений для Наполеона и Хачапури
-- Сначала проверим текущее состояние
SELECT recipe_id, title_ru, title_uz, image_url 
FROM Recipes 
WHERE title_ru LIKE '%Наполеон%' OR title_uz LIKE '%Napoleon%' 
   OR title_ru LIKE '%Хачапури%' OR title_uz LIKE '%Xachapuri%';

-- Временно сохраняем в переменную (используем временную таблицу)
-- Меняем изображения местами

-- Вариант 1: Если Наполеон - это recipe_id = 5, а Хачапури - recipe_id = 2
-- Сначала ставим временное значение
UPDATE Recipes SET image_url = '/uploads/temp.jpg' WHERE recipe_id = 5;
-- Теперь меняем
UPDATE Recipes SET image_url = '/uploads/napoleon-cake.jpg' WHERE recipe_id = 2;
UPDATE Recipes SET image_url = '/uploads/khachapuri.jpg' WHERE recipe_id = 5;

-- Проверка результата
SELECT recipe_id, title_ru, title_uz, image_url 
FROM Recipes 
WHERE recipe_id IN (2, 5);
