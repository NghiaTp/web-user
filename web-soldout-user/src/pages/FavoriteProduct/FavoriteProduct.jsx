import React, { useContext, useEffect } from "react";
import "./FavoriteProduct.css";
import { StoreContext } from "../../context/StoreContext";
import { Link, useNavigate } from "react-router-dom";

const FavoriteProduct = () => {
  const { favorites, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  useEffect(() => {
    console.log(favorites);
  });

  return (
    <div className="favorites">
      <h1 >Danh sách yêu thích</h1>
      {favorites.length === 0 ? (
        <p>Chưa có sản phẩm nào trong danh sách yêu thích.</p>
      ) : (
        <ul className="product-container">
          {favorites.map((product, index) => (
            <div className="product-container">
              {product.status === "Giảm giá" ? (
                <div
                  className="product-item"
                  key={index}
                  onClick={() => navigate(`/product-detail/${product._id}`)}
                >
                  <div className="product-item-img-container">
                    <img
                      src={`${url}/images/${product.images[0].filename}`}
                      alt={product.name}
                      className="product-item-image"
                    />
                    {product.discountPercentage && (
                      <div className="sale-badge">
                        {product.discountPercentage}%
                      </div>
                    )}
                  </div>
                  <div className="product-item-info">
                    <div className="product-item-name">
                      <p>{product.name}</p>
                    </div>
                    {product.discountPercentage && (
                      <div>
                        <p className="productsale-price">
                          {formatPrice(product.price)}
                        </p>
                        <p className="product-item-saleprice">
                          {formatPrice(product.salePrice)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className="product-item"
                  key={index}
                  onClick={() => navigate(`/product-detail/${product._id}`)}
                >
                  <div className="product-item-img-container">
                    <img
                      src={`${url}/images/${product.images[0].filename}`}
                      alt={product.name}
                      className="product-item-image"
                    />
                  </div>
                  <div className="product-item-info">
                    <div className="product-item-name">
                      <p>{product.name}</p>
                    </div>
                    <div>
                      <p className="product-price">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoriteProduct;
