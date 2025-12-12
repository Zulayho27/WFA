import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import RecipeCard from '../components/RecipeCard';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user } = useAuth();
    const { language, t } = useLanguage();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, [language]);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/favorites?lang=${language}`);
            setFavorites(response.data.favorites);
        } catch (err) {
            console.error('Failed to fetch favorites:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (recipeId) => {
        try {
            await axios.delete(`http://localhost:5000/api/favorites/${recipeId}`);
            setFavorites(favorites.filter(f => f.recipe_id !== recipeId));
        } catch (err) {
            console.error('Failed to remove favorite:', err);
        }
    };

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user?.display_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1>{user?.display_name}</h1>
                        <p className="profile-email">{user?.email}</p>
                    </div>
                </div>

                <section className="favorites-section">
                    <h2>{t('favorites')}</h2>
                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : favorites.length === 0 ? (
                        <div className="no-favorites">
                            <p>{t('language') === 'ru' ? 'У вас пока нет избранных рецептов' : 'Sizda hali sevimli retseptlar yo\'q'}</p>
                        </div>
                    ) : (
                        <div className="recipes-grid">
                            {favorites.map(recipe => (
                                <RecipeCard
                                    key={recipe.recipe_id}
                                    recipe={recipe}
                                    onFavoriteToggle={handleRemoveFavorite}
                                    isFavorite={true}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default ProfilePage;
