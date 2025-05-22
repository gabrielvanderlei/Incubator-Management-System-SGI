import Chart from 'chart.js/auto';

import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { LinearScale } from 'chart.js';

const Dashboard = () => {
    Chart.register(LinearScale);

  const commonOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Monthly Sales',
      data: [10, 23, 13, 35, 50],
      backgroundColor: 'rgba(75,192,192,0.2)',
      borderColor: 'rgba(75,192,192,1)',
    }],
  };

  const barChartData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: 'Colors in Stock',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  };

  const pieChartData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [{
      data: [10, 20, 30],
      backgroundColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)'
      ],
    }],
  };

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white p-4 rounded shadow-md">
        <h3 className="text-lg font-medium mb-2">Monthly Sales</h3>
        <div style={{ height: '250px' }}>
          <Line data={lineChartData} options={commonOptions} />
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow-md">
        <h3 className="text-lg font-medium mb-2">Stock by Color</h3>
        <div style={{ height: '250px' }}>
          <Bar data={barChartData} options={commonOptions} />
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow-md">
        <h3 className="text-lg font-medium mb-2">Color Preferences</h3>
        <div style={{ height: '250px' }}>
          <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
