import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
    ru: {
        // Navigation
        home: 'Главная',
        recipes: 'Рецепты',
        favorites: 'Избранное',
        profile: 'Профиль',
        admin: 'Админ',
        login: 'Войти',
        register: 'Регистрация',
        logout: 'Выйти',

        // Landing Page
        heroTitle: 'Кулинарное Путешествие По Миру',
        heroSubtitle: 'Откройте для себя аутентичные рецепты из разных уголков планеты',
        exploreRecipes: 'Исследовать рецепты',
        learnMore: 'Узнать больше',

        // Search & Filters
        search: 'Поиск рецептов...',
        filterByCountry: 'По стране',
        filterByCategory: 'По категории',
        filterByTags: 'По тегам',
        allCountries: 'Все страны',
        allCategories: 'Все категории',

        // Recipe Details
        prepTime: 'Подготовка',
        cookTime: 'Приготовление',
        totalTime: 'Общее время',
        servings: 'Порции',
        ingredients: 'Ингредиенты',
        instructions: 'Инструкции',
        culturalContext: 'Культурный контекст',
        comments: 'Комментарии',
        rating: 'Рейтинг',
        addComment: 'Добавить комментарий',
        startCookingMode: 'Режим приготовления',
        addToFavorites: 'В избранное',
        removeFromFavorites: 'Удалить из избранного',

        // Cooking Mode
        step: 'Шаг',
        previous: 'Назад',
        next: 'Далее',
        finish: 'Завершить',

        // Auth
        email: 'Email',
        password: 'Пароль',
        displayName: 'Имя',
        confirmPassword: 'Подтвердите пароль',
        dontHaveAccount: 'Нет аккаунта?',
        alreadyHaveAccount: 'Уже есть аккаунт?',
        loginHere: 'Войти',
        registerHere: 'Зарегистрироваться',

        // Admin
        addRecipe: 'Добавить рецепт',
        editRecipe: 'Редактировать рецепт',
        deleteRecipe: 'Удалить рецепт',
        recipeTitle: 'Название рецепта',
        description: 'Описание',
        category: 'Категория',
        country: 'Страна',
        uploadImage: 'Загрузить изображение',
        save: 'Сохранить',
        cancel: 'Отмена',

        // Common
        loading: 'Загрузка...',
        error: 'Ошибка',
        success: 'Успешно',
        min: 'мин',
        noResults: 'Ничего не найдено',
    },
    uz: {
        // Navigation
        home: 'Bosh sahifa',
        recipes: 'Retseptlar',
        favorites: 'Sevimlilar',
        profile: 'Profil',
        admin: 'Admin',
        login: 'Kirish',
        register: 'Ro\'yxatdan o\'tish',
        logout: 'Chiqish',

        // Landing Page
        heroTitle: 'Dunyo Bo\'ylab Pazandachilik Sayohati',
        heroSubtitle: 'Dunyoning turli burchaklaridan asl retseptlarni kashf eting',
        exploreRecipes: 'Retseptlarni o\'rganish',
        learnMore: 'Batafsil',

        // Search & Filters
        search: 'Retsept qidirish...',
        filterByCountry: 'Mamlakat bo\'yicha',
        filterByCategory: 'Kategoriya bo\'yicha',
        filterByTags: 'Teglar bo\'yicha',
        allCountries: 'Barcha mamlakatlar',
        allCategories: 'Barcha kategoriyalar',

        // Recipe Details
        prepTime: 'Tayyorlash',
        cookTime: 'Pishirish',
        totalTime: 'Umumiy vaqt',
        servings: 'Porsiyalar',
        ingredients: 'Masalliqlar',
        instructions: 'Ko\'rsatmalar',
        culturalContext: 'Madaniy kontekst',
        comments: 'Izohlar',
        rating: 'Reyting',
        addComment: 'Izoh qo\'shish',
        startCookingMode: 'Pishirish rejimi',
        addToFavorites: 'Sevimliga qo\'shish',
        removeFromFavorites: 'Sevimlilardan o\'chirish',

        // Cooking Mode
        step: 'Qadam',
        previous: 'Orqaga',
        next: 'Keyingi',
        finish: 'Tugatish',

        // Auth
        email: 'Email',
        password: 'Parol',
        displayName: 'Ism',
        confirmPassword: 'Parolni tasdiqlang',
        dontHaveAccount: 'Akkauntingiz yo\'qmi?',
        alreadyHaveAccount: 'Allaqachon akkaunt bormi?',
        loginHere: 'Kirish',
        registerHere: 'Ro\'yxatdan o\'tish',

        // Admin
        addRecipe: 'Retsept qo\'shish',
        editRecipe: 'Retseptni tahrirlash',
        deleteRecipe: 'Retseptni o\'chirish',
        recipeTitle: 'Retsept nomi',
        description: 'Tavsif',
        category: 'Kategoriya',
        country: 'Mamlakat',
        uploadImage: 'Rasm yuklash',
        save: 'Saqlash',
        cancel: 'Bekor qilish',

        // Common
        loading: 'Yuklanmoqda...',
        error: 'Xato',
        success: 'Muvaffaqiyatli',
        min: 'daq',
        noResults: 'Hech narsa topilmadi',
    },
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'ru';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
        // Update HTML lang attribute
        document.documentElement.lang = language;
    }, [language]);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'ru' ? 'uz' : 'ru'));
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    const value = {
        language,
        setLanguage,
        toggleLanguage,
        t,
    };

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
