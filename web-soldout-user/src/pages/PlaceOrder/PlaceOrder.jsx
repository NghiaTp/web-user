import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, product_list, cartItem, url } =
    useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    district: "",
    commune: "",
    phone: "",
  });

  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  useEffect(() => {
    if (!token) {
      Swal.fire({
        title: "Thông báo!",
        text: "Bạn chưa đăng nhập tài khoản!",
        icon: "warning",
        confirmButtonColor: "#d33",
        confirmButtonText: "Thoát",
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result.isConfirmed) {
          navigate("/cart");
        }
      });
    } else if (getTotalCartAmount() === 0) {
      Swal.fire({
        title: "Thông báo!",
        text: "Không thể thanh toán nếu không có sản phẩm!",
        icon: "warning",
        confirmButtonColor: "#d33",
        confirmButtonText: "Thoát",
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result.isConfirmed) {
          navigate("/cart");
        }
      });
    }
  }, [token]);

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    product_list.map((item) => {
      if (cartItem[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItem[item._id];
        orderItems.push(itemInfo);
      }
    });
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount(),
    };
    let response = await axios.post(url + "/api/order/place", orderData, {
      headers: { token },
    });
    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url);
    } else {
      alert("Có lỗi xảy ra");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Thông tin giao hàng</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="Họ"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Tên"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="text"
          placeholder="Email"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Đường"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="Tỉnh/Thành phố"
          />
          <input
            required
            name="district"
            onChange={onChangeHandler}
            value={data.district}
            type="text"
            placeholder="Huyện/Quận"
          />
          <input
            required
            name="commune"
            onChange={onChangeHandler}
            value={data.commune}
            type="text"
            placeholder="Phường/Xã"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Số điện thoại"
        />
      </div>
      <div className="place-order-right">
        <h2>Kiểm tra lại đơn hàng</h2>
        <div className="cart-total-detail">
          <p>Vận chuyển</p>
          <p>0</p>
        </div>
        <hr />

        <div className="cart-total-detail">
          <p>Giảm giá:</p>
          <p>{formatPrice(getTotalCartAmount())}</p>
        </div>

        <div className="cart-total-detail">
          <p>Tổng tiền hóa đơn:</p>
          <p>
            {formatPrice(
              getTotalCartAmount() === 0 ? 0 : getTotalCartAmount()
            )}
          </p>
        </div>
        <button type="submit">Thanh toán</button>
      </div>
    </form>
  );
};

export default PlaceOrder;
