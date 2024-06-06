import React, { useContext, useState } from "react";
import "./ProductDisplay.css";
import { StoreContext } from "../context/StoreContext";
import ProductItem from "../ProductItem/ProductItem";
// import { product_list } from "../assets/assets";

const ProductDisplay = ({ categories }) => {
  const { product_list } = useContext(StoreContext);
  return (
    <div className="product_display" id="product_display">
      <h2>Sản phẩm tiêu biểu</h2>
      <div className="product-display-list">
        {product_list.map((item, index) => {
          if ((categories == "all" || categories === item.categories)) {
            return (
              <ProductItem
                key={index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                brand={item.brand}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default ProductDisplay;
