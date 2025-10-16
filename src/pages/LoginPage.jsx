import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background-primary px-4 sm:px-6 lg:px-8">
      <div className="bg-background-secondary p-8 rounded-xl shadow-lg w-full max-w-md">
        
        {/* Cabeçalho do Formulário */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-text-primary">FinanSync</h2>
          <p className="text-text-secondary mt-2">Acesse sua conta para continuar.</p>
        </div>
        
        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-semibold text-text-secondary mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
            />
          </div>
          
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-semibold text-text-secondary mb-2"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-brand-primary text-white font-semibold py-3 rounded-md shadow-sm hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors duration-200"
          >
            Entrar
          </button>
        </form>
        
        {/* Link para Registro */}
        <div className="mt-6 text-center text-sm text-text-secondary">
          <p>
            Não tem uma conta?{' '}
            <Link to="/register" className="font-semibold text-brand-primary hover:underline">
              Crie uma agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
