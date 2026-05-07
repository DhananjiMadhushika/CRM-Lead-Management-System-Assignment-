import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  handleLoginSuccess: (onReady: () => void) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      const token = sessionStorage.getItem('authToken');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: token },
        });

        if (response.status === 200) {
          setIsAuthenticated(true);
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userID');
        sessionStorage.removeItem('branchId');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

   const handleLoginSuccess = (onReady: () => void) => {
    setIsAuthenticated(true);

    const fetchUserData = async () => {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        onReady();
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: token },
        });

        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        onReady();
      }
    };

    fetchUserData();
  };

  const logout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userID');
    sessionStorage.removeItem('branchId');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, handleLoginSuccess, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};