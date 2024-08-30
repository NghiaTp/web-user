import React, { useContext, useEffect, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext.jsx";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext.jsx";
import axios from "axios";

const Cart = () => {
  const {
    cartItem,
    product_list,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
  } = useContext(StoreContext);
  const { userInfo } = useUser();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("atm");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  useEffect(() => {
    if (token) {
      axios
        .get(`${url}/api/address/list`, { headers: { token } })
        .then((response) => {
          if (response.data && response.data.data) {
            setAddresses(response.data.data);
          } else {
            console.error("Unexpected data format:", response.data);
          }
        })
        .catch((error) => console.error("Error fetching addresses:", error));
    }
  }, [url, token]);

  const handlePayment = async () => {
    if (paymentMethod === "atm") {
      navigate("/order");
    } else if (paymentMethod === "cash") {
      if (!selectedAddress) {
        alert("Vui lòng chọn địa chỉ giao hàng.");
        return;
      }

      const chosenAddress = addresses.find(
        (addr) => addr._id === selectedAddress
      );

      if (!chosenAddress) {
        alert("Địa chỉ không hợp lệ.");
        return;
      }

      let orderItems = product_list
        .filter((item) => cartItem[item._id] > 0)
        .map((item) => ({
          name: item.name,
          price: item.status === "Giảm giá" ? item.salePrice : item.price,
          quantity: cartItem[item._id],
          images: item.images,
        }));

      let orderData = {
        userId: userInfo.userId,
        items: orderItems,
        amount: getTotalCartAmount(),
        address: {
          address: chosenAddress.address,
          fullname: chosenAddress.fullname,
          phone: chosenAddress.phone,
        },
      };

      try {
        const response = await axios.post(
          `${url}/api/order/cash/order`,
          orderData
        );

        if (response.data.success) {
          alert("Đơn hàng đã được tạo thành công!");
          navigate("/verify");
        } else {
          alert(response.data.message || "Có lỗi xảy ra khi tạo đơn hàng.");
        }
      } catch (error) {
        console.error("Error creating cash order:", error);
        alert("Có lỗi xảy ra khi tạo đơn hàng.");
      }
    }
  };

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
        {product_list.map((item) => {
          if (cartItem[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img
                    src={url + "/images/" + item.images[0].filename}
                    alt=""
                  />
                  <p>{item.name}</p>
                  {item.status === "Giảm giá" ? (
                    <p>{formatPrice(item.salePrice)}</p>
                  ) : (
                    <p>{formatPrice(item.price)}</p>
                  )}
                  <p>{cartItem[item._id]}</p>
                  {item.status === "Giảm giá" ? (
                    <p>{formatPrice(item.salePrice * cartItem[item._id])}</p>
                  ) : (
                    <p>{formatPrice(item.price * cartItem[item._id])}</p>
                  )}
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
          <h2 style={{ marginBottom: 20 }}>Tổng hóa đơn</h2>
          <div className="cart-total-detail">
            <p>Thành tiền</p>
            <p>{formatPrice(getTotalCartAmount())}</p>
          </div>
          <hr />
          <div className="cart-total-detail">
            <p>Vận chuyển</p>
            <p>{formatPrice(getTotalCartAmount() > 200000 ? 0 : 30000)}</p>
          </div>
          <hr />
          <div className="cart-total-detail">
            <p>Tổng tiền hóa đơn:</p>
            <p>
              {formatPrice(
                getTotalCartAmount() > 200000
                  ? getTotalCartAmount()
                  : getTotalCartAmount() + 30000
              )}
            </p>
          </div>

          <div className="payment-method">
            <p>Chọn phương thức thanh toán</p>
            <div
              className={`payment-method atm ${
                paymentMethod === "atm" ? "active" : ""
              }`}
              onClick={() => setPaymentMethod("atm")}
            >
              <input
                type="radio"
                id="atm"
                name="paymentMethod"
                value="atm"
                checked={paymentMethod === "atm"}
                readOnly
              />
              <label htmlFor="atm">Thanh toán bằng thẻ ATM</label>
            </div>
            <div
              className={`payment-method cash ${
                paymentMethod === "cash" ? "active" : ""
              }`}
              onClick={() => setPaymentMethod("cash")}
            >
              <input
                type="radio"
                id="cash"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                readOnly
              />
              <label htmlFor="cash">Thanh toán tiền mặt</label>
            </div>
          </div>

          {paymentMethod === "cash" && (
            <div className="address-selection">
              <p>Chọn địa chỉ giao hàng:</p>
              <select
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
              >
                <option value="">Chọn địa chỉ</option>
                {addresses.map((address) => (
                  <option key={address._id} value={address._id}>
                    {address.fullname} - {address.address} - {address.phone}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button onClick={handlePayment}>Đặt hàng ngay</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>Mã giảm giá</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Chọn mã giảm" disabled />
              <button>Đồng ý</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
