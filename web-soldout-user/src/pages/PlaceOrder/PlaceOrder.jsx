import React, { useContext } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";

const PlaceOrder = () => {
  const { getTotalCartAmount } = useContext(StoreContext);
  return (
    <form className="place-order">
      <div className="place-order-left">
        <p className="title">Thông tin giao hàng</p>
        <div className="multi-fields">
          <input type="text" placeholder="Họ" />
          <input type="text" placeholder="Tên" />
        </div>
        <input type="text" placeholder="Email" />
        <input type="text" placeholder="Đường" />
        <div className="multi-fields">
          <input type="text" placeholder="Tỉnh/Thành phố" />
          <input type="text" placeholder="Phường/Xã" />
        </div>
        <input type="text" placeholder="Số điện thoại" />
      </div>
      <div className="place-order-right">
        <h2>Kiểm tra lại đơn hàng</h2>
        <div className="cart-total-detail">
          <p>Vận chuyển</p>
          <p>{getTotalCartAmount() === 0 ? 0 : 30000}đ</p>
        </div>
        <hr />
        <div className="cart-total-detail">
          <p>Tổng tiền hóa đơn:</p>
          <p>
            {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 30000}đ
          </p>
        </div>
        <button onClick={() => navigate("/order")}>Thanh toán</button>
      </div>
    </form>
  );
};

export default PlaceOrder;
