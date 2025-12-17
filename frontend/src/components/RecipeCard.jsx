import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getImageUrl } from '../utils/api';
import './RecipeCard.css';

const RecipeCard = ({ recipe, onFavoriteToggle, isFavorite }) => {
    const { t } = useLanguage();

    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onFavoriteToggle) {
            onFavoriteToggle(recipe.recipe_id);
        }
    };

    const imageUrl = recipe.image_url
        ? getImageUrl(recipe.image_url)
        : 'https://via.placeholder.com/400x300?text=No+Image';

    return (
        <Link to={`/recipes/${recipe.recipe_id}`} className="recipe-card">
            <div
                className="recipe-image-container"
                style={{ backgroundImage: `url(${imageUrl})` }}
            >
                {onFavoriteToggle && (
                    <button
                        onClick={handleFavoriteClick}
                        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                        aria-label="Toggle favorite"
                    >
                        {isFavorite ? '❤️' : '🤍'}
                    </button>
                )}
            </div>

            <div className="recipe-content">
                <div className="recipe-country">
                    <span className="country-flag">{recipe.flag_icon}</span>
                    <span className="country-name">{recipe.country_name}</span>
                </div>

                <h3 className="recipe-title">{recipe.title}</h3>

                <p className="recipe-description">{recipe.description}</p>

                <div className="recipe-meta">
                    <div className="meta-item">
                        <span className="meta-icon">⏱️</span>
                        <span>{recipe.total_time_min} {t('min')}</span>
                    </div>
                    {recipe.avg_rating > 0 && (
                        <div className="meta-item">
                            <span className="meta-icon">⭐</span>
                            <span>{Number(recipe.avg_rating).toFixed(1)}</span>
                        </div>
                    )}
                </div>

                <div className="recipe-category-tag">
                    {recipe.category}
                </div>
            </div>
        </Link>
    );
};

export default RecipeCard;
