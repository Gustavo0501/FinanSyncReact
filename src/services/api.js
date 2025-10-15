import axios from 'axios';

// Cria uma instância do Axios com a URL base da sua API Spring Boot
const api = axios.create({
  baseURL: 'http://localhost:8080/api' // Certifique-se de que esta é a URL correta do seu backend
});

// Interceptor para adicionar o token JWT a todas as requisições
api.interceptors.request.use(async config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;
