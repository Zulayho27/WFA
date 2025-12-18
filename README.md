# 🌍 World Food Atlas

A bilingual (Russian/Uzbek) recipe website showcasing traditional dishes from around the world with cultural context.

## ✨ Features

- 🌐 **Bilingual Support**: Full Russian and Uzbek translations
- 🔍 **Smart Search**: Full-text search with filters
- 👤 **User Authentication**: Register, login, and manage favorites
- ❤️ **Favorites System**: Save your favorite recipes
- ⭐ **Ratings & Comments**: Rate and comment on recipes
- 👨‍💼 **Admin Panel**: Create and manage recipes
- 📱 **Responsive Design**: Works on all devices
- 🎨 **Modern UI**: Beautiful, intuitive interface

## 🚀 Quick Start

### Development

1. **Install all dependencies:**
```bash
npm run install:all
```

2. **Set up environment:**
```bash
# Create backend/.env file
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret_key
```

3. **Run development servers:**
```bash
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

### Production Build

```bash
npm run build  # Build frontend
npm start      # Start production server
```

## 📦 Deployment

### Vercel (Recommended)

This project is configured for deployment on Vercel with serverless functions.

**📘 See [DEPLOYMENT_GUIDE.md](.gemini/antigravity/brain/48c34bd2-62af-4ddc-8e01-5d522a0cec26/DEPLOYMENT_GUIDE.md) for detailed step-by-step instructions.**

#### Quick Deploy Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. **Configure Environment Variables**
   ```
   POSTGRES_URL=your_supabase_connection_string
   JWT_SECRET=your_jwt_secret
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   NODE_ENV=production
   ```

4. **Deploy** 🚀

See `.env.vercel.example` for environment variable template.


## 🛠️ Tech Stack

### Frontend
- React 18
- React Router
- Axios
- Vite

### Backend
- Node.js
- Express
- PostgreSQL
- JWT Authentication
- Multer (file uploads)

## 📁 Project Structure

```
WFA/
├── backend/          # Express API server
├── frontend/         # React application
├── package.json      # Root scripts
└── vercel.json       # Deployment config
```

## 🔧 Available Scripts

- `npm run dev` - Run both servers in development
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run install:all` - Install all dependencies

## 📝 License

ISC
