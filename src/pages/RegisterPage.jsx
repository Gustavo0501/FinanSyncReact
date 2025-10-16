import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== passwordConfirm) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      await api.post('/auth/register', { name, email, password });
      
      setSuccess('Usuário registrado com sucesso! Você será redirecionado para o login.');
      
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirm('');
      
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Ocorreu um erro no registro. Tente novamente.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background-primary px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-background-secondary p-8 rounded-xl shadow-lg w-full max-w-md">

        {/* Cabeçalho do Formulário */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-text-primary">Crie sua Conta</h2>
          <p className="text-text-secondary mt-2">É rápido e fácil. Comece a organizar suas finanças.</p>
        </div>

        {/* Alertas de Erro e Sucesso */}
        {error && (
          <div className="bg-red-100 border-l-4 border-status-danger text-red-700 p-4 mb-6 rounded-md" role="alert">
            <p className="font-bold">Erro no registro</p>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-l-4 border-status-success text-green-700 p-4 mb-6 rounded-md" role="alert">
            <p className="font-bold">Sucesso!</p>
            <p>{success}</p>
          </div>
        )}

        {/* Formulário de Registro */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-text-secondary mb-2">Nome Completo</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-text-secondary mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-text-secondary mb-2">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
            />
          </div>
          
          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-semibold text-text-secondary mb-2">Confirmar Senha</label>
            <input
              type="password"
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-brand-primary text-white font-semibold py-3 rounded-md shadow-sm hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors duration-200"
          >
            Registrar
          </button>
        </form>

        {/* Link para Login */}
        <div className="mt-6 text-center text-sm text-text-secondary">
          <p>
            Já tem uma conta?{' '}
            <Link to="/" className="font-semibold text-brand-primary hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
