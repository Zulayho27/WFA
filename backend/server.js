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
import testUtilsRoutes from './routes/test-utils.js';

// Import database to test connection
import pool from './config/database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
if (!isProduction) {
    // Development: Allow CORS from Vite dev server
    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }));
} else {
    // Production: No CORS needed (same origin)
    app.use(cors());
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/countries', countriesRoutes);

// Test utils only in development
if (!isProduction) {
    app.use('/api/test', testUtilsRoutes);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'World Food Atlas API is running' });
});

// Serve frontend in production
if (isProduction) {
    const frontendPath = path.join(__dirname, 'public');

    // Serve static files
    app.use(express.static(frontendPath));

    // SPA fallback - serve index.html for all non-API routes
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}

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
    console.log(`🌍 Environment: ${isProduction ? 'Production' : 'Development'}`);
});
