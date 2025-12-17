import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import API_URL from '../config/api';
import './AdminPage.css';

const AdminPage = () => {
    const { language, t } = useLanguage();
    const [recipes, setRecipes] = useState([]);
    const [countries, setCountries] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showCountryModal, setShowCountryModal] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState(null);

    const [formData, setFormData] = useState({
        title_ru: '',
        title_uz: '',
        description_ru: '',
        description_uz: '',
        country_id: '',
        category: '',
        prep_time_min: '',
        cook_time_min: '',
        original_servings: 4,
        imageFile: null,
        imagePreview: null,
        steps: [{ step_number: 1, description_ru: '', description_uz: '' }]
    });

    const [newCountry, setNewCountry] = useState({
        name_ru: '',
        name_uz: '',
        flag_icon: ''
    });

    useEffect(() => {
        fetchRecipes();
        fetchCountries();
    }, []);

    const fetchRecipes = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/recipes?lang=${language}`);
            setRecipes(response.data.recipes);
        } catch (err) {
            console.error('Failed to fetch recipes:', err);
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/countries?lang=${language}`);
            setCountries(response.data);
        } catch (err) {
            console.error('Failed to fetch countries:', err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                imageFile: file,
                imagePreview: URL.createObjectURL(file)
            });
        }
    };

    const handleStepChange = (index, field, value) => {
        const newSteps = [...formData.steps];
        newSteps[index][field] = value;
        setFormData({ ...formData, steps: newSteps });
    };

    const addStep = () => {
        setFormData({
            ...formData,
            steps: [...formData.steps, {
                step_number: formData.steps.length + 1,
                description_ru: '',
                description_uz: ''
            }]
        });
    };

    const removeStep = (index) => {
        const newSteps = formData.steps.filter((_, i) => i !== index);
        // Renumber steps
        newSteps.forEach((step, i) => step.step_number = i + 1);
        setFormData({ ...formData, steps: newSteps });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('title_ru', formData.title_ru);
        data.append('title_uz', formData.title_uz);
        data.append('description_ru', formData.description_ru);
        data.append('description_uz', formData.description_uz);
        data.append('country_id', formData.country_id);
        data.append('category', formData.category);
        data.append('prep_time_min', formData.prep_time_min);
        data.append('cook_time_min', formData.cook_time_min);
        data.append('original_servings', formData.original_servings);
        data.append('steps', JSON.stringify(formData.steps));

        if (formData.imageFile) {
            data.append('image', formData.imageFile);
        }

        try {
            if (editingRecipe) {
                await axios.put(`${API_URL}/api/recipes/${editingRecipe.recipe_id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post(`${API_URL}/api/recipes`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            resetForm();
            fetchRecipes();
        } catch (err) {
            console.error('Failed to save recipe:', err);
            alert('Failed to save recipe: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleEdit = (recipe) => {
        setEditingRecipe(recipe);
        setFormData({
            title_ru: recipe.title_ru || recipe.title,
            title_uz: recipe.title_uz || recipe.title,
            description_ru: recipe.description_ru || recipe.description,
            description_uz: recipe.description_uz || recipe.description,
            country_id: recipe.country_id || '',
            category: recipe.category || '',
            prep_time_min: recipe.prep_time_min || '',
            cook_time_min: recipe.cook_time_min || '',
            original_servings: recipe.original_servings || 4,
            imageFile: null,
            imagePreview: recipe.image_url ? `${API_URL}${recipe.image_url}` : null,
            steps: recipe.steps || [{ step_number: 1, description_ru: '', description_uz: '' }]
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('language') === 'ru' ? 'Удалить рецепт?' : 'Retseptni o\'chirish?')) {
            try {
                await axios.delete(`${API_URL}/api/recipes/${id}`);
                fetchRecipes();
            } catch (err) {
                console.error('Failed to delete recipe:', err);
            }
        }
    };

    const handleCreateCountry = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/countries`, newCountry);
            setShowCountryModal(false);
            setNewCountry({ name_ru: '', name_uz: '', flag_icon: '' });
            fetchCountries();
        } catch (err) {
            console.error('Failed to create country:', err);
            alert('Failed to create country: ' + (err.response?.data?.error || err.message));
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingRecipe(null);
        setFormData({
            title_ru: '',
            title_uz: '',
            description_ru: '',
            description_uz: '',
            country_id: '',
            category: '',
            prep_time_min: '',
            cook_time_min: '',
            original_servings: 4,
            imageFile: null,
            imagePreview: null,
            steps: [{ step_number: 1, description_ru: '', description_uz: '' }]
        });
    };

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1>{t('admin')}</h1>
                    <div className="header-actions">
                        <button onClick={() => setShowCountryModal(true)} className="btn btn-outline">
                            + Новая страна
                        </button>
                        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                            {showForm ? t('cancel') : `+ ${t('addRecipe')}`}
                        </button>
                    </div>
                </div>

                {showForm && (
                    <div className="admin-form-container">
                        <h2>{editingRecipe ? t('editRecipe') : t('addRecipe')}</h2>
                        <form onSubmit={handleSubmit} className="admin-form">
                            {/* Image Upload */}
                            <div className="form-group image-upload-section">
                                <label className="label">Изображение рецепта</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="input"
                                />
                                {formData.imagePreview && (
                                    <div className="image-preview">
                                        <img src={formData.imagePreview} alt="Preview" />
                                    </div>
                                )}
                            </div>

                            {/* Title Fields */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="label">{t('recipeTitle')} (RU)</label>
                                    <input
                                        type="text"
                                        name="title_ru"
                                        value={formData.title_ru}
                                        onChange={handleInputChange}
                                        className="input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="label">{t('recipeTitle')} (UZ)</label>
                                    <input
                                        type="text"
                                        name="title_uz"
                                        value={formData.title_uz}
                                        onChange={handleInputChange}
                                        className="input"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Description Fields */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="label">{t('description')} (RU)</label>
                                    <textarea
                                        name="description_ru"
                                        value={formData.description_ru}
                                        onChange={handleInputChange}
                                        className="textarea"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="label">{t('description')} (UZ)</label>
                                    <textarea
                                        name="description_uz"
                                        value={formData.description_uz}
                                        onChange={handleInputChange}
                                        className="textarea"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Country and Category */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="label">{t('country')}</label>
                                    <select
                                        name="country_id"
                                        value={formData.country_id}
                                        onChange={handleInputChange}
                                        className="select"
                                        required
                                    >
                                        <option value="">Выберите страну</option>
                                        {countries.map(c => (
                                            <option key={c.country_id} value={c.country_id}>
                                                {c.flag_icon} {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="label">{t('category')}</label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="input"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Time Fields */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="label">{t('prepTime')} (мин)</label>
                                    <input
                                        type="number"
                                        name="prep_time_min"
                                        value={formData.prep_time_min}
                                        onChange={handleInputChange}
                                        className="input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="label">{t('cookTime')} (мин)</label>
                                    <input
                                        type="number"
                                        name="cook_time_min"
                                        value={formData.cook_time_min}
                                        onChange={handleInputChange}
                                        className="input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="label">{t('servings')}</label>
                                    <input
                                        type="number"
                                        name="original_servings"
                                        value={formData.original_servings}
                                        onChange={handleInputChange}
                                        className="input"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Steps Section */}
                            <div className="steps-section">
                                <div className="section-header">
                                    <h3>Шаги приготовления</h3>
                                    <button type="button" onClick={addStep} className="btn btn-outline btn-sm">
                                        + Добавить шаг
                                    </button>
                                </div>
                                {formData.steps.map((step, index) => (
                                    <div key={index} className="step-item-form">
                                        <div className="step-number-badge">{step.step_number}</div>
                                        <div className="step-fields">
                                            <div className="form-group">
                                                <label className="label">Описание (RU)</label>
                                                <textarea
                                                    value={step.description_ru}
                                                    onChange={(e) => handleStepChange(index, 'description_ru', e.target.value)}
                                                    className="textarea"
                                                    rows="2"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="label">Описание (UZ)</label>
                                                <textarea
                                                    value={step.description_uz}
                                                    onChange={(e) => handleStepChange(index, 'description_uz', e.target.value)}
                                                    className="textarea"
                                                    rows="2"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {formData.steps.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeStep(index)}
                                                className="btn-remove-step"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">
                                    {t('save')}
                                </button>
                                <button type="button" onClick={resetForm} className="btn btn-outline">
                                    {t('cancel')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Recipes Table */}
                <div className="recipes-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t('recipeTitle')}</th>
                                <th>{t('country')}</th>
                                <th>{t('category')}</th>
                                <th>{t('language') === 'ru' ? 'Действия' : 'Amallar'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recipes.map(recipe => (
                                <tr key={recipe.recipe_id}>
                                    <td>{recipe.recipe_id}</td>
                                    <td>{recipe.title}</td>
                                    <td>{recipe.flag_icon} {recipe.country_name}</td>
                                    <td>{recipe.category}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button onClick={() => handleEdit(recipe)} className="btn-small btn-edit">
                                                ✏️
                                            </button>
                                            <button onClick={() => handleDelete(recipe.recipe_id)} className="btn-small btn-delete">
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Country Creation Modal */}
            {showCountryModal && (
                <div className="modal-overlay" onClick={() => setShowCountryModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Создать новую страну</h2>
                        <form onSubmit={handleCreateCountry} className="country-form">
                            <div className="form-group">
                                <label className="label">Название (RU)</label>
                                <input
                                    type="text"
                                    value={newCountry.name_ru}
                                    onChange={(e) => setNewCountry({ ...newCountry, name_ru: e.target.value })}
                                    className="input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">Название (UZ)</label>
                                <input
                                    type="text"
                                    value={newCountry.name_uz}
                                    onChange={(e) => setNewCountry({ ...newCountry, name_uz: e.target.value })}
                                    className="input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">Флаг (эмодзи)</label>
                                <input
                                    type="text"
                                    value={newCountry.flag_icon}
                                    onChange={(e) => setNewCountry({ ...newCountry, flag_icon: e.target.value })}
                                    className="input"
                                    placeholder="🇷🇺"
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">
                                    Создать
                                </button>
                                <button type="button" onClick={() => setShowCountryModal(false)} className="btn btn-outline">
                                    Отмена
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
