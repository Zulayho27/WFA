import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { language, toggleLanguage, t } = useLanguage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">🌍</span>
                    <span className="logo-text">World Food Atlas</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="navbar-links">
                    <Link to="/" className="nav-link">{t('home')}</Link>
                    <Link to="/recipes" className="nav-link">{t('recipes')}</Link>
                    {isAuthenticated && (
                        <Link to="/favorites" className="nav-link">{t('favorites')}</Link>
                    )}
                    {isAdmin() && (
                        <Link to="/admin" className="nav-link nav-link-admin">{t('admin')}</Link>
                    )}
                </div>

                {/* Right Side */}
                <div className="navbar-actions">
                    {/* Language Toggle */}
                    <button
                        onClick={toggleLanguage}
                        className="lang-toggle"
                        aria-label="Toggle language"
                    >
                        <span className="lang-text">{language.toUpperCase()}</span>
                    </button>

                    {/* Auth Actions */}
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <Link to="/profile" className="btn btn-ghost">
                                👤 {user?.display_name}
                            </Link>
                            <button onClick={handleLogout} className="btn btn-outline">
                                {t('logout')}
                            </button>
                        </div>
                    ) : (
                        <div className="auth-actions">
                            <Link to="/login" className="btn btn-ghost">{t('login')}</Link>
                            <Link to="/register" className="btn btn-primary">{t('register')}</Link>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="mobile-menu">
                    <Link to="/" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                        {t('home')}
                    </Link>
                    <Link to="/recipes" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                        {t('recipes')}
                    </Link>
                    {isAuthenticated && (
                        <>
                            <Link to="/favorites" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                                {t('favorites')}
                            </Link>
                            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                                {t('profile')}
                            </Link>
                            {isAdmin() && (
                                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                                    {t('admin')}
                                </Link>
                            )}
                        </>
                    )}
                    {!isAuthenticated && (
                        <>
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                                {t('login')}
                            </Link>
                            <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                                {t('register')}
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
