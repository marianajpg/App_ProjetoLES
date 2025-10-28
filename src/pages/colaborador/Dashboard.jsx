import React, { useEffect, useState } from 'react';
import * as duckdb from '@duckdb/duckdb-wasm';
import { getCheckout } from '../../services/checkout';
import { getBooks } from '../../services/books';
import { getCategory } from '../../services/category';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import Header from '../../components/Header'; // Import the Header component

import '../../styles/colaborador/Dashboard.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => { // Renamed from DashboardAnalytics
  const [db, setDb] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const initDb = async () => {
      const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
      const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
      const worker = await duckdb.createWorker(bundle.mainWorker);
      const logger = new duckdb.ConsoleLogger();
      const newDb = new duckdb.AsyncDuckDB(logger, worker);
      await newDb.instantiate(bundle.mainModule, bundle.pthreadWorker);
      setDb(newDb);
    };
    initDb();
  }, []);

  useEffect(() => {
    if (db) {
      loadData();
    }
  }, [db]);

  const loadData = async () => {
    const checkouts = await getCheckout();
    const books = await getBooks();
    const categories = await getCategory();

    await db.registerFileText('checkouts.json', JSON.stringify(checkouts));
    await db.registerFileText('books.json', JSON.stringify(books));
    await db.registerFileText('categories.json', JSON.stringify(categories));

    const conn = await db.connect();

    await conn.query(`
      CREATE OR REPLACE TABLE checkouts AS SELECT * FROM 'checkouts.json';
    `);
    await conn.query(`
      CREATE OR REPLACE TABLE books AS SELECT * FROM 'books.json';
    `);
    await conn.query(`
      CREATE OR REPLACE TABLE categories AS SELECT * FROM 'categories.json';
    `);

    await conn.close();
    fetchChartData();
  };
  

const getRandomColor = (index) => {
  const baseColors = [
    '#752512', '#A73A21', '#C65338', '#ee5e3a', '#FEAA80', '#FDBC9B', '#FFCEB6'
  ];
  
  const baseColor = baseColors[index % baseColors.length];
  
  // Cria variações claras/escuras harmonicamente
  const variations = generateColorVariations(baseColor);
  return variations[index % variations.length];
};

const generateColorVariations = (baseColor) => {
  // Converte HEX para RGB
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };
  
  // Converte RGB para HEX
  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
      const hex = Math.max(0, Math.min(255, x)).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };
  
  const rgb = hexToRgb(baseColor);
  const variations = [];
  
  // Gera 3 variações para cada cor base
  for (let i = 0; i < 3; i++) {
    const factor = 0.7 + (i * 0.15); // 0.7, 0.85, 1.0
    const r = Math.round(rgb.r * factor);
    const g = Math.round(rgb.g * factor);
    const b = Math.round(rgb.b * factor);
    variations.push(rgbToHex(r, g, b));
  }
  
  return variations;
};

  const fetchChartData = async () => {
    if (!db) return;

    const conn = await db.connect();

    let query = `
      SELECT
        strftime(CAST(c.created_at AS TIMESTAMP), '%Y-%m-%d') as date,
        cat.name as category_name,
        SUM(ci.quantity * ci.unitPrice) as sales
      FROM checkouts c
      CROSS JOIN UNNEST(c.items) as t(ci)
      JOIN books b ON ci.bookId = b.id
      CROSS JOIN UNNEST(b.categories) as u(bc)
      JOIN categories cat ON bc.id = cat.id
    `;

    if (startDate && endDate) {
      query += ` WHERE c.created_at BETWEEN '${startDate}' AND '${endDate}'`;
    }

    query += `
      GROUP BY date, category_name
      ORDER BY date, category_name
    `;

    const result = await conn.query(query);
    

    const data = result.toArray().map(row => row.toJSON());

    // Process data for charting
    const dates = [...new Set(data.map(row => row.date))].sort();
    const categoryNames = [...new Set(data.map(row => row.category_name))].sort();

    const datasets = categoryNames.map((categoryName, index) => {
      const categoryData = dates.map(date => {
        const row = data.find(d => d.date === date && d.category_name === categoryName);
        return row ? row.sales : 0;
      });
      return {
        label: categoryName,
        data: categoryData,
        fill: false,
        borderColor: getRandomColor(index),
        tension: 0.1,
      };
    });

    const chartData = {
      labels: dates,
      datasets: datasets,
    };

    setChartData(chartData);

    // Process data for pie chart
    let pieQuery = `
      SELECT
        cat.name as category_name,
        SUM(ci.quantity * ci.unitPrice) as sales
      FROM checkouts c
      CROSS JOIN UNNEST(c.items) as t(ci)
      JOIN books b ON ci.bookId = b.id
      CROSS JOIN UNNEST(b.categories) as u(bc)
      JOIN categories cat ON bc.id = cat.id
    `;

    if (startDate && endDate) {
      pieQuery += ` WHERE c.created_at BETWEEN '${startDate}' AND '${endDate}'`;
    }

    pieQuery += `
      GROUP BY category_name
    `;

    const pieResult = await conn.query(pieQuery);
    await conn.close();
    const pieData = pieResult.toArray().map(row => row.toJSON());

    const pieChartData = {
      labels: pieData.map(row => row.category_name),
      datasets: [
        {
          data: pieData.map(row => row.sales),
          backgroundColor: pieData.map((row, index) => getRandomColor(index)),
        },
      ],
    };

    setPieChartData(pieChartData);
  };

  const handleFilter = () => {
    fetchChartData();
  };

  return (
    <div className="dashboard-analytics">
      <Header /> {/* Add the Header component here */}
      <h2>Dashboard de vendas por categoria</h2>
      <div className="filters">
        <label>
          Data de início:
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </label>
        <label>
          Data final:
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </label>
        <button onClick={handleFilter}>Filter</button>
      </div>
      <div className="charts-grid">
        <div className="chart-wrapper main-chart">
          {chartData && <Line data={chartData} options={{
            plugins: {
              legend: {
                labels: {
                  font: {
                    size: 14,
                  },
                },
              },
              tooltip: {
                mode: 'nearest',
                intersect: false,
                callbacks: {
                  title: function(tooltipItems) {
                    return 'Data: ' + tooltipItems[0].label;
                  },
                  label: function(tooltipItem) {
                    let label = tooltipItem.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (tooltipItem.parsed.y !== null) {
                      label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tooltipItem.parsed.y);
                    }
                    return label;
                  }
                }
              }
            },
            scales: {
              y: {
                ticks: {
                  callback: function(value) {
                    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
                  }
                }
              }
            }
          }} />}
        </div>
        <div className="chart-wrapper">
          {pieChartData && <Pie data={pieChartData} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; // Renamed from DashboardAnalytics
