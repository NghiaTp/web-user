import React, { useContext } from "react";
import "./ProductItem.css";
import { assets } from "../assets/assets";
import { StoreContext } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";

const ProductItem = ({
  id,
  name,
  price,
  description,
  images,
  brand,
  status,
  salePrice,
  discountPercentage,
}) => {
  const { cartItem, addToCart, removeFromCart, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  console.log("id", id);
  console.log("cart", cartItem);

  const handleItemClick = () => {
    navigate(`/product-detail/${id}`);
  };

  return (
    <div className="product-container-item" onClick={handleItemClick}>
      <ul  className="product-container-item">
        <div className="product-container-item">
          {status === "Giảm giá" ? (
            <div
              className="product-item"
              onClick={() => navigate(`/product-detail/${id}`)}
            >
              <div className="product-item-img-container">
                <img
                  src={`${url}/images/${images}`}
                  alt={name}
                  className="product-item-image"
                />
                {discountPercentage && (
                  <div className="sale-badge">{discountPercentage}%</div>
                )}
              </div>
              <div className="product-item-info">
                <div className="product-item-name">
                  <p>{name}</p>
                </div>
                {discountPercentage && (
                  <div>
                    <p className="productsale-price">{formatPrice(price)}</p>
                    <p className="product-item-saleprice">
                      {formatPrice(salePrice)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              className="product-item"
              onClick={() => navigate(`/product-detail/${id}`)}
            >
              <div className="product-item-img-container">
                <img
                  src={`${url}/images/${images}`}
                  alt={name}
                  className="product-item-image"
                />
              </div>
              <div className="product-item-info">
                <div className="product-item-name">
                  <p>{name}</p>
                </div>
                <div>
                  <p className="product-price">{formatPrice(price)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </ul>
    </div>
  );
};

export default ProductItem;
