import React from 'react';

const TransactionToolbar = ({
  onApplyFilters,
  onAddTransaction,
  onSyncGmail,
  onAnalyzeImport,
  isLoading,
}) => {
  const [description, setDescription] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

  const handleFilter = () => {
    onApplyFilters({ description, startDate, endDate });
  };
  
  const handleClearFilters = () => {
    setDescription('');
    setStartDate('');
    setEndDate('');
    onApplyFilters({ description: '', startDate: '', endDate: '' });
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Linha 1: Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text-secondary">Descrição</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Conta de luz, Salário"
            disabled={isLoading}
            className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary transition"
          />
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-text-secondary">Data de Início</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={isLoading}
            className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary transition"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-text-secondary">Data de Fim</label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={isLoading}
            className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary transition"
          />
        </div>
      </div>

      {/* Linha 2: Botões de Ação */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
            <button
                onClick={handleFilter}
                disabled={isLoading}
                className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-md shadow-sm hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400 transition-colors"
            >
                Filtrar
            </button>
            <button
                onClick={handleClearFilters}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-200 text-text-secondary font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:bg-gray-400 transition-colors"
            >
                Limpar
            </button>
        </div>
        <div className="flex flex-wrap gap-2">
            <button
                onClick={onAddTransaction}
                disabled={isLoading}
                className="px-4 py-2 bg-status-success text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 transition-colors"
            >
                + Nova Transação
            </button>
            <button
                onClick={onAnalyzeImport}
                disabled={isLoading}
                className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-gray-400 transition-colors"
            >
                Importar do Gmail
            </button>
            <button
                onClick={onSyncGmail}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 transition-colors"
            >
                Sincronizar Conta
            </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionToolbar;
