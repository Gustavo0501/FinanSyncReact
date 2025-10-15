import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css'; // Vamos criar este arquivo de estilo
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
    <div className="login-container">
      <div className="login-form">
        <h2>FinanSync</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Entrar</button>
        </form>
          <div className="register-link">
            <p>Não tem uma conta? <Link to="/register">Crie uma agora</Link></p>
          </div>
      </div>
    </div>
  );
};

export default LoginPage;
