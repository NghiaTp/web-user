import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Statistical.css";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Statistical = ({ url }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [period, setPeriod] = useState("day");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      let endpoint = `${url}/api/order/statistical-order-by-${period}`;

      // Handle date range for 'day' period
      if (period === "day" && selectedDate) {
        endpoint += `?startDate=${selectedDate}&endDate=${selectedDate}`;
      }
      // Handle date range for 'month' period
      else if (period === "month" && selectedYear && selectedMonth) {
        const startDate = `${selectedYear}-${String(selectedMonth).padStart(
          2,
          "0"
        )}-01`;
        const endDate = new Date(selectedYear, selectedMonth, 0)
          .toISOString()
          .split("T")[0];
        endpoint += `?startDate=${startDate}&endDate=${endDate}`;
      }
      // Handle date range for 'year' period
      else if (period === "year" && selectedYear) {
        const startDate = `${selectedYear}-01-01`;
        const endDate = `${selectedYear + 1}-01-01`;
        endpoint += `?startDate=${startDate}&endDate=${endDate}`;
      }

      try {
        const response = await axios.get(endpoint);
        const data = response.data;

        // Ensure data is valid and format it correctly
        if (Array.isArray(data) && data.length > 0) {
          const labels = data.map((item) => item._id);
          const amounts = data.map((item) => item.totalAmount);

          setChartData({
            labels,
            datasets: [
              {
                label: "Tổng số tiền đơn hàng",
                data: amounts,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
              },
            ],
          });
          setError(null);
        } else {
          setChartData({
            labels: [],
            datasets: [],
          });
          setError("Dữ liệu thống kê không có.");
        }
      } catch (error) {
        console.error("Error fetching order statistics:", error);
        setError("Lỗi khi lấy dữ liệu thống kê!");
      }
    };

    fetchData();
  }, [url, period, selectedDate, selectedYear, selectedMonth]);

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
    setSelectedDate("");
    setSelectedYear(new Date().getFullYear());
    setSelectedMonth(new Date().getMonth() + 1);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const getMaxYValue = () => {
    switch (period) {
      case "day":
        return 500000000;
      case "month":
        return 1000000000; 
      case "year":
        return 2000000000; 
      default:
        return 2000000000; 
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Thống kê doanh số theo ${
          period === "day" ? "ngày" : period === "month" ? "tháng" : "năm"
        }`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: getMaxYValue(),
        ticks: {
          callback: (value) => {
            // Format labels as currency
            return value.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            });
          },
        },
      },
    },
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Thống kê doanh số</h2>
      </div>
      <div className="select-container">
        <label htmlFor="period">Chọn khoảng thời gian:</label>
        <select id="period" value={period} onChange={handlePeriodChange}>
          <option value="day">Ngày</option>
          <option value="month">Tháng</option>
          <option value="year">Năm</option>
        </select>
        {period === "day" && (
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            placeholder="Chọn ngày"
          />
        )}
        {period === "month" && (
          <div>
            <input
              type="number"
              value={selectedYear}
              onChange={handleYearChange}
              placeholder="Chọn năm"
              min="2000"
              max={new Date().getFullYear()}
            />
            <input
              type="number"
              value={selectedMonth}
              onChange={handleMonthChange}
              placeholder="Chọn tháng"
              min="1"
              max="12"
            />
          </div>
        )}
        {period === "year" && (
          <input
            type="number"
            value={selectedYear}
            onChange={handleYearChange}
            placeholder="Chọn năm"
            min="2000"
            max={new Date().getFullYear()}
          />
        )}
      </div>
      <div>
        <button onClick={() => navigate("/top-selling")}>
          Sản phẩm bán chạy
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="chart-container">
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
};

export default Statistical;
