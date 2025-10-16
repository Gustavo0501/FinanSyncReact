import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

// Serviços e Notificações
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../services/transactions';
import { notifySuccess, notifyError } from '../ToastProvider';
import api from '../services/api';

// Componentes da UI
import TransactionForm from '../components/TransactionForm';
import TransactionsTable from '../components/TransactionsTable';
import TransactionToolbar from '../components/TransactionToolbar';
import TransactionChart from '../components/TransactionChart';
import Modal from '../components/Modal';
import TransactionImportModal from '../components/TransactionImportModal';

const DashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { logout } = useAuth();
  
  // Efeito para notificações do fluxo do Gmail
  useEffect(() => {
    const gmailStatus = searchParams.get('gmail');
    if (gmailStatus === 'connected') {
      notifySuccess('Gmail conectado com sucesso!');
      // Limpa o parâmetro da URL para não mostrar a mensagem novamente ao recarregar
      searchParams.delete('gmail');
      setSearchParams(searchParams);
    } else if (gmailStatus === 'error') {
      notifyError('Erro ao conectar com o Gmail.');
      searchParams.delete('gmail');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  // --- ESTADOS DO COMPONENTE ---
  
  // Estados para filtro e paginação
  const [filters, setFilters] = useState({ description: '', startDate: '', endDate: '' });
  const [page, setPage] = useState(0); // API é 0-based
  const [size, setSize] = useState(10);
  
  // Estados para os dados da API
  const [transactions, setTransactions] = useState([]);
  const [allTransactionsForCharts, setAllTransactionsForCharts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Estados para controle da UI
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados para controle de modais e edição
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importedTransactions, setImportedTransactions] = useState([]);
  
  // --- CARREGAMENTO DE DADOS ---

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTransactions({ ...filters, page, size });
      setTransactions(data.content ?? []);
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(data.totalElements ?? 0);
    } catch (e) {
      setError('Erro ao carregar as transações.');
      notifyError('Erro ao carregar as transações.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, size]);

  const loadAllTransactionsForCharts = useCallback(async () => {
    try {
      const response = await api.get('/transactions/all', { params: filters });
      setAllTransactionsForCharts(response.data ?? []);
    } catch (e) {
      console.error("Erro ao carregar dados para os gráficos:", e);
      setAllTransactionsForCharts([]);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
    loadAllTransactionsForCharts();
  }, [loadData, loadAllTransactionsForCharts]);

  // --- HANDLERS DE AÇÕES ---

  const handleFilterApply = (newFilters) => {
    setPage(0); // Reseta a paginação ao aplicar um novo filtro
    setFilters(newFilters);
  };
  
// Em DashboardPage.jsx

  const handleFormSubmit = async (payload) => {
    setIsSaving(true);
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, payload);
        notifySuccess('Transação atualizada com sucesso!');
      } else {
        await createTransaction(payload);
        notifySuccess('Transação criada com sucesso!');
      }
      setModalOpen(false); // <-- ADICIONE ESTA LINHA!
      setEditingTransaction(null);
      await loadData();
      await loadAllTransactionsForCharts();
    } catch (err) {
      notifyError(editingTransaction ? 'Erro ao atualizar transação.' : 'Erro ao criar transação.');
    } finally {
      setIsSaving(false);
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza de que deseja excluir esta transação?')) return;
    try {
      await deleteTransaction(id);
      notifySuccess('Transação excluída com sucesso!');
      // Se era o último item de uma página, volta para a anterior
      if (transactions.length === 1 && page > 0) {
        setPage(p => p - 1);
      } else {
        await loadData();
      }
      await loadAllTransactionsForCharts();
    } catch (err) {
      notifyError('Erro ao excluir transação.');
    }
  };
  
  const handleOpenModalForEdit = (transaction) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  const handleOpenModalForCreate = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const handleSyncWithGmail = async () => {
    try {
      toast.info('Redirecionando para o Google para autorização...');
      const response = await api.get('/gmail/authorize-url');
      const url = response.data;
      if (url && url.startsWith('http')) {
        window.location.assign(url);
      } else {
        toast.error('Não foi possível obter a URL de autorização.');
      }
    } catch (error) {
      toast.error('Falha ao iniciar a conexão com o Gmail.');
      console.error('Erro ao sincronizar com o Gmail:', error);
    }
  };

  const handleAnalyzeImport = async () => {
    try {
      const remetente = 'no-reply@inter.co';
      const assunto = 'Seu extrato está disponível';
      const result = await api.get('/transactions/import/analyze', { params: { remetente, assunto } });
      setImportedTransactions(result.data || []);
      setShowImportModal(true);
    } catch (err) {
      notifyError('Erro ao buscar transações do e-mail.');
    }
  };

  const handleConfirmImport = async (selectedTransactions) => {
    try {
      await api.post('/transactions/import/confirm', selectedTransactions);
      notifySuccess('Transações importadas com sucesso!');
      setShowImportModal(false);
      await loadData();
      await loadAllTransactionsForCharts();
    } catch (error) {
      notifyError('Erro ao confirmar a importação.');
    }
  };

  // Para o model
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTransaction(null); // Limpa a transação em edição
  };


  // --- RENDERIZAÇÃO ---
  
  return (
    <div className="min-h-screen bg-background-primary p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabeçalho */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-text-primary">Painel de Controle</h1>
            <p className="text-text-secondary mt-1">Sua visão financeira completa.</p>
          </div>
          <button
            onClick={logout}
            className="mt-4 sm:mt-0 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-sm hover:bg-status-danger transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sair
          </button>
        </header>

        {/* Barra de Ferramentas e Ações */}
        <div className="bg-background-secondary p-4 sm:p-6 rounded-lg shadow-md mb-8">
          <TransactionToolbar
            onApplyFilters={handleFilterApply}
            onAddTransaction={handleOpenModalForCreate}
            onSyncGmail={handleSyncWithGmail}
            onAnalyzeImport={handleAnalyzeImport}
            isLoading={isLoading}
          />
        </div>
        
        {error && (
            <div className="bg-red-100 border-l-4 border-status-danger text-red-700 p-4 mb-8 rounded-md" role="alert">
                <p className="font-bold">Ocorreu um erro</p>
                <p>{error}</p>
            </div>
        )}

        {/* Tabela de Transações */}
        <div className="bg-background-secondary rounded-lg shadow-md mb-8">
          <div className="p-4 sm:p-6">
              <h2 className="text-xl font-display font-semibold text-text-primary">Histórico de Transações</h2>
              <p className="text-sm text-text-secondary mt-1">Total de registros: {totalElements}</p>
          </div>
          {isLoading ? (
            <div className="text-center p-10">
              <p className="text-text-secondary">Carregando transações...</p>
            </div>
          ) : (
            <TransactionsTable
              items={transactions}
              onEdit={handleOpenModalForEdit}
              onDelete={handleDelete}
            />
          )}
          {/* Controles de Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t border-gray-200">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-brand-primary text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-brand-primary-hover transition-colors"
              >
                Anterior
              </button>
              <span className="text-text-secondary text-sm">
                Página {page + 1} de {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 bg-brand-primary text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-brand-primary-hover transition-colors"
              >
                Próxima
              </button>
            </div>
          )}
        </div>

        {/* Seção de Gráficos */}
        <section className="mb-8">
          <TransactionChart transactions={allTransactionsForCharts} />
        </section>

        {/* Modal para Adicionar/Editar Transação */}
        <Modal open={modalOpen} onClose={handleCloseModal}>
          <TransactionForm
            key={editingTransaction ? editingTransaction.id : 'new-transaction'}
            initialData={editingTransaction}
            // Modifique o onSubmit para fechar o modal
            onSubmit={async (payload) => {
              await handleFormSubmit(payload);
              // Embora já tenhamos adicionado no handler, uma garantia extra aqui
              setModalOpen(false); 
            }}
            onCancel={handleCloseModal}
            isSaving={isSaving}
          />
        </Modal>


        {/* Modal para Importação do Gmail */}
        <TransactionImportModal
          open={showImportModal}
          onClose={() => setShowImportModal(false)}
          transactions={importedTransactions}
          onConfirm={handleConfirmImport}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
