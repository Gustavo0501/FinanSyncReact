import React from 'react';

const TransactionsTable = ({ items, onEdit, onDelete }) => {
  // Função para formatar a moeda, aplicando o sinal negativo para despesas
  const formatCurrency = (value, type) => {
    const prefix = type === 'EXPENSE' ? '- ' : '';
    // Garante que o valor é um número antes de formatar
    const numericValue = typeof value === 'number' ? value : 0;
    return prefix + numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Função para formatar a data, com tratamento para datas inválidas
  const formatDate = (dateString) => {
    // A API pode retornar a data com um 'Z' no final, que indica UTC. 
    // É uma boa prática garantir que a string seja tratada corretamente.
    const date = new Date(dateString);
    
    // Se a data for inválida, retorna um fallback
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    
    // Usar timeZone UTC para evitar problemas de fuso horário
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Descrição</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Valor</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Data</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Categoria</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items && items.length > 0 ? (
            items.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100 transition-colors'}>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{item.description}</td>
                
                {/* CORREÇÃO DA COR */}
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${item.type === 'RECEITA' ? 'text-status-success' : 'text-status-danger'}`}>
                  {formatCurrency(item.amount, item.type)}
                </td>
                
                {/* CORREÇÃO DA DATA */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{formatDate(item.transactionDate)}</td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{item.category}</td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {/* CORREÇÃO DO BOTÃO EDITAR */}
                  <button
                    type="button" // Previne o comportamento padrão de submit
                    onClick={() => {
                      onEdit(item);
                    }}
                    className="text-brand-primary hover:underline font-semibold mr-4"
                  >
                    Editar
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="text-status-danger hover:underline font-semibold"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-10 text-text-secondary">
                Nenhuma transação encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
