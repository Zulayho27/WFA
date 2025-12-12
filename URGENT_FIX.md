# 🚨 СРОЧНО: Удаление чувствительных файлов из GitHub

## Проблема
Вы случайно загрузили в GitHub:
- node_modules (тысячи файлов)
- .env (ПАРОЛИ!)
- uploads (изображения)
- package-lock.json

## ✅ Решение (выполните по порядку):

### 1. Удалите файлы из Git (НЕ с диска):

```bash
cd C:\Users\user\OneDrive\Desktop\WFA

# Удалить node_modules
git rm -r --cached node_modules
git rm -r --cached backend/node_modules
git rm -r --cached frontend/node_modules

# Удалить .env файлы
git rm --cached backend/.env
git rm --cached frontend/.env

# Удалить uploads
git rm -r --cached backend/uploads

# Удалить package-lock.json
git rm --cached package-lock.json
git rm --cached backend/package-lock.json
git rm --cached frontend/package-lock.json

# Удалить .gemini (если есть)
git rm -r --cached .gemini
```

### 2. Проверьте .gitignore:

Убедитесь что файл `.gitignore` содержит:
```
node_modules/
.env
backend/uploads/*
package-lock.json
.gemini/
```

### 3. Сделайте коммит:

```bash
git add .gitignore
git commit -m "Remove sensitive files and add to gitignore"
```

### 4. Отправьте изменения:

```bash
git push origin main
```

### 5. ⚠️ КРИТИЧНО - Смените пароли!

Так как .env файл был в GitHub, НЕМЕДЛЕННО смените:
- Пароль базы данных PostgreSQL
- JWT_SECRET в .env
- Все другие секреты

## 🔒 Проверка

После push проверьте на GitHub:
- node_modules должен исчезнуть
- .env должен исчезнуть
- uploads должен исчезнуть

## 📝 Примечание

Файлы останутся в истории Git. Если в .env были РЕАЛЬНЫЕ пароли:
1. Смените ВСЕ пароли
2. Пересоздайте репозиторий (если очень критично)
