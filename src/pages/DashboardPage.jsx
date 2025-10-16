import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import TransactionImportModal from '../components/TransactionImportModal';
import Modal from '../components/Modal';


// Serviços e Notificações
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../services/transactions';
import { notifySuccess, notifyError } from '../ToastProvider';
import { toast } from 'react-toastify'; // Importado para notificações do fluxo do Gmail
import api from '../services/api'; // Importado para chamar o endpoint de autorização

// Componentes da UI
import TransactionForm from '../components/TransactionForm';
import TransactionsTable from '../components/TransactionsTable';
import TransactionToolbar from '../components/TransactionToolbar';
import TransactionChart from '../components/TransactionChart';

const DashboardPage = () => {
  const [searchParams] = useSearchParams();
  const gmailStatus = searchParams.get('gmail'); // 'connected', 'error', etc.

  useEffect(() => {
    if (gmailStatus === 'connected') {
      // Exiba um toast, recarregue transações, etc.
      notifySuccess('Gmail conectado com sucesso!');
      // Opcional: Limpe o parâmetro da URL após mostrar a mensagem
    }
    if (gmailStatus === 'error') {
      notifyError('Erro ao conectar com o Gmail.');
    }
  }, [gmailStatus]);
  
  const { logout } = useAuth();

  // Estados para filtro e paginação
  const [page, setPage] = useState(0); // API é 0-based
  const [size, setSize] = useState(10);
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [descriptionInput, setDescriptionInput] = useState('');
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');


  // Estados para os dados retornados da API
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Estados para controle da UI (loading, erros, etc.)
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Estado para controlar o modo de edição
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [showImportModal, setShowImportModal] = useState(false);
  const [importedTransactions, setImportedTransactions] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);


  // Função para buscar e mostrar as transações importadas
  const handleAnalyzeImport = async () => {
    try {
      // Ajuste os parâmetros conforme seu backend
      const remetente = 'no-reply@inter.co';
      const assunto = 'Seu extrato está disponível';
      const result = await api.get('/transactions/import/analyze', { params: { remetente, assunto } });
      console.log('Transações importadas:', result.data);
      setImportedTransactions(result.data);
      setShowImportModal(true);
    } catch (err) {
      notifyError('Erro ao buscar transações para importação.');
    }
  };

  // Função para confirmar importação
  const handleConfirmImport = async (transacoesSelecionadas) => {
    try {
      await api.post('/transactions/import/confirm', transacoesSelecionadas);
      notifySuccess('Importação realizada com sucesso!');
      setShowImportModal(false);
      await loadData();
    } catch (error) {
      notifyError('Erro ao importar transações.');
    }
  };

  // Carrega os dados da API sempre que o filtro ou a página mudar
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getTransactions({ description, page, size, startDate, endDate });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description, startDate, endDate, page, size]);

  const [allTransactionsForCharts, setAllTransactionsForCharts] = useState([]);

  const loadAllTransactionsForCharts = async () => {
    try {
      const data = await api.get('/transactions/all', {
        params: { description, startDate, endDate }
      });
      setAllTransactionsForCharts(data.data ?? []);
    } catch (e) {
      setAllTransactionsForCharts([]);
    }
  };

  useEffect(() => {
    loadAllTransactionsForCharts();
  }, [description, startDate, endDate]);



  // Funções de CRUD
  const handleFormSubmit = async (payload) => {
    setIsSaving(true);
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, payload);
        notifySuccess('Transação atualizada com sucesso!');
      } else {
        await createTransaction(payload);
        notifySuccess('Transação criada com sucesso!');
        setPage(0);
      }
      setEditingTransaction(null);
      await loadData();
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
      if (transactions.length === 1 && page > 0) {
        setPage(p => p - 1);
      } else {
        await loadData();
      }
    } catch (err) {
      notifyError('Erro ao excluir transação.');
    }
  };

  // NOVA FUNÇÃO: INICIAR O FLUXO DE AUTORIZAÇÃO DO GMAIL
  const handleSyncWithGmail = async () => {
    try {
      toast.info('Redirecionando para o Google para autorização...');
      const url = await api.get('/gmail/authorize-url').then(r => r.data);
      if (url && url.startsWith('http')) {
        window.location.assign(url);
      } else {
        toast.error('Não foi possível obter a URL de autorização.');
      }

    } catch (error) {
      toast.error('Falha ao conectar com o Gmail. Tente novamente.');
      console.error('Erro ao iniciar a sincronização com o Gmail:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Dashboard</h1>
        <button onClick={logout}>Sair</button>
      </header>

      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => { setEditingTransaction(null); setModalOpen(true); }}>
          Criar nova transação
        </button>
      </div>

      {/* Botão de importação - aqui é seguro */}
      <div style={{ marginBottom: '16px' }}>
        <button onClick={handleAnalyzeImport}>Atualizar Transações (Importar Gmail)</button>
      </div>

      <TransactionImportModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        transactions={importedTransactions || []}
        onConfirm={handleConfirmImport}
      />


      {/* Ferramentas de Filtro, Paginação e Ações */}
      <TransactionToolbar
        descriptionInput={descriptionInput}
        setDescriptionInput={setDescriptionInput}
        startDateInput={startDateInput}
        setStartDateInput={setStartDateInput}
        endDateInput={endDateInput}
        setEndDateInput={setEndDateInput}
        onApplyFilters={() => {
          setDescription(descriptionInput);
          setStartDate(startDateInput);
          setEndDate(endDateInput);
          setPage(0);
        }}
        page={page}
        size={size}
        totalPages={totalPages}
        onPageChange={setPage}
        onSizeChange={setSize}
        isLoading={isLoading}
        onSyncGmail={handleSyncWithGmail}
      />

      
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <section style={{ marginTop: '30px', marginBottom: '30px' }}>
        <TransactionChart transactions={allTransactionsForCharts} />
      </section>

      {isLoading ? (
        <p>Carregando transações...</p>
      ) : (
        <TransactionsTable
          items={transactions}
          onEdit={transaction => { setEditingTransaction(transaction); setModalOpen(true); }}
          onDelete={handleDelete}
        />
      )}
      <p style={{ marginTop: '8px', fontSize: '14px', color: '#555' }}>
        Total de registros: {totalElements}
      </p>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <TransactionForm
          key={editingTransaction ? editingTransaction.id : 'new'}
          initialData={editingTransaction}
          onSubmit={async (payload) => {
            await handleFormSubmit(payload);
            setModalOpen(false);
          }}
          onCancel={() => setModalOpen(false)}
        />
        {isSaving && <p style={{ marginTop: '10px' }}>Salvando...</p>}
      </Modal>

      
    </div>
  );
};

export default DashboardPage;
