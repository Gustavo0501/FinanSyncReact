// src/components/TransactionForm.jsx
import React, { useEffect, useState } from 'react';

const emptyForm = {
  description: '',
  amount: '',
  transactionDate: '',
  type: 'RECEITA',
};

const TransactionForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        description: initialData.description ?? '',
        amount: String(initialData.amount ?? ''),
        transactionDate: (initialData.transactionDate ?? '').substring(0, 10),
        type: initialData.type ?? 'RECEITA',
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      description: form.description.trim(),
      amount: Number(form.amount),
      transactionDate: form.transactionDate, // yyyy-mm-dd
      type: form.type,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
      <h3>{initialData ? 'Editar Transação' : 'Nova Transação'}</h3>

      <div style={{ marginTop: 10 }}>
        <label>Descrição</label><br />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          placeholder="Ex.: Salário, Aluguel..."
          style={{ width: '100%', padding: 10 }}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Valor</label><br />
        <input
          name="amount"
          type="number"
          step="0.01"
          value={form.amount}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: 10 }}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Data</label><br />
        <input
          name="transactionDate"
          type="date"
          value={form.transactionDate}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: 10 }}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Tipo</label><br />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          style={{ width: '100%', padding: 10 }}
        >
          <option value="RECEITA">Receita</option>
          <option value="DESPESA">Despesa</option>
        </select>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button type="submit">
          {initialData ? 'Atualizar' : 'Salvar'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{ backgroundColor: '#eee' }}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default TransactionForm;
