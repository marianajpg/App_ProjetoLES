import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCustomerByEmail } from '../services/customers.jsx';  

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const navigate = useNavigate();  

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  

   const identifyUserByEmail = async (email, tipoUsuario = 'cliente') => {
    if (!email) throw new Error('E-mail é obrigatório para login');
    const costumer = await getCustomerByEmail(email);
    if (!costumer) {
      throw new Error('E-mail não cadastrado');
    }
    // Anexa o tipoUsuario para compatibilidade com RotaProtegida
    const userObj = { ...costumer, tipoUsuario };
    // cria um token simples (apenas para isAuthenticated)
    const newToken = btoa(email);
    // salva no localStorage
    localStorage.setItem('user', JSON.stringify(userObj));
    localStorage.setItem('token', newToken);
    setUser(userObj);
    setToken(newToken);
    return userObj;
  };

  const login = (userData) => {
    console.log("AuthLogin: User data received for login:", userData);
    setUser(userData);
    setToken(userData.token);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, identifyUserByEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);