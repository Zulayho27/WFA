# 🚀 Деплой World Food Atlas на Vercel

## ⚠️ Важно: Два отдельных проекта

Vercel требует **два отдельных проекта**:
1. **Frontend** (React + Vite)
2. **Backend** (Node.js API)

---

## 📦 ПРОЕКТ 1: Frontend

### Build Settings:

**Framework Preset:** `Vite`

**Root Directory:** `frontend`

**Build Command:**
```
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```
npm install
```

### Environment Variables:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://ваш-backend.vercel.app` |

> ⚠️ Замените на реальный URL вашего backend после его деплоя!

---

## 📦 ПРОЕКТ 2: Backend

### Build Settings:

**Framework Preset:** `Other`

**Root Directory:** `backend`

**Build Command:**
```
npm install
```

**Output Directory:** (оставьте пустым)

**Install Command:**
```
npm install
```

### Environment Variables:

| Key | Value | Пример |
|-----|-------|--------|
| `PORT` | `5000` | `5000` |
| `DB_HOST` | Хост PostgreSQL | `ep-xxx.us-east-1.aws.neon.tech` |
| `DB_PORT` | `5432` | `5432` |
| `DB_NAME` | Имя БД | `world_food_atlas` |
| `DB_USER` | Пользователь БД | `your_username` |
| `DB_PASSWORD` | Пароль БД | `your_password` |
| `JWT_SECRET` | Секретный ключ | `your_random_secret_key_here` |
| `NODE_ENV` | `production` | `production` |

---

## 🗄️ База данных для Production

Vercel НЕ поддерживает PostgreSQL напрямую. Используйте:

### Рекомендуемые сервисы:

1. **Neon** (бесплатно) - https://neon.tech
   - Serverless PostgreSQL
   - Бесплатный план: 0.5 GB
   - Автоматический sleep

2. **Supabase** (бесплатно) - https://supabase.com
   - PostgreSQL + Auth + Storage
   - Бесплатный план: 500 MB

3. **Railway** (бесплатно) - https://railway.app
   - PostgreSQL + деплой
   - $5 бесплатных кредитов/месяц

### Настройка Neon (рекомендуется):

1. Зарегистрируйтесь на https://neon.tech
2. Создайте новый проект
3. Скопируйте Connection String:
   ```
   postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
   ```
4. Выполните SQL схему из `backend/schema.sql`
5. Используйте эти данные в Environment Variables

---

## 📝 Пошаговая инструкция деплоя:

### Шаг 1: Подготовка Backend

1. Создайте `vercel.json` в папке `backend`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

2. Обновите `package.json` в backend:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Шаг 2: Деплой Backend

1. Зайдите на https://vercel.com
2. Нажмите **"Add New Project"**
3. Выберите репозиторий `WFA`
4. **Root Directory:** `backend`
5. Добавьте Environment Variables (см. таблицу выше)
6. Нажмите **"Deploy"**
7. Скопируйте URL (например: `https://wfa-backend.vercel.app`)

### Шаг 3: Деплой Frontend

1. Нажмите **"Add New Project"** снова
2. Выберите тот же репозиторий `WFA`
3. **Root Directory:** `frontend`
4. **Framework:** `Vite`
5. Environment Variables:
   - `VITE_API_URL` = URL вашего backend
6. Нажмите **"Deploy"**

### Шаг 4: Обновите CORS

В `backend/server.js` обновите CORS:

```javascript
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://ваш-frontend.vercel.app'  // Добавьте URL фронтенда
    ],
    credentials: true,
}));
```

Сделайте commit и push - Vercel автоматически передеплоит.

---

## ✅ Проверка после деплоя:

1. **Backend:** Откройте `https://ваш-backend.vercel.app/health`
   - Должно вернуть: `{"status":"ok"}`

2. **Frontend:** Откройте `https://ваш-frontend.vercel.app`
   - Должна загрузиться главная страница

3. **Тест регистрации:**
   - Попробуйте зарегистрироваться
   - Проверьте что данные сохраняются в БД

---

## 🐛 Частые проблемы:

### 1. "Cannot connect to database"
- Проверьте Environment Variables
- Убедитесь что БД доступна извне
- Добавьте `?sslmode=require` к connection string

### 2. "CORS error"
- Обновите `origin` в server.js
- Добавьте URL фронтенда в массив

### 3. "Module not found"
- Проверьте что все зависимости в `package.json`
- Убедитесь что `node_modules` в `.gitignore`

### 4. "Function timeout"
- Vercel бесплатный план: 10 секунд лимит
- Оптимизируйте медленные запросы

---

## 💡 Альтернатива: Render.com

Если Vercel не подходит, используйте Render:

**Преимущества:**
- Бесплатный PostgreSQL
- Проще настройка
- Один сервис для frontend + backend

**Минусы:**
- Медленнее cold start
- Меньше бесплатных часов

---

## 📞 Нужна помощь?

Если возникнут ошибки при деплое, покажите мне:
1. Логи из Vercel
2. Скриншот ошибки
3. URL проекта
