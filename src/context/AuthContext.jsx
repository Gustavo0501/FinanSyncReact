import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

// 1. Cria o Contexto
const AuthContext = createContext();

// 2. Cria o Provedor do Contexto
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Efeito para rodar na inicialização e verificar o token
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Função de Login
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setIsAuthenticated(true);
      
      navigate('/dashboard'); // Redireciona para o dashboard após o login
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Falha no login. Verifique suas credenciais.");
    }
  };

  // Função de Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    navigate('/'); // Redireciona para a página de login após o logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Cria um hook customizado para usar o contexto mais facilmente
export const useAuth = () => {
  return useContext(AuthContext);
};
