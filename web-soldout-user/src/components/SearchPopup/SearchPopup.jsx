import React, { useState, useEffect, useContext } from "react";
import "./SearchPopup.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const SearchPopup = ({ setShowSearchPopup }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [results, setResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const { url } = useContext(StoreContext);
  const [searchHistory, setSearchHistory] = useState([]);
  const navigate = useNavigate();

  const addToSearchHistory = (term) => {
    if (term.trim() !== "" && !searchHistory.includes(term)) {
      setSearchHistory((prevHistory) => [term, ...prevHistory.slice(0, 4)]);
    }
  };

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoryResponse, brandResponse] = await Promise.all([
          axios.get(`${url}/api/categories/categories-list`),
          axios.get(`${url}/api/categories/brands-list`),
        ]);
        setCategories(categoryResponse.data.data);
        setBrands(brandResponse.data.data);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchFilters();
  }, [url]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        handleSearch();
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm, selectedCategory, selectedBrand]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/product/search`, {
        params: {
          search: searchTerm,
          category: selectedCategory,
          brand: selectedBrand,
        },
      });

      setResults(response.data.data);
      setNoResults(response.data.data.length === 0);
      addToSearchHistory(searchTerm);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
  };

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand === selectedBrand ? "" : brand);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSearchTerm("");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="search-popup">
      <div className="search-popup-container">
        <div className="search-popup-header">
          <h2>Tìm kiếm sản phẩm</h2>
          <button
            className="close-button"
            onClick={() => setShowSearchPopup(false)}
          >
            X
          </button>
        </div>
        <div className="search-popup-body">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="filters">
            <div className="filter-category">
              <h3>Danh mục</h3>
              <ul>
                {categories.map((category) => (
                  <li
                    key={category._id}
                    onClick={() => handleCategoryClick(category.name)}
                    className={
                      selectedCategory === category.name ? "active" : ""
                    }
                  >
                    <img src={`${url}/${category.image}`} alt={category.name} />
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="filter-brand">
              <h3>Hãng</h3>
              <ul>
                {brands.map((brand) => (
                  <li
                    key={brand._id}
                    onClick={() => handleBrandClick(brand.name)}
                    className={selectedBrand === brand.name ? "active" : ""}
                  >
                    <img src={`${url}/${brand.image}`} alt={brand.name} />
                    {brand.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button onClick={clearFilters}>Xóa bộ lọc</button>
          {searchTerm.trim() === "" ? (
            <div className="search-history">
              <h3>Lịch sử tìm kiếm</h3>
              {searchHistory.length > 0 ? (
                <ul>
                  {searchHistory.map((term, index) => (
                    <li key={index} onClick={() => setSearchTerm(term)}>
                      {term}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Không có lịch sử tìm kiếm</p>
              )}
            </div>
          ) : (
            <div className="search-results">
              {loading && <p>Đang tìm kiếm...</p>}
              {noResults && !loading ? (
                <p>Không có sản phẩm nào phù hợp với lựa chọn của bạn.</p>
              ) : (
                results.map((product) => (
                  <div
                    key={product._id}
                    className="search-result-item"
                    onClick={() =>
                      navigate(
                        `/product-detail/${product._id}`,
                        setShowSearchPopup(false)
                      )
                    }
                  >
                    <img
                      src={`${url}/images/${product.images[0].filename}`}
                      alt={product.name}
                    />
                    <div>
                      <h4>{product.name}</h4>
                      <p className={product.salePrice ? "original-price" : ""}>
                        {formatPrice(product.price)}
                      </p>
                      {product.salePrice && (
                        <p className="sale-price">
                          {formatPrice(product.salePrice)}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPopup;
