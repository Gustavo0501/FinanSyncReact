// src/services/transactions.js
import api from './api';

// Busca paginada + filtro por descrição e data
export async function getTransactions({ description, page, size, startDate, endDate }) {
  const params = { description, page, size };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  const response = await api.get('/transactions', { params });
  return response.data;
}


// Cria uma transação
export async function createTransaction(payload) {
  // payload: { description, amount, transactionDate, type }
  const res = await api.post('/transactions', payload);
  return res.data;
}

// Atualiza uma transação
export async function updateTransaction(id, payload) {
  const res = await api.put(`/transactions/${id}`, payload);
  return res.data;
}

// Exclui uma transação
export async function deleteTransaction(id) {
  await api.delete(`/transactions/${id}`);
}
