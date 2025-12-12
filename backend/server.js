import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import recipeRoutes from './routes/recipes.js';
import searchRoutes from './routes/search.js';
import favoritesRoutes from './routes/favorites.js';
import commentsRoutes from './routes/comments.js';
import countriesRoutes from './routes/countries.js';
import testUtilsRoutes from './routes/test-utils.js';  // ТОЛЬКО ДЛЯ РАЗРАБОТКИ!

// Import database to test connection
import pool from './config/database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/countries', countriesRoutes);
app.use('/api/test', testUtilsRoutes);  // ТОЛЬКО ДЛЯ РАЗРАБОТКИ!

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'World Food Atlas API is running' });
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
    } else {
        console.log('✓ Database connected successfully at', res.rows[0].now);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 World Food Atlas Backend API`);
});
