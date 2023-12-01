import axios from 'axios';
import { ChartData } from 'chart.js';
import React, { useState, useEffect } from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';
import { Bar, Line } from 'react-chartjs-2';
import Navbar from '../navigation/nav';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);
// Additional imports for chart.js if needed

const Reports: React.FC = () => {
  // States for your filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // ... other filter states ...

  // States for your chart data
  const [barChartData, setBarChartData] = useState<ChartData<'bar', number[]>>({
    labels: [],
    datasets: [],
  });
  const [lineChartData, setLineChartData] = useState<ChartData<"line", number[], string>>({
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
  // ... other chart-related states ...

  useEffect(() => {
    // Assume you want to fetch both bar and line chart data simultaneously
    const fetchData = async () => {
      const barData = await fetchBarChartData(startDate, endDate);
      const lineData = await fetchLineChartData(startDate, endDate);
      setBarChartData(barData);
      if (lineData !== undefined) {
        setLineChartData(lineData);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const fetchBarChartData = async (startDate: string, endDate: string) => {
    try {
      // Replace with the actual endpoint you're using and pass any required parameters
      const response = await axios.get('http://localhost:3001/stock-bar-chart-data', {
        params: { startDate, endDate },
      });
      return response.data; // Assuming the response data is the format expected by your chart
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
      return []; // Return a fallback or empty data structure appropriate for your chart
    }
  };

  // This function fetches the data for the Line chart
  const fetchLineChartData = async (startDate: string, endDate: string) => {
    try {
      // Replace with the actual endpoint you're using and pass any required parameters
      const response = await axios.get('http://localhost:3001/monthly-sales', {
        params: { startDate, endDate },
      });

      const monthlySales = response.data;
      // Assuming the response is sorted by month and year
      const labels = monthlySales.map((sale: any) => `${sale.month}/${sale.year}`);
      const data = monthlySales.map((sale: any) => sale.totalSales);

      setLineChartData((prevChartData) => ({
        ...prevChartData,
        labels,
        datasets: [
          {
            ...prevChartData.datasets[0],
            data,
          },
        ],
      }));

    } catch (error) {
      console.error('Error fetching line chart data:', error);
      // Return a fallback or empty data structure appropriate for your chart
      setLineChartData({
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
    }
  };



  // Render method for Bar Chart
  const renderBarChart = () => {
    return (
      <Bar
        data={barChartData}
      // options for your bar chart
      />
    );
  };

  // Render method for Line Chart
  const renderLineChart = () => {
    return (
      <Line
        data={lineChartData}
      // options for your line chart
      />
    );
  };

  return (
    <>
      <Navbar />
      <Container fluid>

        <Row>
          <Col md={3} className="mb-3">
            {/* Filters */}
            <h2>Filters</h2>
            <Form>
              {/* Start Date Filter */}
              <Form.Group controlId="startDate">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Form.Group>

              {/* End Date Filter */}
              <Form.Group controlId="endDate">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Form.Group>
              {/* ... more filter inputs ... */}
            </Form>
          </Col>
          <Col md={9}>
            {/* Bar Chart */}
            <div>
              <h3>Bar Chart</h3>
              {renderBarChart()}
            </div>

            {/* Line Chart */}
            <div>
              <h3>Line Chart</h3>
              {renderLineChart()}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Reports;
