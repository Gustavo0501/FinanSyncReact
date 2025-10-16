import React from 'react';
import { Bar, Pie, Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';
import './CalendarHeatmap.css'; // Mantenha este import

// Registra os componentes do Chart.js
ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, ArcElement, Title, Tooltip, Legend
);

// Helper para formatação de moeda
const currencyFormat = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

// Cores da paleta
const chartColors = {
  receita: 'rgba(46, 134, 95, 0.7)',
  despesa: 'rgba(229, 62, 62, 0.7)',
  pie: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'],
};

const TransactionChart = ({ transactions }) => {

  // --- LÓGICA DE DADOS (sem alterações, exceto no heatmap) ---

  const barChartData = React.useMemo(() => {
    const grouped = (transactions || []).reduce((acc, tx) => {
      acc[tx.type] = (acc[tx.type] || 0) + Math.abs(Number(tx.amount || 0));
      return acc;
    }, {});
    return {
      labels: ['Receitas', 'Despesas'],
      datasets: [{
        label: 'Valores Totais',
        data: [grouped.RECEITA || 0, grouped.DESPESA || 0],
        backgroundColor: [chartColors.receita, chartColors.despesa],
        borderColor: [chartColors.receita.replace('0.7', '1'), chartColors.despesa.replace('0.7', '1')],
        borderWidth: 1,
      }],
    };
  }, [transactions]);

  const pieChartDataDespesa = React.useMemo(() => {
    const despesas = (transactions || []).filter(tx => tx.type === 'DESPESA');
    const grouped = despesas.reduce((acc, tx) => {
      const cat = tx.category || 'Sem Categoria';
      acc[cat] = (acc[cat] || 0) + Math.abs(Number(tx.amount || 0));
      return acc;
    }, {});
    return {
      labels: Object.keys(grouped),
      datasets: [{ data: Object.values(grouped), backgroundColor: chartColors.pie }],
    };
  }, [transactions]);

  const pieChartDataReceita = React.useMemo(() => {
    const receitas = (transactions || []).filter(tx => tx.type === 'RECEITA');
    const grouped = receitas.reduce((acc, tx) => {
      const cat = tx.category || 'Sem Categoria';
      acc[cat] = (acc[cat] || 0) + Math.abs(Number(tx.amount || 0));
      return acc;
    }, {});
    return {
      labels: Object.keys(grouped),
      datasets: [{ data: Object.values(grouped), backgroundColor: chartColors.pie }],
    };
  }, [transactions]);
  
  const bubbleChartData = React.useMemo(() => {
    const despesas = (transactions || []).filter(tx => tx.type === 'DESPESA');
    const grouped = despesas.reduce((acc, tx) => {
      const cat = tx.category || 'Sem Categoria';
      if (!acc[cat]) acc[cat] = { count: 0, total: 0 };
      acc[cat].count += 1;
      acc[cat].total += Math.abs(Number(tx.amount || 0));
      return acc;
    }, {});
    const dataPoints = Object.entries(grouped).map(([category, { count, total }]) => ({
      x: count, y: total, r: Math.max(5, Math.log(total) * 3), label: category,
    }));
    return {
      datasets: [{
        label: 'Despesas',
        data: dataPoints,
        backgroundColor: chartColors.despesa,
      }],
    };
  }, [transactions]);

  const heatmapData = React.useMemo(() => {
    const despesas = (transactions || []).filter(tx => tx.type === 'DESPESA');
    
    return despesas.reduce((acc, tx) => {
      // Pega a data de tx.date ou tx.transactionDate
      const transactionDate = tx.date || tx.transactionDate;
      const amount = tx.amount;

      if (transactionDate && typeof amount === 'number' && !isNaN(amount)) {
        try {
          const formattedDate = new Date(transactionDate).toISOString().split('T')[0];
          
          // Encontra se a data já existe no acumulador
          const existingEntry = acc.find(entry => entry.date === formattedDate);
          
          if (existingEntry) {
            // Se existe, apenas soma o valor
            existingEntry.count += Math.abs(amount);
          } else {
            // Se não existe, adiciona uma nova entrada
            acc.push({ date: formattedDate, count: Math.abs(amount) });
          }
        } catch (e) {
          // Ignora datas inválidas
        }
      }
      return acc;
    }, []); // Inicia com um array vazio
  }, [transactions]);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);

  // --- RENDERIZAÇÃO (layout mantido como na sua última solicitação) ---

  return (
    <div className="space-y-12">

      {/* Linha 1: Gráfico de Barras */}
      <div className="flex justify-center">
        <div className="bg-background-secondary p-6 rounded-lg shadow-md w-full max-w-2xl">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-4 text-center">Resumo de Receitas vs. Despesas</h3>
          <div className="h-80">
            <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </div>

      {/* Linha 2: Gráficos de Pizza */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-background-secondary p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-4 text-center">Despesas por Categoria</h3>
          <div className="h-72 flex justify-center">
            <Pie data={pieChartDataDespesa} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-background-secondary p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-4 text-center">Receitas por Categoria</h3>
          <div className="h-72 flex justify-center">
            <Pie data={pieChartDataReceita} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Linha 3: Gráfico de Bolhas */}
      <div className="bg-background-secondary p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-display font-semibold text-text-primary mb-4 text-center">Análise de Despesas por Categoria</h3>
        <div className="h-96">
          <Bubble data={bubbleChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { tooltip: { callbacks: { label: (c) => `${c.raw.label}: ${c.raw.x} transações, Total ${currencyFormat(c.raw.y)}` } } }, scales: { x: { title: { display: true, text: 'Quantidade de Transações' } }, y: { title: { display: true, text: 'Valor Total Gasto' } } } }} />
        </div>
      </div>
      
      {/* Linha 4: Mapa de Calor */}
      <div className="bg-background-secondary p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-display font-semibold text-text-primary mb-4 text-center">Mapa de Calor de Despesas Diárias (Último Ano)</h3>
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={heatmapData}
          classForValue={(v) => v ? `color-scale-${Math.min(4, Math.ceil(v.count / 100))}` : 'color-empty'}
          tooltipDataAttrs={v => v && v.date ? { 'data-tooltip-id': 'heatmap-tooltip', 'data-tooltip-content': `${currencyFormat(v.count)} em ${new Date(v.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}` } : null}
        />
        <ReactTooltip id="heatmap-tooltip" />
      </div>

    </div>
  );
};

export default TransactionChart;
