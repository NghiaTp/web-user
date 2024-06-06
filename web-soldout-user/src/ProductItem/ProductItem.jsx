import React, { useContext } from "react";
import "./ProductItem.css";
import { assets } from "../assets/assets";
import { StoreContext } from "../context/StoreContext";
const ProductItem = ({ id, name, price, description, brand, image }) => {
  
  const {cartItem, addToCart,removeFromCart} = useContext(StoreContext);

  return (
    <div className="product-item">
      <div className="product-item-img-container">
        <img className="product-item-image" src={image} alt="" />
        {
          !cartItem[id]
          ?<img src={assets.add_icon} onClick={() => addToCart(id)} className="add"/>
          :<div className="product-item-counter">
            <img onClick={() => removeFromCart(id)} src={assets.remove_icon} style={{width: 31}}/>
            <p>{cartItem[id]}</p>
            <img onClick={() => addToCart(id)} src={assets.add_icon} style={{width: 28}}/>
          </div>
        }
      </div>
      <div className="product-item-info">
        <div className="product-item-name">
          <p>{name}</p>
          <div className="rating_container">
            <p style={{fontWeight: '600', marginRight: 5, fontSize: 15}}>5/5</p>
            <img
              src={assets.rating_icon}
              alt=""
              style={{ width: 15, height: 15 }}
            />
          </div>
        </div>
        <p className="product-item-desc">{description}</p>
        <p className="product-item-price">{price}đ</p>
        {/* <p className="product-item-price">{brand}</p> */}
      </div>
    </div>
  );
};

export default ProductItem;
