import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';
import './RecipesPage.css';

const RecipesPage = () => {
    const { language, t } = useLanguage();
    const { isAuthenticated } = useAuth();

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [favorites, setFavorites] = useState(new Set());

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        fetchRecipes();
        fetchCountries();
        if (isAuthenticated) {
            fetchFavorites();
        }
    }, [language, searchQuery, selectedCountry, selectedCategory, isAuthenticated]);

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('lang', language);
            if (searchQuery) params.append('query', searchQuery);
            if (selectedCountry) params.append('country_id', selectedCountry);
            if (selectedCategory) params.append('category', selectedCategory);

            const response = await axios.get(`http://localhost:5000/api/search?${params}`);
            setRecipes(response.data.recipes);
        } catch (err) {
            setError('Failed to fetch recipes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/search/countries?lang=${language}`);
            setCountries(response.data);
        } catch (err) {
            console.error('Failed to fetch countries:', err);
        }
    };

    const fetchFavorites = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/favorites');
            const favoriteIds = new Set(response.data.favorites.map(f => f.recipe_id));
            setFavorites(favoriteIds);
        } catch (err) {
            console.error('Failed to fetch favorites:', err);
        }
    };

    const handleFavoriteToggle = async (recipeId) => {
        if (!isAuthenticated) {
            alert(t('language') === 'ru' ? 'Войдите для сохранения рецептов' : 'Retseptlarni saqlash uchun kiring');
            return;
        }

        try {
            if (favorites.has(recipeId)) {
                await axios.delete(`http://localhost:5000/api/favorites/${recipeId}`);
                setFavorites(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(recipeId);
                    return newSet;
                });
            } else {
                await axios.post(`http://localhost:5000/api/favorites/${recipeId}`);
                setFavorites(prev => new Set([...prev, recipeId]));
            }
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
        }
    };

    const categories = ['Супы', 'Основные блюда', 'Десерты', 'Закуски', 'Напитки'];

    return (
        <div className="recipes-page">
            <div className="container">
                {/* Header */}
                <header className="page-header">
                    <h1>{t('recipes')}</h1>
                    <p>{t('language') === 'ru' ? 'Откройте для себя рецепты со всего мира' : 'Dunyo bo\'ylab retseptlarni kashf eting'}</p>
                </header>

                {/* Filters */}
                <div className="filters-section">
                    {/* Search */}
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder={t('search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input search-input"
                        />
                        <span className="search-icon">🔍</span>
                    </div>

                    {/* Country Filter */}
                    <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="select"
                    >
                        <option value="">{t('allCountries')}</option>
                        {countries.map(country => (
                            <option key={country.country_id} value={country.country_id}>
                                {country.flag_icon} {country.name}
                            </option>
                        ))}
                    </select>

                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="select"
                    >
                        <option value="">{t('allCategories')}</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    {/* Clear Filters */}
                    {(searchQuery || selectedCountry || selectedCategory) && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCountry('');
                                setSelectedCategory('');
                            }}
                            className="btn btn-ghost"
                        >
                            ✕ {t('language') === 'ru' ? 'Очистить' : 'Tozalash'}
                        </button>
                    )}
                </div>

                {/* Recipes Grid */}
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>{t('loading')}</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <p>{error}</p>
                    </div>
                ) : recipes.length === 0 ? (
                    <div className="no-results">
                        <p>{t('noResults')}</p>
                    </div>
                ) : (
                    <div className="recipes-grid">
                        {recipes.map(recipe => (
                            <RecipeCard
                                key={recipe.recipe_id}
                                recipe={recipe}
                                onFavoriteToggle={handleFavoriteToggle}
                                isFavorite={favorites.has(recipe.recipe_id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipesPage;
