import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./FlashSale.css";

const FlashSale = () => {
  const [saleProduct, setSaleProduct] = useState([]);
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDataSaleProducts();
  }, []);

  const fetchDataSaleProducts = async () => {
    try {
      const response = await axios.get(
        `${url}/api/product/status?status=Giảm giá`
      );
      const productsWithImages = response.data.data.map((sale_product) => ({
        ...sale_product,
        images: sale_product.images.map((image) => ({
          ...image,
          url: `${url}/images/${image.filename}`,
        })),
      }));
      setSaleProduct(productsWithImages);
    } catch (error) {
      console.error("Error fetching product list:", error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="product_display" id="product_display">
      <h2>Flash Sale !!!</h2>
      <div className="product-sale-display-list">
        {saleProduct.map((product, index) => (
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
                <div className="sale-badge">{product.discountPercentage}%</div>
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
        ))}
      </div>
    </div>
  );
};

export default FlashSale;
