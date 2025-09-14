import React from 'react';
import Header from '../../components/Header'; // Importando o Header
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../../styles/colaborador/Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // 1. Dados para o Gráfico de Vendas (Barra)
  const salesData = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
    datasets: [
      {
        label: 'Vendas Mensais (R$)',
        data: [12000, 19000, 3000, 5000, 20000, 15000],
        backgroundColor: 'rgba(192, 75, 75, 0.79)',
      },
    ],
  };

  // 2. Dados para Novos Clientes (Linha)
  const customerData = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
    datasets: [
      {
        label: 'Novos Clientes Cadastrados',
        data: [30, 45, 28, 50, 65, 80],
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  // 3. Dados para Categorias (Pizza)
  const categoryData = {
    labels: ['Ficção Científica', 'Fantasia', 'Romance', 'Técnico', 'Biografia'],
    datasets: [
      {
        label: 'Vendas por Categoria',
        data: [300, 50, 100, 40, 120],
        backgroundColor: [
          'rgba(248, 97, 97, 1)',
          'rgba(227, 152, 152, 1)',
          'rgba(163, 7, 7, 1)',
          'rgba(225, 46, 46, 1)',
          'rgba(255, 115, 102, 1)',
        ],
      },
    ],
  };

  const options = (titleText) => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { 
        display: true, 
        text: titleText,
        font: {
          size: 18
        }
      },
    },
  });

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <h1>Dashboard de Relatórios</h1>
        <div className="charts-grid">
          <div className="chart-wrapper main-chart">
            <Bar data={salesData} options={options('Relatório de Vendas Mensais')} />
          </div>
          <div className="chart-wrapper side-chart">
            <Line data={customerData} options={options('Crescimento de Novos Clientes')} />
          </div>
          <div className="chart-wrapper side-chart">
            <Pie data={categoryData} options={options('Vendas por Categoria')} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;