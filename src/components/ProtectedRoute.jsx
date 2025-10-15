import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostra uma mensagem de carregamento enquanto verifica a autenticação
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // Se não estiver autenticado, redireciona para a página de login
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Se estiver autenticado, renderiza o componente filho (a página protegida)
  return children;
};

export default ProtectedRoute;
