// context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { getMe } from '../api/authService';
import type { UserPublic } from '../types/api';

interface AuthContextType {
  user: UserPublic | null;
  token: string | null;
  isLoading: boolean;
  login: (newToken: string) => void;
  logout: () => void;
  updateUserContext: (newUser: UserPublic) => void; // <-- Add this line
}

// ... (AuthContext definition is the same)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ... (This useEffect remains the same)
    const fetchUser = async () => {
      if (token) {
        try {
          const userData = await getMe();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user, logging out.", error);
          logout(); // Use the logout function here
        }
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  // --- NEW FUNCTION TO UPDATE USER STATE ---
  const updateUserContext = (newUser: UserPublic) => {
    setUser(newUser);
  };
  
  const value = useMemo(() => ({ user, token, isLoading, login, logout, updateUserContext }), [user, token, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ... (useAuth hook is the same)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};