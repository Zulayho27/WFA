# World Food Atlas - Deployment Guide

## 🚀 Quick Start

### Local Development

1. **Install dependencies:**
```bash
npm run install:all
```

2. **Set up environment variables:**
```bash
# In backend/.env
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret_key
```

3. **Run development servers:**
```bash
npm run dev
```

This will start:
- Backend API on `http://localhost:5000`
- Frontend on `http://localhost:5173`

## 📦 Production Build

### Build the application:
```bash
npm run build
```

This builds the frontend into `backend/public` directory.

### Start production server:
```bash
npm start
```

The server will serve both API and frontend from `http://localhost:5000`.

## ☁️ Vercel Deployment

### Prerequisites

1. **Create Vercel Postgres Database:**
   - Go to your Vercel project dashboard
   - Navigate to Storage → Create Database → Postgres
   - Copy the `DATABASE_URL` connection string

2. **Set up database schema:**
   - Connect to your Vercel Postgres database
   - Run the SQL schema from `backend/neon_schema.sql` (your original schema)

### Deploy Steps

1. **Push code to GitHub:**
```bash
git add .
git commit -m "Unified deployment setup"
git push
```

2. **Import project to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure environment variables:**
   - In Vercel project settings → Environment Variables
   - Add:
     - `DATABASE_URL` = Your Vercel Postgres connection string
     - `JWT_SECRET` = Random secret key
     - `NODE_ENV` = `production`

4. **Deploy:**
   - Vercel will automatically build and deploy
   - Build command: `npm run build`
   - Output directory: `backend/public`
   - Install command: `npm run install:all`

## 🗄️ Database Setup

Your database schema is in your original PostgreSQL format. Use Vercel Postgres:

1. Create database in Vercel dashboard
2. Get connection string
3. Run your schema SQL
4. Update `DATABASE_URL` in environment variables

## 📁 Project Structure

```
WFA/
├── backend/
│   ├── config/         # Database configuration
│   ├── middleware/     # Auth middleware
│   ├── routes/         # API routes
│   ├── uploads/        # Uploaded images
│   ├── public/         # Frontend build (generated)
│   └── server.js       # Express server
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/      # API utilities
│   └── vite.config.js  # Vite configuration
├── package.json        # Root scripts
└── vercel.json         # Vercel configuration
```

## 🔧 Available Scripts

- `npm run dev` - Run both frontend and backend in development
- `npm run dev:backend` - Run only backend
- `npm run dev:frontend` - Run only frontend
- `npm run build` - Build frontend for production
- `npm start` - Start production server
- `npm run install:all` - Install all dependencies

## 🌐 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@host/database

# Server
PORT=5000
NODE_ENV=production

# Authentication
JWT_SECRET=your_random_secret_key
```

## ✅ Deployment Checklist

- [ ] Database created on Vercel
- [ ] Schema imported to database
- [ ] Environment variables set in Vercel
- [ ] Code pushed to GitHub
- [ ] Project imported to Vercel
- [ ] Build successful
- [ ] Test all functionality

## 🐛 Troubleshooting

### Build fails
- Check that all dependencies are installed
- Verify `package.json` scripts are correct
- Check Vercel build logs

### Database connection fails
- Verify `DATABASE_URL` is correct
- Check database is accessible
- Ensure SSL is enabled in connection string

### Frontend not loading
- Verify build completed successfully
- Check `backend/public` directory exists
- Ensure `NODE_ENV=production` is set

### API calls fail
- Check CORS configuration in `server.js`
- Verify API routes are working
- Check browser console for errors

## 📝 Notes

- Frontend uses relative API paths (`/api/*`) that work in both development and production
- In development, Vite proxies API calls to backend
- In production, Express serves both frontend and API
- Images are served from `/uploads` directory
