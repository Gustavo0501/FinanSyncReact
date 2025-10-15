import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Serviços e Notificações
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../services/transactions';
import { notifySuccess, notifyError } from '../ToastProvider';

// Componentes da UI
import TransactionForm from '../components/TransactionForm';
import TransactionsTable from '../components/TransactionsTable';
import TransactionToolbar from '../components/TransactionToolbar';
import TransactionChart from '../components/TransactionChart';

const DashboardPage = () => {
  const { logout } = useAuth();

  // Estados para filtro e paginação
  const [description, setDescription] = useState('');
  const [page, setPage] = useState(0); // API é 0-based
  const [size, setSize] = useState(10);

  // Estados para os dados retornados da API
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Estados para controle da UI (loading, erros, etc.)
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Estado para controlar o modo de edição
  // Guarda o objeto da transação que está sendo editada, ou null se for criação
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Carrega os dados da API sempre que o filtro ou a página mudar
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getTransactions({ description, page, size });
      setTransactions(data.content ?? []);
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(data.totalElements ?? 0);
    } catch (e) {
      setError('Erro ao carregar as transações. Tente atualizar a página.');
      notifyError('Erro ao carregar as transações.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // A dependência 'loadData' não é necessária aqui, mas as outras são.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description, page, size]);

  // Funções de CRUD
  const handleFormSubmit = async (payload) => {
    setIsSaving(true);
    try {
      if (editingTransaction) {
        // Modo de Atualização
        await updateTransaction(editingTransaction.id, payload);
        notifySuccess('Transação atualizada com sucesso!');
      } else {
        // Modo de Criação
        await createTransaction(payload);
        notifySuccess('Transação criada com sucesso!');
        setPage(0); // Volta para a primeira página após criar
      }
      setEditingTransaction(null); // Limpa o formulário e sai do modo de edição
      await loadData(); // Recarrega os dados
    } catch (err) {
      notifyError(editingTransaction ? 'Erro ao atualizar transação.' : 'Erro ao criar transação.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza de que deseja excluir esta transação?')) {
      return;
    }
    try {
      await deleteTransaction(id);
      notifySuccess('Transação excluída com sucesso!');
      // Lógica para voltar a página caso o último item seja excluído
      if (transactions.length === 1 && page > 0) {
        setPage(p => p - 1);
      } else {
        await loadData();
      }
    } catch (err) {
      notifyError('Erro ao excluir transação.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Dashboard</h1>
        <button onClick={logout}>Sair</button>
      </header>

      {/* Ferramentas de Filtro e Paginação */}
      <TransactionToolbar
        description={description}
        onChangeDescription={setDescription}
        page={page}
        size={size}
        totalPages={totalPages}
        onPageChange={setPage}
        onSizeChange={setSize}
      />
      
      {/* Exibe o erro de carregamento, se houver */}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {/* Gráfico */}
      <section style={{ marginTop: '30px', marginBottom: '30px' }}>
        <TransactionChart transactions={transactions} />
      </section>

      {/* Tabela de Transações */}
      {isLoading ? (
        <p>Carregando transações...</p>
      ) : (
        <TransactionsTable
          items={transactions}
          onEdit={setEditingTransaction} // Passa a transação inteira para o modo de edição
          onDelete={handleDelete}
        />
      )}
      <p style={{ marginTop: '8px', fontSize: '14px', color: '#555' }}>
        Total de registros: {totalElements}
      </p>

      {/* Formulário de Criação/Edição */}
      <section style={{ marginTop: '40px' }}>
        <TransactionForm
          key={editingTransaction ? editingTransaction.id : 'new'} // Chave para forçar a recriação do formulário
          initialData={editingTransaction}
          onSubmit={handleFormSubmit}
          onCancel={editingTransaction ? () => setEditingTransaction(null) : undefined}
        />
        {isSaving && <p style={{ marginTop: '10px' }}>Salvando...</p>}
      </section>
    </div>
  );
};

export default DashboardPage;
