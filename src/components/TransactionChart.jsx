// src/components/TransactionChart.jsx

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
import './CalendarHeatmap.css'; // Certifique-se que este arquivo CSS existe

// Registra todos os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const TransactionCharts = ({ transactions }) => {
  // --- Funções de Preparação de Dados ---

  const currencyFormat = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  // Dados para o Gráfico de Barras (Receitas vs. Despesas)
  const barChartData = React.useMemo(() => {
    const grouped = (transactions || []).reduce((acc, tx) => {
      const amount = Math.abs(Number(tx.amount || 0));
      acc[tx.type] = (acc[tx.type] || 0) + amount;
      return acc;
    }, {});
    return {
      labels: ['Receitas', 'Despesas'],
      datasets: [{
        label: 'Valores Totais',
        data: [grouped.RECEITA || 0, grouped.DESPESA || 0],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      }],
    };
  }, [transactions]);

  // Dados para o Gráfico de Pizza (Despesas por Categoria)
  const pieChartDataDespesa = React.useMemo(() => {
    const despesas = (transactions || []).filter(tx => tx.type === 'DESPESA');
    const grouped = despesas.reduce((acc, tx) => {
      // CORREÇÃO: Usa tx.category diretamente como string
      const cat = tx.category || 'Sem Categoria';
      acc[cat] = (acc[cat] || 0) + Math.abs(Number(tx.amount || 0));
      return acc;
    }, {});
    return {
      labels: Object.keys(grouped),
      datasets: [{
        data: Object.values(grouped),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'],
      }],
    };
  }, [transactions]);

  // Dados para o Gráfico de Pizza (Receitas por Categoria)
  const pieChartDataReceita = React.useMemo(() => {
    const receitas = (transactions || []).filter(tx => tx.type === 'RECEITA');
    const grouped = receitas.reduce((acc, tx) => {
      // CORREÇÃO: Usa tx.category diretamente como string
      const cat = tx.category || 'Sem Categoria';
      acc[cat] = (acc[cat] || 0) + Math.abs(Number(tx.amount || 0));
      return acc;
    }, {});
    return {
      labels: Object.keys(grouped),
      datasets: [{
        data: Object.values(grouped),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'],
      }],
    };
  }, [transactions]);

  // Dados para o Gráfico de Bolhas
  const bubbleChartData = React.useMemo(() => {
    const despesas = (transactions || []).filter(tx => tx.type === 'DESPESA');
    const grouped = despesas.reduce((acc, tx) => {
      // CORREÇÃO: Usa tx.category diretamente como string
      const cat = tx.category || 'Sem Categoria';
      if (!acc[cat]) acc[cat] = { count: 0, total: 0 };
      acc[cat].count += 1;
      acc[cat].total += Math.abs(Number(tx.amount || 0));
      return acc;
    }, {});
    const dataPoints = Object.entries(grouped).map(([category, { count, total }]) => ({
      x: count,
      y: total,
      r: Math.max(5, Math.log(total) * 4),
      label: category,
    }));
    return {
      datasets: [{
        label: 'Despesas',
        data: dataPoints,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }],
    };
  }, [transactions]);

  // Dados para o Mapa de Calor
  const heatmapData = React.useMemo(() => {
    const despesas = (transactions || []).filter(tx => tx.type === 'DESPESA');
    const aggregated = despesas.reduce((acc, { transactionDate, amount }) => {
      acc[transactionDate] = (acc[transactionDate] || 0) + Math.abs(Number(amount || 0));
      return acc;
    }, {});
    return Object.keys(aggregated).map(date => ({
      date,
      count: aggregated[date],
    }));
  }, [transactions]);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
      {/* Linha 1: Gráfico de Barra (Receitas x Despesas) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <Bar data={barChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Resumo de Receitas vs. Despesas' } } }} />
        </div>
      </div>

      {/* Linha 2: Gráficos de Pizza */}
      <div>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <Pie data={pieChartDataReceita} options={{ responsive: true, plugins: { title: { display: true, text: 'Despesas por Categoria' } } }} />
        </div>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <Pie data={pieChartDataDespesa} options={{ responsive: true, plugins: { title: { display: true, text: 'Receitas por Categoria' } } }} />
        </div>
      </div>

      {/* Linha 3: Gráfico de Bolhas */}
      <div style={{ width: '100%', maxWidth: '832px', margin: '0 auto' }}>
        <Bubble data={bubbleChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Análise de Despesas por Categoria' }, tooltip: { callbacks: { label: (c) => `${c.raw.label}: ${c.raw.x} transações, Total ${currencyFormat(c.raw.y)}` } } }, scales: { x: { title: { display: true, text: 'Quantidade de Transações' } }, y: { title: { display: true, text: 'Valor Total Gasto' } } } }} />
      </div>

      {/* Linha 4: Mapa de Calor */}
      <div style={{ width: '100%', maxWidth: '832px', margin: '0 auto' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Mapa de Calor de Despesas Diárias</h3>
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={heatmapData}
          classForValue={(v) => v ? `color-scale-${Math.min(4, Math.ceil(v.count / 50))}` : 'color-empty'}
          tooltipDataAttrs={v => v && v.date ? { 'data-tooltip-id': 'heatmap-tooltip', 'data-tooltip-content': `${currencyFormat(v.count)} em ${new Date(v.date).toLocaleDateString('pt-BR')}` } : null}
        />
        <ReactTooltip id="heatmap-tooltip" />
      </div>
    </div>
  );
};

export default TransactionCharts;
