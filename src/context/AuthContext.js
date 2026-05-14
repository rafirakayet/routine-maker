import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// ✅ Works from any device on the network
const API_BASE_URL = 'http://routinemaker.infinityfreeapp.com/api'

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [sessionToken, setSessionToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const savedToken = localStorage.getItem('session_token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
            setSessionToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const saveUserData = async (dataKey, dataValue) => {
        if (!sessionToken) return false;
        setSaving(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/save.php`, {
                session_token: sessionToken,
                data_key: dataKey,
                data_value: JSON.stringify(dataValue)
            });
            return response.data.success;
        } catch (error) {
            console.error('Save error:', error);
            return false;
        } finally {
            setSaving(false);
        }
    };

    const loadUserData = async (dataKey) => {
        if (!sessionToken) return null;
        try {
            const response = await axios.get(`${API_BASE_URL}/load.php`, {
                params: {
                    session_token: sessionToken,
                    data_key: dataKey
                }
            });
            if (response.data.success && response.data.data) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error('Load error:', error);
            return null;
        }
    };

    const signup = async (username, email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth.php?action=register`, {
                username,
                email,
                password
            });
            if (response.data.success) {
                localStorage.setItem('session_token', response.data.session_token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setSessionToken(response.data.session_token);
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            return { success: false, message: 'Network error' };
        }
    };

    const signin = async (username, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth.php?action=login`, {
                username,
                password
            });
            if (response.data.success) {
                localStorage.setItem('session_token', response.data.session_token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setSessionToken(response.data.session_token);
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            return { success: false, message: 'Network error' };
        }
    };

    const signout = async () => {
        if (sessionToken) {
            try {
                await axios.post(`${API_BASE_URL}/logout.php`, {
                    session_token: sessionToken
                });
            } catch (error) {}
        }
        localStorage.removeItem('session_token');
        localStorage.removeItem('user');
        setSessionToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user, sessionToken, loading, saving,
            signup, signin, signout, saveUserData, loadUserData
        }}>
            {children}
        </AuthContext.Provider>
    );
};
