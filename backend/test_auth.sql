-- Test script for World Food Atlas authentication

-- 1. Check if Users table exists and view structure
SELECT table_name, column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- 2. View all existing users (without passwords)
SELECT user_id, email, display_name, preferred_language, role, created_at
FROM Users
ORDER BY created_at DESC;

-- 3. Delete test user if exists (optional - uncomment to use)
-- DELETE FROM Users WHERE email = 'test@example.com';

-- 4. How to make a user an admin:
-- UPDATE Users SET role = 'Admin' WHERE email = 'your-email@example.com';

-- 5. Check database connection
SELECT NOW() as current_time, version() as postgres_version;
