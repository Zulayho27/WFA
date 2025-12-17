import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if we have a token and validate it
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            // Set axios default header
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }

        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login', {
                email,
                password,
            });

            const { user: userData, token: authToken } = response.data;

            setUser(userData);
            setToken(authToken);
            localStorage.setItem('token', authToken);
            localStorage.setItem('user', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

            return { success: true };
        } catch (error) {
            console.error('Login error:', error.response);

            // Handle validation errors array
            if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
                const errorMessage = error.response.data.errors.map(err => err.msg).join(', ');
                return { success: false, error: errorMessage };
            }

            // Handle single error message
            const errorMessage = error.response?.data?.error || 'Login failed';
            return { success: false, error: errorMessage };
        }
    };

    const register = async (email, password, display_name, preferred_language = 'ru') => {
        try {
            const response = await axios.post('/api/auth/register', {
                email,
                password,
                display_name,
                preferred_language,
            });

            const { user: userData, token: authToken } = response.data;

            setUser(userData);
            setToken(authToken);
            localStorage.setItem('token', authToken);
            localStorage.setItem('user', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

            return { success: true };
        } catch (error) {
            console.error('Registration error:', error.response);

            // Handle validation errors array
            if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
                const errorMessage = error.response.data.errors.map(err => err.msg).join(', ');
                return { success: false, error: errorMessage };
            }

            // Handle single error message
            const errorMessage = error.response?.data?.error || 'Registration failed';
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    const isAdmin = () => {
        return user?.role === 'Admin';
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
