import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

const router = express.Router();

// ТЕСТОВЫЙ endpoint для создания тестового пользователя
// УДАЛИТЕ ЭТО В ПРОДАКШЕНЕ!
router.post('/create-test-user', async (req, res) => {
    try {
        const testEmail = 'test@wfa.com';
        const testPassword = 'testpass123';
        const testName = 'Test User';

        // Удалить если существует
        await pool.query('DELETE FROM Users WHERE email = $1', [testEmail]);

        // Создать хеш пароля
        const password_hash = await bcrypt.hash(testPassword, 10);

        // Вставить пользователя
        const result = await pool.query(
            'INSERT INTO Users (email, password_hash, display_name, preferred_language, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [testEmail, password_hash, testName, 'ru', 'Admin']
        );

        res.json({
            message: 'Test user created successfully',
            credentials: {
                email: testEmail,
                password: testPassword,
                note: 'This user is an ADMIN'
            },
            user: {
                user_id: result.rows[0].user_id,
                email: result.rows[0].email,
                display_name: result.rows[0].display_name,
                role: result.rows[0].role
            }
        });
    } catch (error) {
        console.error('Error creating test user:', error);
        res.status(500).json({ error: error.message });
    }
});

// Проверить все пользователи
router.get('/list-users', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT user_id, email, display_name, role, created_at FROM Users ORDER BY created_at DESC'
        );
        res.json({ users: result.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удалить всех пользователей
router.delete('/delete-all-users', async (req, res) => {
    try {
        await pool.query('DELETE FROM Users');
        res.json({ message: 'All users deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Обновить пароль пользователя
router.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ error: 'Email and newPassword are required' });
        }

        // Проверить существует ли пользователь
        const userCheck = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Создать новый хеш пароля
        const password_hash = await bcrypt.hash(newPassword, 10);

        // Обновить пароль
        await pool.query(
            'UPDATE Users SET password_hash = $1 WHERE email = $2',
            [password_hash, email]
        );

        res.json({
            message: 'Password reset successfully',
            email: email,
            newPassword: newPassword,
            note: 'You can now login with this password'
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
