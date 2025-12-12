import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import CookingMode from '../components/CookingMode';
import './RecipeDetail.css';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { language, t } = useLanguage();
    const { isAuthenticated } = useAuth();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [servings, setServings] = useState(4);
    const [cookingMode, setCookingMode] = useState(false);

    useEffect(() => {
        fetchRecipe();
        if (isAuthenticated) {
            checkFavoriteStatus();
        }
    }, [id, language]);

    const fetchRecipe = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/recipes/${id}?lang=${language}`);
            setRecipe(response.data);
            setServings(response.data.original_servings);
        } catch (err) {
            setError('Failed to load recipe');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const checkFavoriteStatus = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/favorites/check/${id}`);
            setIsFavorite(response.data.isFavorite);
        } catch (err) {
            console.error('Failed to check favorite status:', err);
        }
    };

    const handleFavoriteToggle = async () => {
        if (!isAuthenticated) {
            alert(t('language') === 'ru' ? 'Войдите для сохранения рецептов' : 'Retseptlarni saqlash uchun kiring');
            navigate('/login');
            return;
        }

        try {
            if (isFavorite) {
                await axios.delete(`http://localhost:5000/api/favorites/${id}`);
                setIsFavorite(false);
            } else {
                await axios.post(`http://localhost:5000/api/favorites/${id}`);
                setIsFavorite(true);
            }
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
        }
    };

    const adjustIngredients = (quantity) => {
        if (!recipe) return quantity;
        const ratio = servings / recipe.original_servings;
        return (quantity * ratio).toFixed(1);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>{t('loading')}</p>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="error-container">
                <p>{error || 'Recipe not found'}</p>
            </div>
        );
    }

    if (cookingMode) {
        return (
            <CookingMode
                steps={recipe.steps}
                onExit={() => setCookingMode(false)}
            />
        );
    }

    const imageUrl = recipe.image_url
        ? `http://localhost:5000${recipe.image_url}`
        : 'https://via.placeholder.com/1200x450?text=No+Image';

    return (
        <div className="recipe-detail">
            {/* Hero Section */}
            <div className="recipe-hero">
                <img src={imageUrl} alt={recipe.title} className="recipe-hero-image" />
                <div className="recipe-hero-overlay">
                    <div className="container">
                        <div className="recipe-hero-content">
                            <div className="recipe-country-badge">
                                <span className="country-flag-large">{recipe.flag_icon}</span>
                                <span>{recipe.country_name}</span>
                            </div>
                            <h1 className="recipe-hero-title">{recipe.title}</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container recipe-container">
                {/* Action Buttons */}
                <div className="recipe-actions">
                    <button onClick={handleFavoriteToggle} className="btn btn-outline">
                        {isFavorite ? '❤️' : '🤍'} {isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
                    </button>
                    <button onClick={() => setCookingMode(true)} className="btn btn-primary">
                        {t('startCookingMode')}
                    </button>
                </div>

                {/* Description */}
                <section className="recipe-section">
                    <p className="recipe-description">{recipe.description}</p>
                </section>

                {/* Time & Servings Info */}
                <div className="recipe-info-grid">
                    <div className="info-card">
                        <span className="info-icon">⏱️</span>
                        <div>
                            <div className="info-label">{t('prepTime')}</div>
                            <div className="info-value">{recipe.prep_time_min} {t('min')}</div>
                        </div>
                    </div>
                    <div className="info-card">
                        <span className="info-icon">🔥</span>
                        <div>
                            <div className="info-label">{t('cookTime')}</div>
                            <div className="info-value">{recipe.cook_time_min} {t('min')}</div>
                        </div>
                    </div>
                    <div className="info-card">
                        <span className="info-icon">🍽️</span>
                        <div>
                            <div className="info-label">{t('servings')}</div>
                            <div className="servings-adjuster">
                                <button onClick={() => setServings(Math.max(1, servings - 1))}>−</button>
                                <span>{servings}</span>
                                <button onClick={() => setServings(servings + 1)}>+</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ingredients */}
                <section className="recipe-section">
                    <h2>{t('ingredients')}</h2>
                    <div className="ingredients-list">
                        {recipe.ingredients.map((ing) => (
                            <div key={ing.ingredient_id} className="ingredient-item">
                                <span className="ingredient-bullet">•</span>
                                <span className="ingredient-name">{ing.name}</span>
                                <span className="ingredient-quantity">
                                    {adjustIngredients(ing.quantity)} {ing.unit}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Instructions */}
                <section className="recipe-section">
                    <h2>{t('instructions')}</h2>
                    <div className="steps-list">
                        {recipe.steps.map((step) => (
                            <div key={step.step_id} className="step-item">
                                <div className="step-number">{step.step_number}</div>
                                <div className="step-content">{step.description}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Cultural Context */}
                {recipe.cultural_context && (
                    <section className="recipe-section cultural-context">
                        <h2>{t('culturalContext')}</h2>
                        <p>{recipe.cultural_context}</p>
                    </section>
                )}
            </div>
        </div>
    );
};

export default RecipeDetail;
