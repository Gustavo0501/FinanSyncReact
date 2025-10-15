import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importação das páginas e componentes de rota
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* 
        ROTAS PÚBLICAS
        Acessíveis por qualquer pessoa, mesmo sem login.
      */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 
        ROTAS PRIVADAS
        Envolvidas pelo ProtectedRoute. 
        Se o usuário não estiver autenticado, será redirecionado para a página de login.
      */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Você pode adicionar outras rotas privadas aqui no futuro */}
      {/* 
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      /> 
      */}
    </Routes>
  );
}

export default App;
