import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TopSellingProduct.css";

const TopSellingProducts = ({ url }) => {
  const [topProducts, setTopProducts] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchTopProducts = async () => {
    try {
      const response = await axios.get(`${url}/api/order/get-top`, {
        params: {
          startDate,
          endDate,
        },
      });
      setTopProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching top selling products:", error);
    }
  };

  useEffect(() => {
    fetchTopProducts();
  }, [url, startDate, endDate]);

  return (
    <div className="top-selling-products-container">
      <h2>Sản phẩm bán chạy</h2>
      <div className="filters">
        <label>
          Ngày bắt đầu:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          Ngày kết thúc:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={fetchTopProducts}>Lọc</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Hình</th>
            <th>Tên sản phẩm</th>
            <th>Số lượng bán</th>
            <th>Tổng tiền bán được</th>
          </tr>
        </thead>
        <tbody>
          {topProducts.map((product, index) => (
            <tr key={index}>
              <td>
                <img
                  src={`${url}/images/${product.imageUrl[0].filename}`}
                  alt={product.name}
                />
              </td>
              <td>{product.name}</td>
              <td>{product.totalOrders}</td>
              <td>
                {product.totalAmount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopSellingProducts;
