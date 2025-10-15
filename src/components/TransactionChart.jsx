// src/components/TransactionChart.jsx

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registra os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TransactionChart = ({ transactions }) => {
  const grouped = (transactions || []).reduce((acc, tx) => {
    const amount = typeof tx.amount === 'number' ? tx.amount : Number(tx.amount || 0);
    acc[tx.type] = (acc[tx.type] ?? 0) + amount;
    return acc;
  }, {});

  const chartData = {
    labels: ['Receitas', 'Despesas'],
    datasets: [
      {
        label: 'Valores Totais',
        data: [grouped.RECEITA ?? 0, grouped.DESPESA ?? 0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Verde para receitas
          'rgba(255, 99, 132, 0.6)',  // Vermelho para despesas
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Resumo de Receitas vs. Despesas',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'R$ ' + value.toLocaleString('pt-BR');
          }
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

// Adicione esta linha no final do arquivo
export default TransactionChart; 
