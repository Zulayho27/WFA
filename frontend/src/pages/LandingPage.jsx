import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './LandingPage.css';

const LandingPage = () => {
    const { t } = useLanguage();

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-background"></div>
                <div className="container hero-content">
                    <h1 className="hero-title animate-fade-in">
                        {t('heroTitle')}
                    </h1>
                    <p className="hero-subtitle animate-fade-in">
                        {t('heroSubtitle')}
                    </p>
                    <div className="hero-actions animate-fade-in">
                        <Link to="/recipes" className="btn btn-primary btn-lg">
                            {t('exploreRecipes')} →
                        </Link>
                        <Link to="/recipes" className="btn btn-outline btn-lg">
                            {t('learnMore')}
                        </Link>
                    </div>
                </div>

            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <h2 className="section-title text-center">
                        {t('language') === 'ru' ? 'Почему World Food Atlas?' : 'Nega World Food Atlas?'}
                    </h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon"></div>
                            <h3>{t('language') === 'ru' ? 'Мировая Кухня' : 'Dunyo Oshxonasi'}</h3>
                            <p>
                                {t('language') === 'ru'
                                    ? 'Рецепты из разных уголков планеты'
                                    : 'Dunyoning turli burchaklaridan retseptlar'}
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"></div>
                            <h3>{t('language') === 'ru' ? 'Проверенные Рецепты' : 'Tekshirilgan Retseptlar'}</h3>
                            <p>
                                {t('language') === 'ru'
                                    ? 'Детальные инструкции с пошаговыми шагами'
                                    : 'Bosqichma-bosqich batafsil ko\'rsatmalar'}
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"></div>
                            <h3>{t('language') === 'ru' ? 'Режим Готовки' : 'Pishirish Rejimi'}</h3>
                            <p>
                                {t('language') === 'ru'
                                    ? 'Удобный режим для приготовления'
                                    : 'Pishirish uchun qulay rejim'}
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"></div>
                            <h3>{t('language') === 'ru' ? 'Сохраняйте Любимое' : 'Sevimlilarni Saqlang'}</h3>
                            <p>
                                {t('language') === 'ru'
                                    ? 'Создавайте свою коллекцию рецептов'
                                    : 'O\'z retseptlar kolleksiyangizni yarating'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <h2>
                            {t('language') === 'ru'
                                ? 'Начните своё кулинарное путешествие сегодня'
                                : 'Bugun pazandachilik sayohatingizni boshlang'}
                        </h2>
                        <p>
                            {t('language') === 'ru'
                                ? 'Присоединяйтесь к нашему сообществу любителей кухни со всего мира'
                                : 'Dunyo bo\'ylab pazandachilik ishqibozlari jamoamizga qo\'shiling'}
                        </p>
                        <Link to="/register" className="btn btn-primary btn-lg">
                            {t('register')} →
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
