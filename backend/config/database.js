import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Supabase uses different environment variable names
// Support multiple naming conventions for flexibility
const connectionString =
    process.env.POSTGRES_URL ||           // Supabase default
    process.env.POSTGRES_PRISMA_URL ||    // Supabase Prisma
    process.env.DATABASE_URL ||           // Standard naming
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Alternative

// Create pool with Supabase-compatible configuration
const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false  // Required for Supabase
    },
    // Supabase connection pooling settings
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
    console.log('✓ Connected to Supabase PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
    console.error('Connection string used:', connectionString ? 'Found' : 'Missing');
});

// Test query on startup
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Database connection test failed:', err.message);
        console.error('Please check your DATABASE_URL or POSTGRES_URL in .env file');
    } else {
        console.log('✓ Database connection test successful');
    }
});

export default pool;
