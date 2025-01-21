'use client'
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { getRevenueData } from "@/services/ApiServices";

const Chart = () => {
  const [chartData, setChartData] = useState(null);
  const [revenue, setRevenue] = useState(null);

  const fetchData = async () => {
    try {
      const response = await getRevenueData();
      console.log("revenue",response.data.data)
      const data =response.data.data
      console.log("data",data);
      const extractedData = data.map(item => {
        const [month, count] = item.split(': ');
        return { month, count: parseInt(count) };
      });
      setChartData(extractedData);
      setRevenue(response.data.revenue)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const options = {
    scales: {
      x: {
        gridLines: {
          display: false,
        },
      },
      y: {
        gridLines: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
    
  };

  const renderChart = () => {
    if (!chartData) return null;

    const dataLabels = chartData.map(item => item.month);
    const dataValues = chartData.map(item => item.count);

    const data = {
      labels: dataLabels,
      datasets: [
        {
          label: "Revenue",
          data: dataValues,
          backgroundColor: "#5A6ACF",
          borderColor: "#5A6ACF",
          borderWidth: 1,
          barThickness: 10,
          borderRadius: 0,
        },
      ],
    };

    return (
      <div>
        <h4 style={{color:'#05004E',fontFamily:"serif"}}><strong>Revenue</strong> </h4>
        <p style={{textDecoration:'bold'}}>INR {revenue}</p>
        <Bar data={data} options={options} />
      </div>
    );
  };

  return renderChart();
};

export default Chart;