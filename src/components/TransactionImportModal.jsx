import React, { useState, useEffect } from 'react';

const modalStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const contentStyle = {
  background: '#fff',
  padding: 24,
  borderRadius: 8,
  minWidth: 400,
  maxHeight: '80vh',
  overflowY: 'auto'
};

export default function TransactionImportModal({ open, onClose, transactions, onConfirm }) {
  const [edited, setEdited] = useState(transactions || []);

  useEffect(() => {
    if (Array.isArray(transactions)) {
      setEdited(transactions);
    }
  }, [transactions]);

  const handleCategoryChange = (idx, value) => {
    const updated = [...edited];
    updated[idx] = { ...updated[idx], category: value };
    setEdited(updated);
  };

  if (!open) return null;

  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <h2>Confirme as transações importadas</h2>
        <table style={{ width: '100%', marginBottom: 16 }}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Valor</th>
              <th>Tipo</th>
              <th>Descrição</th>
              <th>Categoria</th>
            </tr>
          </thead>
          <tbody>
            {edited.map((t, idx) => (
              <tr key={idx}>
                <td>{t.transactionDate}</td>
                <td>{t.amount}</td>
                <td>{t.type}</td>
                <td>{t.description}</td>
                <td>
                  <input
                    type="text"
                    value={t.category || ''}
                    onChange={e => handleCategoryChange(idx, e.target.value)}
                    placeholder="Categoria"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => onConfirm(edited)}>Confirmar Importação</button>
        <button onClick={onClose} style={{ marginLeft: 8 }}>Cancelar</button>
      </div>
    </div>
  );
}
