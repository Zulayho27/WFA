// API configuration
const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';

export const getApiUrl = (path) => {
    // In production, use relative paths (same origin)
    // In development, use full URL to backend server
    return `${API_BASE_URL}${path}`;
};

export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    // Otherwise, prepend the API base URL
    return `${API_BASE_URL}${imagePath}`;
};

export default {
    getApiUrl,
    getImageUrl
};
