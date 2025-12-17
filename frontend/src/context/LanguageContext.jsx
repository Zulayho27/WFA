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

        // Landing Page - Hero Section
        landingHeroTitle: 'Готовка стала веселой и легкой: Раскройте своего внутреннего шеф-повара',
        landingHeroSubtitle: 'Откройте для себя более',
        landingHeroRecipes: '10,000 рецептов',
        landingHeroDescription: 'в вашей руке с лучшими рецептами. Поможем вам найти легкий способ готовить.',
        exploreRecipes: 'Исследовать рецепты',

        // Landing Page - Community
        fromOurCommunity: 'От нашего сообщества',
        spaghettiReview: 'Должен сказать, рецепт спагетти болоньезе просто потрясающий! Я всегда был фанатом итальянской кухни, но немного боялся готовить это классическое блюдо дома.',
        chickenReview: 'Всегда немного боялся запекать целую курицу, опасаясь, что это может быть слишком сложно, но ваш рецепт изменил это для меня. Инструкции были настолько ясными и легкими для выполнения.',
        potPieReview: 'Я всегда был фанатом сытной домашней еды, и рецепт овощного пирога на этой платформе полностью превзошел мои ожидания.',
        saladReview: 'Я всегда считал себя энтузиастом салатов, и этот рецепт салата - настоящий кулинарный шедевр, который поднял мою любовь к зелени на совершенно новый уровень.',

        // Landing Page - Recipe Showcase
        discoverCreateShare: 'Открывайте, Создавайте, Делитесь',
        popularRecipesWeek: 'Посмотрите наши самые популярные рецепты этой недели',
        seeAll: 'Смотреть все',
        viewRecipe: 'Посмотреть рецепт',
        creamySalad: 'Кремовый салат',
        tofuSoup: 'Суп с тофу и томатами',
        crunchyPotatoes: 'Хрустящий картофель',
        mushroomSoup: 'Грибной суп',
        raspberryPancake: 'Блинчики с малиной',
        beefTeriyaki: 'Говядина терияки',
        mins: 'мин',
        serving: 'порция',
        servings: 'порций',
        easy: 'Легко',
        medium: 'Средне',

        // Landing Page - Mobile App
        mobileAppTitle: 'Наслаждайтесь радостью готовки - скачайте на iPhone или Android. Ваше кулинарное приключение начинается сейчас!',
        appStore: 'App Store',
        googlePlay: 'Google Play',

        // Landing Page - About
        aboutUs: 'О нас',
        aboutText: 'Наши рецепты - это сердце и душа нашего кулинарного сообщества, и они отражают нашу приверженность предоставлению вам незабываемых и восхитительных кулинарных впечатлений.',
        quickRecipesTip: '50+ быстрых рецептов, которые легко приготовить!',
        learnMore: 'Узнать больше',

        // Landing Page - Footer
        menu: 'Меню',
        categories: 'Категории',
        social: 'Соцсети',
        breakfast: 'Завтрак',
        lunch: 'Обед',
        dinner: 'Ужин',
        dessert: 'Десерт',
        drink: 'Напитки',
        instagram: 'Instagram',
        twitter: 'Twitter',
        youtube: 'Youtube',
        facebook: 'Facebook',
        newsletterSignup: 'Подпишитесь на нашу рассылку',
        emailPlaceholder: 'Ваш Email адрес',
        submit: 'Отправить',
        share: 'Поделиться',
        like: 'Нравится',

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

        // Landing Page - Hero Section
        landingHeroTitle: 'Ovqat tayyorlash qiziqarli va oson bo\'ldi: Ichki oshpazingizni oching',
        landingHeroSubtitle: 'Kashf eting',
        landingHeroRecipes: '10,000 dan ortiq retsept',
        landingHeroDescription: 'qo\'lingizda eng yaxshi retseptlar bilan. Ovqat tayyorlashning oson yo\'lini topishga yordam beramiz.',
        exploreRecipes: 'Retseptlarni o\'rganish',

        // Landing Page - Community
        fromOurCommunity: 'Jamiyatimizdan',
        spaghettiReview: 'Aytishim kerakki, Spagetti Bolonez retsepti juda ajoyib! Men har doim italyan oshxonasining muxlisi bo\'lganman, lekin uyda bu klassik taomni tayyorlashdan biroz qo\'rqardim.',
        chickenReview: 'Har doim butun tovuqni pishirishdan qo\'rqardim, bu juda murakkab bo\'lishi mumkin deb o\'ylagandim, lekin sizning retseptingiz buni o\'zgartirdi. Ko\'rsatmalar juda aniq va bajarish uchun oson edi.',
        potPieReview: 'Men har doim to\'yimli uy taomlarining muxlisi bo\'lganman va bu platformadagi sabzavotli pirog retsepti mening kutganlarimdan oshib ketdi.',
        saladReview: 'Men har doim o\'zimni salat ishqibozi deb hisoblaganman va bu salat retsepti - haqiqiy oshpazlik asari bo\'lib, yashil narsalarga bo\'lgan muhabbatimni yangi darajaga ko\'tardi.',

        // Landing Page - Recipe Showcase
        discoverCreateShare: 'Kashf qiling, Yarating, Baham ko\'ring',
        popularRecipesWeek: 'Bu haftaning eng mashhur retseptlarini ko\'ring',
        seeAll: 'Hammasini ko\'rish',
        viewRecipe: 'Retseptni ko\'rish',
        creamySalad: 'Kremli salat',
        tofuSoup: 'Tofu va pomidor sho\'rva',
        crunchyPotatoes: 'Xrustящий kartoshka',
        mushroomSoup: 'Qo\'ziqorin sho\'rva',
        raspberryPancake: 'Malina bilan pancake',
        beefTeriyaki: 'Mol go\'shti teriyaki',
        mins: 'daq',
        serving: 'porsiya',
        servings: 'porsiyalar',
        easy: 'Oson',
        medium: 'O\'rta',

        // Landing Page - Mobile App
        mobileAppTitle: 'Ovqat tayyorlash quvonchidan bahramand bo\'ling - iPhone yoki Android\'ga yuklab oling. Sizning oshxona sarguzashtingiz hozir boshlanadi!',
        appStore: 'App Store',
        googlePlay: 'Google Play',

        // Landing Page - About
        aboutUs: 'Biz haqimizda',
        aboutText: 'Bizning retseptlarimiz oshpazlik jamiyatimizning qalbi va ruhi bo\'lib, ular sizga unutilmas va ajoyib ovqatlanish tajribasini taqdim etishga bo\'lgan sodiqligimizni aks ettiradi.',
        quickRecipesTip: '50+ tez tayyorlanadigan retseptlar!',
        learnMore: 'Batafsil',

        // Landing Page - Footer
        menu: 'Menyu',
        categories: 'Kategoriyalar',
        social: 'Ijtimoiy tarmoqlar',
        breakfast: 'Nonushta',
        lunch: 'Tushlik',
        dinner: 'Kechki ovqat',
        dessert: 'Shirinlik',
        drink: 'Ichimliklar',
        instagram: 'Instagram',
        twitter: 'Twitter',
        youtube: 'Youtube',
        facebook: 'Facebook',
        newsletterSignup: 'Bizning yangiliklar xatimizga obuna bo\'ling',
        emailPlaceholder: 'Sizning Email manzilingiz',
        submit: 'Yuborish',
        share: 'Baham ko\'rish',
        like: 'Yoqdi',

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
