-- Скрипт для управления пользователями World Food Atlas

-- 1. Посмотреть всех пользователей
SELECT user_id, email, display_name, role, created_at
FROM Users
ORDER BY created_at DESC;

-- 2. Удалить конкретного пользователя (замените email)
-- DELETE FROM Users WHERE email = 'makhmudovazulayho@gmail.com';

-- 3. Удалить ВСЕХ пользователей (ОСТОРОЖНО!)
-- DELETE FROM Users;

-- 4. Сделать пользователя админом
-- UPDATE Users SET role = 'Admin' WHERE email = 'makhmudovazulayho@gmail.com';

-- 5. Сбросить пароль пользователя (пароль будет: password123)
-- Сначала сгенерируйте bcrypt хеш в Node.js или онлайн
-- UPDATE Users SET password_hash = '$2a$10$...' WHERE email = 'ваш@email.com';
