    -- Создание таблиц для World Food Atlas

-- 1. Страны
CREATE TABLE IF NOT EXISTS Countries (
    country_id SERIAL PRIMARY KEY,
    name_ru VARCHAR(100) NOT NULL,
    name_uz VARCHAR(100) NOT NULL,
    flag_icon VARCHAR(10)
);

-- 2. Пользователи
CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    preferred_language VARCHAR(10) DEFAULT 'ru',
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Рецепты
CREATE TABLE IF NOT EXISTS Recipes (
    recipe_id SERIAL PRIMARY KEY,
    title_ru VARCHAR(255) NOT NULL,
    title_uz VARCHAR(255) NOT NULL,
    description_ru TEXT,
    description_uz TEXT,
    country_id INTEGER REFERENCES Countries(country_id),
    category VARCHAR(100),
    image_url VARCHAR(500),
    prep_time_min INTEGER,
    cook_time_min INTEGER,
    total_time_min INTEGER GENERATED ALWAYS AS (prep_time_min + cook_time_min) STORED,
    original_servings INTEGER DEFAULT 4,
    cultural_context_ru TEXT,
    cultural_context_uz TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Шаги приготовления
CREATE TABLE IF NOT EXISTS Steps (
    step_id SERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES Recipes(recipe_id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    description_ru TEXT NOT NULL,
    description_uz TEXT NOT NULL
);

-- 5. Ингредиенты
CREATE TABLE IF NOT EXISTS Ingredients (
    ingredient_id SERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES Recipes(recipe_id) ON DELETE CASCADE,
    name_ru VARCHAR(255) NOT NULL,
    name_uz VARCHAR(255) NOT NULL,
    quantity_original DECIMAL(10,2),
    unit_ru VARCHAR(50),
    unit_uz VARCHAR(50),
    is_smart_tooltip BOOLEAN DEFAULT FALSE,
    tooltip_content_ru TEXT,
    tooltip_content_uz TEXT
);

-- 6. Избранное
CREATE TABLE IF NOT EXISTS Favorites (
    favorite_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id) ON DELETE CASCADE,
    recipe_id INTEGER REFERENCES Recipes(recipe_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, recipe_id)
);

-- 7. Комментарии
CREATE TABLE IF NOT EXISTS Comments (
    comment_id SERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES Recipes(recipe_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES Users(user_id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment_text TEXT,
    is_moderated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Теги вкуса
CREATE TABLE IF NOT EXISTS TasteTags (
    tag_id SERIAL PRIMARY KEY,
    name_ru VARCHAR(50) NOT NULL,
    name_uz VARCHAR(50) NOT NULL,
    icon VARCHAR(10)
);

-- 9. Связь рецептов и тегов
CREATE TABLE IF NOT EXISTS RecipeTags (
    recipe_id INTEGER REFERENCES Recipes(recipe_id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES TasteTags(tag_id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, tag_id)
);

-- ТЕСТОВЫЕ ДАННЫЕ

-- Страны
INSERT INTO Countries (name_ru, name_uz, flag_icon) VALUES
('Узбекистан', 'O''zbekiston', '🇺🇿'),
('Россия', 'Rossiya', '🇷🇺'),
('Италия', 'Italiya', '🇮🇹'),
('Мексика', 'Meksika', '🇲🇽'),
('Грузия', 'Gruziya', '🇬🇪');

-- Тестовый рецепт
INSERT INTO Recipes (title_ru, title_uz, description_ru, description_uz, country_id, category, prep_time_min, cook_time_min, image_url)
VALUES 
('Узбекский Плов', 'O''zbekcha Palov', 'Традиционное узбекское блюдо из риса с мясом и морковью', 'An''anaviy o''zbek taomi guruch, go''sht va sabzi bilan', 1, 'Основное блюдо', 30, 90, '/uploads/plov.jpg'),
('Борщ', 'Borsh', 'Традиционный русский суп со свеклой', 'An''anaviy rus sho''rvasi lavlagi bilan', 2, 'Суп', 20, 60, '/uploads/borsch.jpg'),
('Паста Карбонара', 'Pasta Karbonara', 'Итальянская паста с беконом и сыром', 'Italyan pastasi bekon va pishloq bilan', 3, 'Основное блюдо', 10, 20, '/uploads/carbonara.jpg');

-- Шаги для плова
INSERT INTO Steps (recipe_id, step_number, description_ru, description_uz) VALUES
(1, 1, 'Нарезать мясо кубиками', 'Go''shtni kubik shaklida to''g''rang'),
(1, 2, 'Обжарить мясо в казане', 'Go''shtni qozonda qovuring'),
(1, 3, 'Добавить морковь и лук', 'Sabzi va piyoz qo''shing'),
(1, 4, 'Добавить рис и воду', 'Guruch va suv qo''shing'),
(1, 5, 'Готовить на медленном огне 1 час', '1 soat sekin olovda pishiring');

-- Ингредиенты для плова
INSERT INTO Ingredients (recipe_id, name_ru, name_uz, quantity_original, unit_ru, unit_uz) VALUES
(1, 'Рис', 'Guruch', 1, 'кг', 'kg'),
(1, 'Мясо (баранина)', 'Go''sht (qo''y)', 1, 'кг', 'kg'),
(1, 'Морковь', 'Sabzi', 0.5, 'кг', 'kg'),
(1, 'Лук', 'Piyoz', 0.3, 'кг', 'kg'),
(1, 'Растительное масло', 'O''simlik moyi', 200, 'мл', 'ml');

-- Теги
INSERT INTO TasteTags (name_ru, name_uz, icon) VALUES
('Острое', 'Achchiq', '🌶️'),
('Сладкое', 'Shirin', '🍯'),
('Соленое', 'Sho''r', '🧂'),
('Кислое', 'Nordon', '🍋');

COMMIT;
