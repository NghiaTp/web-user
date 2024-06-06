import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItem, product_list, removeFromCart, getTotalCartAmount} = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Sản phẩm</p>
          <p>Tên sản phẩm</p>
          <p>Giá</p>
          <p>Số lượng</p>
          <p>Tổng</p>
          <p>Xóa</p>
        </div>
        <br />
        <hr />
        {product_list.map((item, index) => {
          if (cartItem[item._id] > 0) {
            return (
              <div>
                <div className="cart-items-title cart-items-item">
                  <img src={item.image} alt="" />
                  <p>{item.name}</p>
                  <p>{item.price}</p>
                  <p>{cartItem[item._id]}</p>
                  <p>{item.price * cartItem[item._id]}</p>
                  <p className="cross" onClick={() => removeFromCart(item._id)}>
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2 style={{marginBottom: 20}}>Tổng hóa đơn</h2>
          <div className="cart-total-detail">
            <p>Thành tiền</p>
            <p>{getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="cart-total-detail">
            <p>Vận chuyển</p>
            <p>{getTotalCartAmount()===0?0:30000}đ</p>
          </div>
          <hr />
          <div className="cart-total-detail">
            <p>Tổng tiền hóa đơn:</p>
            <p>{getTotalCartAmount()===0?0:getTotalCartAmount()+30000}đ</p>
          </div>
          <button onClick={() => navigate('/order')}>Đặt hàng ngay</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>Mã giảm giá</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Chọn mã giảm" disabled/>
              <button>Đồng ý</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
