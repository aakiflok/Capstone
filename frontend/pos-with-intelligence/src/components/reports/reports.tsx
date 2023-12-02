import axios from 'axios';
import { ChartData } from 'chart.js';
import React, { useState, useEffect } from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';
import { Bar, Line, Pie } from 'react-chartjs-2';
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
  ArcElement,
} from 'chart.js';

import { categoryOptions } from '../forms/productForms/addEditProductForm';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);
const Reports: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCheckboxChange = (category: string, isChecked: boolean) => {
    setSelectedCategories((prevSelectedCategories) => {
      if (isChecked) {
        // Add to array
        return [...prevSelectedCategories, category];
      } else {
        // Remove from array
        return prevSelectedCategories.filter((c) => c !== category);
      }
    });
  };

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

  const [pieChartData, setPieChartData] = useState<ChartData<'pie', number[]>>({
    labels: [],
    datasets: [
      {
        label: 'Category Sales',
        data: [],
        backgroundColor: [],
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      const barData = await fetchBarChartData(startDate, endDate);
      setBarChartData(barData);
      const lineData = await fetchLineChartData();
      if (lineData !== undefined) {
        setLineChartData(lineData);
      }
      
      const pieData = await fetchPieChartData();
      setPieChartData(pieData);
    };

    fetchData();
  }, [startDate, endDate, selectedCategories]);

  const fetchBarChartData = async (startDate: string, endDate: string) => {
    try {
      const response = await axios.get('https://pos-crud.onrender.com/stock-bar-chart-data', {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
      return [];
    }
  };

  const fetchLineChartData = async () => {
    try {
      const response = await axios.get('https://pos-crud.onrender.com/monthly-sales');
      const monthlySalesData = response.data;

      // Transform the data as needed for your line chart
      const labels = monthlySalesData.map((item: any) => `${item.month}/${item.year}`);
      const data = monthlySalesData.map((item: any) => item.totalSales);

      return {
        labels,
        datasets: [
          {
            label: 'Monthly Sales',
            data,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
          },
        ],
      };
    } catch (error) {
      console.error('Error fetching line chart data:', error);
      return {
        labels: [],
        datasets: [
          {
            label: 'Monthly Sales',
            data: [],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
          },
        ],
      };
    }
  };

  const fetchPieChartData = async () => {
    try {
      const response = await axios.get('https://pos-crud.onrender.com/monthly-sales-by-category');
      const pieData = response.data;

      // Apply filters to the data based on selected categories
      const filteredData = applyFilters(pieData, selectedCategories);

      // Map the filtered data to labels and dataset for the pie chart
      const labels = filteredData.map((dataItem: any) => dataItem.category);
      const data = filteredData.map((dataItem: any) => dataItem.totalSales);
      const backgroundColors = generateRandomColors(filteredData.length);

      return {
        labels,
        datasets: [
          {
            label: 'Category Sales',
            data,
            backgroundColor: backgroundColors,
          },
        ],
      };
    } catch (error) {
      console.error('Error fetching pie chart data:', error);
      return {
        labels: [],
        datasets: [
          {
            label: 'Category Sales',
            data: [],
            backgroundColor: [],
          },
        ],
      };
    }
  };

  const applyFilters = (data: any[], categories: string[]) => {
    // If no categories are selected, return the full dataset
    if (categories.length === 0) return data;

    // Return data that matches any of the selected categories
    return data.filter((item) => categories.includes(item.category));
  };

  const generateRandomColors = (count: number) => {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)}, 0.6)`;
      colors.push(color);
    }
    return colors;
  };

  const renderBarChart = () => {
    return <Bar data={barChartData} />;
  };

  const renderLineChart = () => {
    return <Line data={lineChartData} />;
  };

  const renderPieChart = () => {
    return <Pie data={pieChartData} />;
  };

  return (
    <>
      <Navbar />
      <Container fluid>
        <Row>
          <Col md={2} className="mb-3">
            <h2>Filters</h2>
            <Form>
              <Form.Group>
                <Form.Label>Categories</Form.Label>
                {categoryOptions.map((category, index) => (
                  <Form.Check
                    key={index}
                    type="checkbox"
                    label={category}
                    checked={selectedCategories.includes(category)}
                    onChange={(e) =>
                      handleCheckboxChange(category, e.currentTarget.checked)
                    }
                  />
                ))}
              </Form.Group>
            </Form>
          </Col>
          <Col md={6}>
            <div>
              <h3 style={{ marginBottom: '20px', paddingBottom: '20px' }}>Bar Chart</h3>
              {renderBarChart()}
            </div>

            <div>
              <h3 style={{ marginBottom: '20px', paddingBottom: '20px' }}>Line Chart</h3>
              {renderLineChart()}
            </div>
          </Col>
          <Col md={2}>
            <div>
              <h3 style={{ marginBottom: '20px', paddingBottom: '20px' }}>Pie Chart</h3>
              {renderPieChart()}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Reports;