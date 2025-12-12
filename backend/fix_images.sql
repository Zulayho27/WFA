-- Исправление перепутанных изображений

-- Хачапури по-аджарски (recipe_id = 2)
UPDATE Recipes SET image_url = '/uploads/khachapuri.jpg' WHERE recipe_id = 2;

-- Такос аль Пастор (recipe_id = 4)
UPDATE Recipes SET image_url = '/uploads/tacos.jpg' WHERE recipe_id = 4;

-- Торт Наполеон (recipe_id = 5)
UPDATE Recipes SET image_url = '/uploads/napoleon-cake.jpg' WHERE recipe_id = 5;

-- Проверка результата
SELECT recipe_id, title, image_url FROM Recipes WHERE recipe_id IN (1,2,3,4,5);
