import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCustomerByEmail } from '../services/customers.jsx'; // Importar a nova função

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

  const navigate = useNavigate(); // Usar useNavigate aqui

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

  const login = (userData) => {
    console.log("AuthLogin: User data received for login:", userData);
    setUser(userData);
    setToken(userData.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  // Nova função para identificar usuário por e-mail
  const identifyUserByEmail = async (email) => {
    try {
      const customer = await getCustomerByEmail(email);
      if (customer) {
        // Assumindo que o cliente encontrado é do tipo 'cliente'
        // Se houver lógica para determinar 'colaborador' vs 'cliente' baseada nos dados do cliente,
        // ela precisaria ser adicionada aqui.
        const userData = {
          id: customer.id,
          email: customer.email,
          nome: customer.name,
          cpf: customer.cpf,
          birthdaydate: customer.birthdaydate,
          phone: customer.phone,
          gender: customer.gender,
          addresses: customer.addresses, // Incluir os endereços
          tipoUsuario: 'cliente', // Ou determinar com base em 'customer'
          token: 'email-identified-token', // Token simulado para autenticação
        };
        login(userData);
        navigate('/'); // Redireciona para a página inicial após o login
      } else {
        throw new Error('Cliente não encontrado com este e-mail.');
      }
    } catch (error) {
      console.error("Erro ao identificar usuário por e-mail:", error);
      throw error; // Propaga o erro para o componente de login
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, identifyUserByEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};