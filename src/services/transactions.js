// src/services/transactions.js
import api from './api';

// Busca paginada + filtro por descrição
export async function getTransactions({ description = '', page = 0, size = 10 }) {
  const res = await api.get('/transactions', {
    params: { description, page, size },
  });
  return res.data; // Page<TransactionDTO>
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
