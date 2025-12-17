-- Проверка текущих рецептов и их изображений
SELECT recipe_id, title_ru, title_uz, image_url 
FROM Recipes 
ORDER BY recipe_id;
