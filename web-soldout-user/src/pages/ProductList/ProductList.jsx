import React, { useContext, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductList.css";
import { StoreContext } from "../../context/StoreContext";

const ProductList = () => {
  const { category, brand } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { url } = useContext(StoreContext);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        category: category || undefined,
        brand: brand || undefined,
        sort: sortOrder,
      };
      const response = await axios.get(`${url}/api/product`, { params });
      setProducts(response.data.data);
    } catch (error) {
      setError("Error fetching products.");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, brand, sortOrder]);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  return (
    <div className="product-list">
      <h1>Danh sách sản phẩm {category || brand || "Tất cả sản phẩm"}</h1>
      <div className="sort-container">
        <label htmlFor="sort">Sắp xếp theo giá:</label>
        <select id="sort" value={sortOrder} onChange={handleSortChange}>
          <option value="asc">Giá tăng dần</option>
          <option value="desc">Giá giảm dần</option>
        </select>
      </div>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p>{error}</p>
      ) : products.length === 0 ? (
        <p>Không có sản phẩm nào.</p>
      ) : (
        <ul className="product-container">
          {products.map((product) => (
            <li key={product._id} className="product-item">
              <img
                src={`${url}/images/${product.images[0].filename}`}
                alt={product.name}
                className="product-image"
                onClick={() => navigate(`/product-detail/${product._id}`)}
              />
              <div className="product-info">
                <p className="product-name">{product.name}</p>
                <p className="product-price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
