# World Food Atlas 🌍

Bilingual recipe website featuring recipes from around the world with Russian and Uzbek language support.

## Features

✅ **Landing Page** - Modern hero section with features showcase  
✅ **Authentication** - Email-based login/registration (8+ character passwords)  
✅ **Recipe Search** - Multi-faceted search by name, country, category, ingredients  
✅ **Favorites** - Save and manage favorite recipes (requires login)  
✅ **Cooking Mode** - Step-by-step cooking interface  
✅ **Admin Panel** - Add, edit, delete recipes (admin-only)  
✅ **Bilingual** - Full support for Russian (ru) and Uzbek (uz) languages  
✅ **Responsive** - Mobile-friendly design  

## Tech Stack

- **Frontend**: React 18, React Router, Axios, Vite
- **Backend**: Node.js, Express, PostgreSQL
- **Auth**: JWT tokens, bcryptjs password hashing
- **Styling**: Modern CSS with custom design system

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL (running on localhost:2007)
- Database: WFA (already configured in .env)

### Backend Setup

```bash
cd backend
npm install
npm start
# Server will run on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
# App will run on http://localhost:5173
```

## Database Setup

The database schema is already defined. Make sure your PostgreSQL database `WFA` is running with the provided schema.

## Default Access

**Regular User:**
- Register a new account at `/register`
- Minimum password: 8 characters

**Admin User:**
- You need to manually update a user's role to 'Admin' in the database:
```sql
UPDATE Users SET role = 'Admin' WHERE email = 'your-admin@email.com';
```

## Project Structure

```
WFA/
├── backend/
│   ├── config/         # Database connection
│   ├── middleware/     # Auth & admin middleware
│   ├── routes/         # API endpoints
│   ├── uploads/        # Recipe images
│   ├── server.js
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/ # Reusable components
    │   ├── pages/      # Page components
    │   ├── context/    # Auth & Language contexts
    │   ├── styles/     # Global CSS
    │   ├── App.jsx
    │   └── main.jsx
    └── index.html
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Recipes
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get recipe details
- `POST /api/recipes` - Create recipe (admin only)
- `PUT /api/recipes/:id` - Update recipe (admin only)
- `DELETE /api/recipes/:id` - Delete recipe (admin only)

### Search
- `GET /api/search` - Search recipes
- `GET /api/search/countries` - Get countries list
- `GET /api/search/tags` - Get tags list

### Favorites
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites/:recipeId` - Add to favorites
- `DELETE /api/favorites/:recipeId` - Remove from favorites

### Comments
- `GET /api/comments/:recipeId` - Get recipe comments
- `POST /api/comments/:recipeId` - Add comment/rating

## Features Overview

### 1. Landing Page
Beautiful hero section with features showcase

### 2. Search & Filters
- Full-text search
- Filter by country
- Filter by category
- Combine multiple filters

### 3. Authentication
- Email + password (min 8 chars)
- JWT tokens
- Protected routes

### 4. Recipe Details
- Serving size adjuster
- Ingredients with smart tooltips
- Step-by-step instructions
- Cultural context
- Comments & ratings

### 5. Cooking Mode
- Fullscreen step-by-step view
- Progress indicator
- Large readable text
- Easy navigation

### 6. User Profile
- View saved favorites
- Manage favorites collection

### 7. Admin Panel
- Add new recipes
- Edit existing recipes
- Delete recipes
- Bilingual forms

### 8. Language Support
- Toggle between Russian & Uzbek
- All content translated
- Language preference persisted

## Notes

- Images: Currently using placeholder. You can upload images through the admin panel
- The admin panel form is simplified - for full ingredient/step management, you'll need to extend the form
- Row Level Security is configured in PostgreSQL for user data protection

## Development

Built with modern web development best practices:
- Component-based architecture
- Context API for state management
- Protected routes
- Responsive design
- Glassmorphism effects
- Smooth animations
- Mobile-first approach

---

**Created for:** World Food Atlas Project  
**Version:** 1.0.0
