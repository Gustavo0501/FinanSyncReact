import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css'; // Vamos criar este arquivo de estilo

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

    // Validação de senha
    if (password !== passwordConfirm) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      // Chamada para a API de registro
      await api.post('/auth/register', {
        name,
        email,
        password
      });
      
      setSuccess('Usuário registrado com sucesso! Você será redirecionado para o login.');
      
      // Limpa os campos após o sucesso
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirm('');
      
      // Redireciona para a página de login após 2 segundos
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
    <div className="register-container">
      <div className="register-form">
        <h2>Criar Conta no FinanSync</h2>
        
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Nome Completo</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div className="input-group">
            <label htmlFor="passwordConfirm">Confirmar Senha</label>
            <input
              type="password"
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="register-button">Registrar</button>
        </form>
        <div className="login-link">
          <p>Já tem uma conta? <Link to="/">Faça login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
