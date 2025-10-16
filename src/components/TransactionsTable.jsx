// src/components/TransactionsTable.jsx
import React from 'react';

const formatCurrency = (n) =>
  typeof n === 'number'
    ? n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : n;

const TransactionsTable = ({ items, onEdit, onDelete }) => {
  return (
    <table
      border="1"
      cellPadding="10"
      cellSpacing="0"
      style={{ width: '100%', marginTop: 16 }}
    >
      <thead>
        <tr>
          <th>Descrição</th>
          <th>Valor</th>
          <th>Data</th>
          <th>Tipo</th>
          <th>Categoria</th>
          <th style={{ width: 160 }}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {(!items || items.length === 0) && (
          <tr>
            <td colSpan="5">Nenhuma transação encontrada.</td>
          </tr>
        )}
        {items?.map((tx) => (
          <tr key={tx.id}>
            <td>{tx.description}</td>
            <td>{formatCurrency(tx.amount)}</td>
            <td>{(tx.transactionDate ?? '').substring(0, 10)}</td>
            <td>{tx.type}</td>
            <td>{tx.category}</td>
            <td>
              <button onClick={() => onEdit(tx)}>Editar</button>{' '}
              <button onClick={() => onDelete(tx.id)} style={{ background: '#fdd' }}>
                Excluir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionsTable;
