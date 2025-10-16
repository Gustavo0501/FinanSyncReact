import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Usando o componente Modal genérico como base

const TransactionImportModal = ({ open, onClose, transactions, onConfirm }) => {
  const [editedTransactions, setEditedTransactions] = useState([]);

  useEffect(() => {
    // Garante que o estado seja atualizado quando as props mudarem
    if (Array.isArray(transactions)) {
      setEditedTransactions(transactions);
    }
  }, [transactions]);

  const handleCategoryChange = (index, value) => {
    const updated = [...editedTransactions];
    updated[index] = { ...updated[index], category: value };
    setEditedTransactions(updated);
  };

  const formatCurrency = (value) => {
    const number = typeof value === 'number' ? value : Number(value);
    if (isNaN(number)) return 'R$ 0,00';
    return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Data inválida';
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-display font-bold mb-6 text-text-primary">Confirmar Transações Importadas</h2>
        
        <div className="max-h-[60vh] overflow-y-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Data</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Valor</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Tipo</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Descrição</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Categoria</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {editedTransactions.map((t, idx) => (
                    <tr key={idx}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-text-secondary">{formatDate(t.date || t.transactionDate)}</td>
                        <td className={`px-4 py-2 whitespace-nowrap text-sm font-semibold ${t.type === 'RECEITA' ? 'text-status-success' : 'text-status-danger'}`}>
                            {formatCurrency(t.amount)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-text-primary">{t.type}</td>
                        <td className="px-4 py-2 text-sm text-text-primary">{t.description}</td>
                        <td className="px-4 py-2">
                            <input
                                type="text"
                                value={t.category || ''}
                                onChange={e => handleCategoryChange(idx, e.target.value)}
                                placeholder="Definir categoria"
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-text-secondary font-semibold rounded-md hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(editedTransactions)}
            className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-md hover:bg-brand-primary-hover transition"
          >
            Confirmar Importação
          </button>
        </div>
      </div>
    </Modal>
  );
}
export default TransactionImportModal;