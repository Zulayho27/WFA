import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './AuthPages.css';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const { t, language } = useLanguage();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        display_name: '',
        preferred_language: language,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate password length
        if (formData.password.length < 8) {
            setError(t('language') === 'ru'
                ? 'Пароль должен содержать минимум 8 символов'
                : 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak');
            setLoading(false);
            return;
        }

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            setError(t('language') === 'ru'
                ? 'Пароли не совпадают'
                : 'Parollar mos kelmayapti');
            setLoading(false);
            return;
        }

        const result = await register(
            formData.email,
            formData.password,
            formData.display_name,
            formData.preferred_language
        );

        if (result.success) {
            navigate('/recipes');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="container">
                <div className="auth-container">
                    <div className="auth-card">
                        <div className="auth-header">
                            <h1>{t('register')}</h1>
                            <p>{t('language') === 'ru' ? 'Создайте свой аккаунт' : 'Akkaunt yarating'}</p>
                        </div>

                        {error && <div className="form-error error-box">{error}</div>}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="display_name" className="label">{t('displayName')}</label>
                                <input
                                    type="text"
                                    id="display_name"
                                    name="display_name"
                                    value={formData.display_name}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="label">{t('email')}</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password" className="label">
                                    {t('password')}
                                    <span className="text-gray text-sm"> (мин. 8 символов / kamida 8 ta belgi)</span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                    minLength="8"
                                    autoComplete="new-password"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword" className="label">{t('confirmPassword')}</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                    minLength="8"
                                    autoComplete="new-password"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="preferred_language" className="label">
                                    {t('language') === 'ru' ? 'Предпочитаемый язык' : 'Afzal til'}
                                </label>
                                <select
                                    id="preferred_language"
                                    name="preferred_language"
                                    value={formData.preferred_language}
                                    onChange={handleChange}
                                    className="select"
                                >
                                    <option value="ru">Русский</option>
                                    <option value="uz">O'zbekcha</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                                {loading ? t('loading') : t('register')}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>
                                {t('alreadyHaveAccount')}{' '}
                                <Link to="/login" className="text-primary">
                                    {t('loginHere')}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
