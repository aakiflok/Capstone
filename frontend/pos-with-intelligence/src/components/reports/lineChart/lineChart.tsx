import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
  const [chartData, setChartData] = useState<ChartData<"line", number[], string>>({
    labels: [],
    datasets: [
      {
        label: 'Monthly Sales',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  });

  useEffect(() => {
    const fetchMonthlySales = async () => {
      try {
        const response = await fetch('http://localhost:3001/monthly-sales'); // Adjust this endpoint as needed
        const monthlySales = await response.json();
        
        // Assuming the response is sorted by month and year
        const labels = monthlySales.map((sale: any) => `${sale.month}/${sale.year}`);
        const data = monthlySales.map((sale: any) => sale.totalSales);

        setChartData({
          labels,
          datasets: [
            {
              ...chartData.datasets[0],
              data
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching monthly sales data:', error);
      }
    };

    fetchMonthlySales();
  }, []);

  return (
    <div>
      <Line data={chartData} />
    </div>
  );
};

export default LineChart;
