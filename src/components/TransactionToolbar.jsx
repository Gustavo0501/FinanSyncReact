import React from 'react';

const TransactionToolbar = ({
  descriptionInput,
  setDescriptionInput,
  startDateInput,
  setStartDateInput,
  endDateInput,
  setEndDateInput,
  onApplyFilters,
  page,
  size,
  totalPages,
  onPageChange,
  onSizeChange,
  isLoading,
  onSyncGmail
}) => (
  <section style={{
    marginTop: '16px',
    padding: '16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
    {/* Campo de Filtro por Descrição */}
    <div>
      <label htmlFor="description-filter" style={{ marginRight: '8px', fontWeight: 'bold' }}>
        Filtrar por descrição:
      </label>
      <input
        id="description-filter"
        placeholder="Ex.: Salário, Aluguel..."
        value={descriptionInput}
        onChange={e => setDescriptionInput(e.target.value)}
        disabled={isLoading}
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
      />
    </div>

    {/* Filtros de Data */}
    <div style={{ marginBottom: 16 }}>
      <label>
        Início:
        <input type="date" value={startDateInput} onChange={e => setStartDateInput(e.target.value)} />
      </label>
      <label style={{ marginLeft: 8 }}>
        Fim:
        <input type="date" value={endDateInput} onChange={e => setEndDateInput(e.target.value)} />
      </label>
      <button
        onClick={onApplyFilters}
        style={{ marginLeft: 8 }}
        disabled={isLoading}
      >
        Filtrar
      </button>
    </div>

    {/* Seletor de Tamanho da Página */}
    <div>
      <label htmlFor="size-selector" style={{ marginRight: '8px', fontWeight: 'bold' }}>
        Itens por página:
      </label>
      <select
        id="size-selector"
        value={size}
        onChange={e => {
          onPageChange(0);
          onSizeChange(Number(e.target.value));
        }}
        disabled={isLoading}
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={25}>25</option>
      </select>
    </div>

    {/* Botão de Sincronizar com Gmail */}
    <div>
      <button
        onClick={onSyncGmail}
        disabled={isLoading}
        style={{
          padding: '8px 16px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: isLoading ? '#e2e8f0' : '#facc15',
          color: '#1f2937',
          fontWeight: 'bold',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s',
        }}
      >
        Sincronizar com Gmail
      </button>
    </div>

    {/* Controles de Paginação */}
    <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button
        disabled={page <= 0 || isLoading}
        onClick={() => onPageChange(page - 1)}
      >
        Anterior
      </button>
      <span style={{ fontWeight: 'bold', minWidth: '100px', textAlign: 'center' }}>
        {`Página ${page + 1} de ${Math.max(totalPages, 1)}`}
      </span>
      <button
        disabled={page >= totalPages - 1 || isLoading}
        onClick={() => onPageChange(page + 1)}
      >
        Próxima
      </button>
    </div>
  </section>
);

export default TransactionToolbar;
