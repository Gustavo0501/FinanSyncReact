import React, { useState, useEffect } from 'react';

const TransactionForm = ({ initialData, onSubmit, onCancel, isSaving }) => {
  // Estado interno para gerenciar os campos do formulário
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    type: 'DESPESA',
  });

  // Efeito para preencher ou resetar o formulário
  useEffect(() => {
    // Modo Edição: preenche com dados existentes
    if (initialData) {
      setFormData({
        description: initialData.description || '',
        amount: initialData.amount || '',
        // A prop da API é 'transactionDate', mas o input HTML é 'date'
        date: initialData.transactionDate ? new Date(initialData.transactionDate).toISOString().split('T')[0] : '',
        category: initialData.category || '',
        type: initialData.type || 'DESPESA',
      });
    } 
    // Modo Criação: reseta para os valores padrão
    else {
      setFormData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        type: 'DESPESA',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- CORREÇÃO PRINCIPAL AQUI ---
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Cria o payload para a API com o nome de campo correto
    const payload = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      // Mapeia o 'date' do formulário para 'transactionDate' da API
      transactionDate: formData.date,
      category: formData.category,
      type: formData.type,
    };
    
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-text-primary">
        {initialData ? 'Editar Transação' : 'Nova Transação'}
      </h2>
      
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-text-secondary mb-1">Descrição</label>
        <input type="text" name="description" value={formData.description} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label htmlFor="amount" className="block text-sm font-semibold text-text-secondary mb-1">Valor (R$)</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} required step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary" />
        </div>
        <div>
            <label htmlFor="date" className="block text-sm font-semibold text-text-secondary mb-1">Data</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label htmlFor="category" className="block text-sm font-semibold text-text-secondary mb-1">Categoria</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary" />
        </div>
        <div>
            <label htmlFor="type" className="block text-sm font-semibold text-text-secondary mb-1">Tipo</label>
            <select name="type" value={formData.type} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary">
                <option value="DESPESA">Despesa</option>
                <option value="RECEITA">Receita</option>
            </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button type="button" onClick={onCancel} disabled={isSaving} className="px-4 py-2 bg-gray-200 text-text-secondary font-semibold rounded-md hover:bg-gray-300 transition">
          Cancelar
        </button>
        <button type="submit" disabled={isSaving} className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-md hover:bg-brand-primary-hover disabled:bg-gray-400 transition">
          {isSaving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
