import React, { useState } from 'react';

export default function TransactionForm({ initialData = {}, onSubmit, onCancel }) {
  const [description, setDescription] = useState(initialData?.description || '');
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [type, setType] = useState(initialData?.type || 'RECEITA');
  const [date, setDate] = useState(initialData?.transactionDate || '');
  const [category, setCategory] = useState(initialData?.category || '');



  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ description, amount, type, transactionDate: date, category});
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{initialData?.id ? 'Editar' : 'Nova'} Transação</h2>
      <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Descrição" required />
      <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Valor" type="number" required />
      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="RECEITA">Receita</option>
        <option value="DESPESA">Despesa</option>
      </select>
      <input value={date} onChange={e => setDate(e.target.value)} type="date" required />
      <input
        value={category}
        onChange={e => setCategory(e.target.value)}
        placeholder="Categoria"
        required
      />

      <button type="submit">Salvar</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancelar</button>
    </form>
  );
}
