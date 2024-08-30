import React, { useState, useEffect, useContext } from "react";
import "./ListSamsungProduct.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ListSamsungProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("default");
  const [showOnlySale, setShowOnlySale] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppleProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${url}/api/product/products/brand?brand=Samsung`
        );
        if (response.data.success) {
          setProducts(response.data.data);
          setFilteredProducts(response.data.data);
        } else {
          setError("Không thể tải danh sách sản phẩm Apple");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải danh sách sản phẩm Apple");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppleProducts();
  }, [url]);

  useEffect(() => {
    let result = [...products];

    if (selectedCategory !== "Tất cả") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (showOnlySale) {
      result = result.filter((product) => product.status === "Giảm giá");
    }

    switch (sortOption) {
      case "priceAsc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, sortOption, showOnlySale, selectedCategory]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const toggleShowOnlySale = () => {
    setShowOnlySale(!showOnlySale);
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  const categories = [
    "Tất cả",
    ...new Set(products.map((product) => product.category)),
  ];

  return (
    <div className="apple-products">
      <h1>Sản phẩm đến từ SamSung</h1>
      <div className="filter-options">
        <select onChange={handleSortChange} value={sortOption}>
          <option value="default">Sắp xếp mặc định</option>
          <option value="priceAsc">Giá tăng dần</option>
          <option value="priceDesc">Giá giảm dần</option>
        </select>
        <select onChange={handleCategoryChange} value={selectedCategory}>
          <option value="Tất cả">Tất cả danh mục</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <label>
          <input
            type="checkbox"
            checked={showOnlySale}
            onChange={toggleShowOnlySale}
          />
          Chỉ hiện sản phẩm đang giảm giá
        </label>
      </div>
      {filteredProducts.length === 0 ? (
        <p>Không có sản phẩm Apple nào.</p>
      ) : (
        <div className="product-container">
          {filteredProducts.map((product) => (
            <div
              className="product-item"
              key={product._id}
              onClick={() => navigate(`/product-detail/${product._id}`)}
            >
              <div className="product-item-img-container">
                <img
                  src={`${url}/images/${product.images[0].filename}`}
                  alt={product.name}
                  className="product-item-image"
                />
                {product.status === "Giảm giá" && (
                  <div className="sale-badge">
                    {product.discountPercentage}%
                  </div>
                )}
              </div>
              <div className="product-item-info">
                <div className="product-item-name">
                  <p>{product.name}</p>
                </div>
                {product.status === "Giảm giá" ? (
                  <div>
                    <p className="productsale-price">
                      {formatPrice(product.price)}
                    </p>
                    <p className="product-item-saleprice">
                      {formatPrice(product.salePrice)}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="product-price">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListSamsungProduct;
