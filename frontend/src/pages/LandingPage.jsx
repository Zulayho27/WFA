import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './LandingPage.css';

const LandingPage = () => {
    const { t } = useLanguage();

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <div className="emoji-decoration tomato">🍅</div>
                        <h1 className="hero-title">
                            {t('landingHeroTitle')}
                        </h1>
                        <p className="hero-subtitle">
                            {t('landingHeroSubtitle')} <span className="highlight">{t('landingHeroRecipes')}</span> {t('landingHeroDescription')}
                        </p>
                        <Link to="/recipes" className="cta-button">
                            {t('exploreRecipes')}
                        </Link>
                        <div className="emoji-decoration garlic">🧄</div>
                    </div>

                    <div className="hero-visuals">
                        <div className="emoji-decoration broccoli">🥦</div>

                        {/* Floating Testimonial Cards */}
                        <div className="testimonial-card card-1">
                            <div className="testimonial-content">
                                <div className="stars">⭐⭐⭐⭐⭐</div>
                                <p className="testimonial-text">
                                    {t('spaghettiReview')}
                                </p>
                                <div className="testimonial-author">
                                    <div className="author-avatar">👤</div>
                                    <span className="author-name">Favelina J.</span>
                                    <span className="heart-icon">❤️</span>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card card-2">
                            <div className="testimonial-content">
                                <div className="stars">⭐⭐⭐⭐⭐</div>
                                <p className="testimonial-text">
                                    {t('chickenReview')}
                                </p>
                                <div className="testimonial-author">
                                    <div className="author-avatar">👤</div>
                                    <span className="author-name">Sarah M.</span>
                                    <span className="heart-icon">❤️</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image Placeholder */}
                        <div className="hero-image-container">
                            <div className="hero-image">🍽️</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section className="community-section">
                <h2 className="section-title">{t('fromOurCommunity')}</h2>

                <div className="community-grid">
                    <div className="community-card">
                        <div className="card-header">
                            <div className="user-info">
                                <div className="user-avatar">👤</div>
                                <div>
                                    <h3 className="recipe-name">Spaghetti Bolognese</h3>
                                    <p className="user-name">Elly Jess</p>
                                </div>
                            </div>
                        </div>
                        <div className="stars">⭐⭐⭐⭐⭐</div>
                        <p className="review-text">
                            {t('spaghettiReview')}
                        </p>
                        <div className="recipe-image">🍝</div>
                        <div className="card-actions">
                            <button className="action-btn">👍 2</button>
                            <button className="action-btn">{t('share')}</button>
                        </div>
                    </div>

                    <div className="community-card">
                        <div className="card-header">
                            <div className="user-info">
                                <div className="user-avatar">👤</div>
                                <div>
                                    <h3 className="recipe-name">Roasted Chicken</h3>
                                    <p className="user-name">Elly Jess</p>
                                </div>
                            </div>
                        </div>
                        <div className="stars">⭐⭐⭐⭐⭐</div>
                        <p className="review-text">
                            {t('chickenReview')}
                        </p>
                        <div className="recipe-image">🍗</div>
                        <div className="card-actions">
                            <button className="action-btn">👍 5</button>
                            <button className="action-btn">{t('share')}</button>
                        </div>
                    </div>

                    <div className="community-card">
                        <div className="card-header">
                            <div className="user-info">
                                <div className="user-avatar">👤</div>
                                <div>
                                    <h3 className="recipe-name">Vegetable Pot Pie</h3>
                                    <p className="user-name">Elly Jess</p>
                                </div>
                            </div>
                        </div>
                        <div className="stars">⭐⭐⭐⭐⭐</div>
                        <p className="review-text">
                            {t('potPieReview')}
                        </p>
                        <div className="recipe-image">🥧</div>
                        <div className="card-actions">
                            <button className="action-btn">👍 3</button>
                            <button className="action-btn">{t('share')}</button>
                        </div>
                    </div>

                    <div className="community-card">
                        <div className="card-header">
                            <div className="user-info">
                                <div className="user-avatar">👤</div>
                                <div>
                                    <h3 className="recipe-name">Fresh Garden Salad</h3>
                                    <p className="user-name">Elly Jess</p>
                                </div>
                            </div>
                        </div>
                        <div className="stars">⭐⭐⭐⭐⭐</div>
                        <p className="review-text">
                            {t('saladReview')}
                        </p>
                        <div className="recipe-image">🥗</div>
                        <div className="card-actions">
                            <button className="action-btn">👍 1</button>
                            <button className="action-btn">{t('share')}</button>
                        </div>
                    </div>
                </div>

                <div className="pagination">
                    <button className="page-btn">‹</button>
                    <button className="page-btn">›</button>
                </div>
            </section>

            {/* Recipe Showcase Section */}
            <section className="recipe-showcase">
                <div className="showcase-header">
                    <h2 className="section-title">{t('discoverCreateShare')}</h2>
                    <p className="section-subtitle">{t('popularRecipesWeek')}</p>
                    <Link to="/recipes" className="see-all-btn">{t('seeAll')}</Link>
                </div>

                <div className="recipe-grid">
                    <div className="recipe-card">
                        <div className="recipe-image-wrapper">
                            <div className="recipe-img">🥗</div>
                        </div>
                        <div className="recipe-info">
                            <div className="recipe-meta">
                                <span className="meta-item">🕐 10 {t('mins')}</span>
                                <span className="meta-item">👥 2 {t('servings')}</span>
                                <span className="meta-item difficulty">📊 {t('easy')}</span>
                            </div>
                            <h3 className="recipe-title">{t('creamySalad')}</h3>
                            <Link to="/recipes" className="view-recipe">{t('viewRecipe')}</Link>
                        </div>
                    </div>

                    <div className="recipe-card">
                        <div className="recipe-image-wrapper">
                            <div className="recipe-img">🍲</div>
                        </div>
                        <div className="recipe-info">
                            <div className="recipe-meta">
                                <span className="meta-item">🕐 15 {t('mins')}</span>
                                <span className="meta-item">👥 3 {t('servings')}</span>
                                <span className="meta-item difficulty">📊 {t('easy')}</span>
                            </div>
                            <h3 className="recipe-title">{t('tofuSoup')}</h3>
                            <Link to="/recipes" className="view-recipe">{t('viewRecipe')}</Link>
                        </div>
                    </div>

                    <div className="recipe-card">
                        <div className="recipe-image-wrapper">
                            <div className="recipe-img">🥔</div>
                        </div>
                        <div className="recipe-info">
                            <div className="recipe-meta">
                                <span className="meta-item">🕐 10 {t('mins')}</span>
                                <span className="meta-item">👥 2 {t('servings')}</span>
                                <span className="meta-item difficulty">📊 {t('easy')}</span>
                            </div>
                            <h3 className="recipe-title">{t('crunchyPotatoes')}</h3>
                            <Link to="/recipes" className="view-recipe">{t('viewRecipe')}</Link>
                        </div>
                    </div>

                    <div className="recipe-card">
                        <div className="recipe-image-wrapper">
                            <div className="recipe-img">🍄</div>
                        </div>
                        <div className="recipe-info">
                            <div className="recipe-meta">
                                <span className="meta-item">🕐 25 {t('mins')}</span>
                                <span className="meta-item">👥 2 {t('servings')}</span>
                                <span className="meta-item difficulty">📊 {t('medium')}</span>
                            </div>
                            <h3 className="recipe-title">{t('mushroomSoup')}</h3>
                            <Link to="/recipes" className="view-recipe">{t('viewRecipe')}</Link>
                        </div>
                    </div>

                    <div className="recipe-card">
                        <div className="recipe-image-wrapper">
                            <div className="recipe-img">🥞</div>
                        </div>
                        <div className="recipe-info">
                            <div className="recipe-meta">
                                <span className="meta-item">🕐 30 {t('mins')}</span>
                                <span className="meta-item">👥 1 {t('serving')}</span>
                                <span className="meta-item difficulty">📊 {t('easy')}</span>
                            </div>
                            <h3 className="recipe-title">{t('raspberryPancake')}</h3>
                            <Link to="/recipes" className="view-recipe">{t('viewRecipe')}</Link>
                        </div>
                    </div>

                    <div className="recipe-card">
                        <div className="recipe-image-wrapper">
                            <div className="recipe-img">🍖</div>
                        </div>
                        <div className="recipe-info">
                            <div className="recipe-meta">
                                <span className="meta-item">🕐 20 {t('mins')}</span>
                                <span className="meta-item">👥 3 {t('servings')}</span>
                                <span className="meta-item difficulty">📊 {t('medium')}</span>
                            </div>
                            <h3 className="recipe-title">{t('beefTeriyaki')}</h3>
                            <Link to="/recipes" className="view-recipe">{t('viewRecipe')}</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mobile App Section */}
            <section className="mobile-app-section">
                <div className="app-content">
                    <div className="app-text">
                        <h2 className="app-title">
                            {t('mobileAppTitle')}
                        </h2>
                        <div className="app-buttons">
                            <button className="app-store-btn">📱 {t('appStore')}</button>
                            <button className="play-store-btn">▶️ {t('googlePlay')}</button>
                        </div>
                    </div>
                    <div className="app-mockup">
                        <div className="phone-mockup">📱</div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section">
                <div className="about-background"></div>
                <div className="about-content">
                    <div className="about-card">
                        <h2 className="about-title">{t('aboutUs')}</h2>
                        <p className="about-text">
                            {t('aboutText')}
                        </p>
                        <button className="learn-more-btn">{t('learnMore')}</button>
                    </div>
                    <div className="quick-tip">
                        <p>{t('quickRecipesTip')}</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <div className="footer-logo">
                            <span className="logo-emoji">🍳</span>
                            <span className="logo-text">World Food Atlas</span>
                        </div>
                        <div className="footer-columns">
                            <div className="footer-column">
                                <h3>{t('menu')}</h3>
                                <ul>
                                    <li><Link to="/">{t('home')}</Link></li>
                                    <li><Link to="/recipes">{t('recipes')}</Link></li>
                                    <li><Link to="/profile">{t('profile')}</Link></li>
                                    <li><Link to="/about">{t('aboutUs')}</Link></li>
                                </ul>
                            </div>
                            <div className="footer-column">
                                <h3>{t('categories')}</h3>
                                <ul>
                                    <li><a href="#">{t('breakfast')}</a></li>
                                    <li><a href="#">{t('lunch')}</a></li>
                                    <li><a href="#">{t('dinner')}</a></li>
                                    <li><a href="#">{t('dessert')}</a></li>
                                    <li><a href="#">{t('drink')}</a></li>
                                </ul>
                            </div>
                            <div className="footer-column">
                                <h3>{t('social')}</h3>
                                <ul>
                                    <li><a href="#">{t('instagram')}</a></li>
                                    <li><a href="#">{t('twitter')}</a></li>
                                    <li><a href="#">{t('youtube')}</a></li>
                                    <li><a href="#">{t('facebook')}</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="newsletter-section">
                        <div className="emoji-decoration tomato-footer">🍅</div>
                        <h3>{t('newsletterSignup')}</h3>
                        <form className="newsletter-form">
                            <input
                                type="email"
                                placeholder={t('emailPlaceholder')}
                                className="newsletter-input"
                            />
                            <button type="submit" className="submit-btn">{t('submit')}</button>
                        </form>
                        <div className="emoji-decoration eggplant">🍆</div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
