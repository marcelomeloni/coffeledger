// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useMemo, useCallback, useEffect } from 'react';
import { getKeypairFromCredentials } from '../lib/authUtils';

const AuthContext = createContext(null);
const LOCAL_STORAGE_KEY = 'coffee-trace-credentials';

export function AuthProvider({ children }) {
    const [keypair, setKeypair] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const savedCredentials = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedCredentials) {
                const { username, password } = JSON.parse(savedCredentials);
                login(username, password);
            }
        } catch (err) {
            console.error("Falha ao restaurar sessão:", err);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback(async (username, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const generatedKeypair = await getKeypairFromCredentials(username, password);
            setKeypair(generatedKeypair);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ username, password }));
            return true;
        } catch (err) {
            console.error("Falha no login:", err);
            setError("Credenciais inválidas.");
            setKeypair(null);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setKeypair(null);
        setError(null);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    }, []);

    const value = useMemo(() => ({
        keypair,
        publicKey: keypair?.publicKey,
        isAuthenticated: !!keypair,
        isLoading,
        error,
        login,
        logout,
    }), [keypair, isLoading, error, login, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};