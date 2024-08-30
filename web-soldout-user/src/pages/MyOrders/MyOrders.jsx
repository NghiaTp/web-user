import React, { useState, useContext, useEffect } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { url, token } = useContext(StoreContext);
  const [activeTab, setActiveTab] = useState("all");

  const fetchOrders = async (status = "") => {
    try {
      const response = await axios.post(
        `${url}/api/order/user-orders`,
        { status },
        { headers: { token } }
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const payForOrder = async (orderId) => {
    try {
      const response = await axios.post(
        `${url}/api/order/pay/${orderId}`,
        {},
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        alert("Có lỗi xảy ra trong quá trình thanh toán");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Có lỗi xảy ra trong quá trình thanh toán");
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await axios.post(
        `${url}/api/order/cancel-order/${orderId}`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        alert("Đơn hàng đã được hủy thành công");
        fetchOrders(activeTab);
      } else {
        alert("Có lỗi xảy ra khi hủy đơn hàng");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Có lỗi xảy ra khi hủy đơn hàng");
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders(activeTab === "all" ? "" : activeTab);
    }
  }, [token, activeTab]);

  const canCancelOrder = (order) => {
    return order.status === "Chờ xác nhận" || !order.payment;
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="my-orders">
      <h2>Đơn hàng của tôi</h2>
      <div className="order-tabs">
        <button
          className={activeTab === "all" ? "active" : ""}
          onClick={() => setActiveTab("all")}
        >
          Tất cả
        </button>
        <button
          className={activeTab === "Chờ xác nhận" ? "active" : ""}
          onClick={() => setActiveTab("Chờ xác nhận")}
        >
          Chờ xác nhận
        </button>
        <button
          className={activeTab === "Đang chuẩn bị đơn" ? "active" : ""}
          onClick={() => setActiveTab("Đang chuẩn bị đơn")}
        >
          Đang chuẩn bị đơn
        </button>
        <button
          className={activeTab === "Đang vận chuyển" ? "active" : ""}
          onClick={() => setActiveTab("Đang vận chuyển")}
        >
          Đang vận chuyển
        </button>
        <button
          className={activeTab === "Giao thành công" ? "active" : ""}
          onClick={() => setActiveTab("Giao thành công")}
        >
          Giao thành công
        </button>
        <button
          className={activeTab === "Đã hủy" ? "active" : ""}
          onClick={() => setActiveTab("Đã hủy")}
        >
          Đã hủy
        </button>
      </div>
      <div className="container">
        {data.map((order, index) => (
          <div key={index} className="my-orders-order">
            <div className="order-status">
              <p>Mã đơn: {order._id}</p>
              {order.type === "Trực tiếp" ? (
                <div className="payment-method direct">
                  Hình thức thanh toán: Trực tiếp
                </div>
              ) : (
                <div className="payment-method ATM">
                  Hình thức thanh toán: ATM
                </div>
              )}
              {order.payment === true ? (
                <div>
                  <span className="green-dot">&#x25cf;</span>{" "}
                  <b>{order.status}</b>
                </div>
              ) : (
                <div>
                  <span className="red-dot">&#x25cf;</span>{" "}
                  <b>Chưa thanh toán</b>
                </div>
              )}
            </div>
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <img
                  src={url + "/images/" + item.images[0].filename}
                  alt={item.name}
                />
                <div className="order-item-details">
                  <p>{item.name}</p>
                  <p>x {item.quantity}</p>
                </div>
                <div>
                  {item.status === "Giảm giá" ? (
                    <p>{formatPrice(item.salePrice)}</p>
                  ) : (
                    <p>{formatPrice(item.price)}</p>
                  )}
                </div>
              </div>
            ))}
            <div>
              <p>Số lượng sản phẩm: {order.items.length}</p>
            </div>
            <div className="order-address-summary">
              {order.type === "Trực tiếp" ? (
                <div className="order-address">
                  <p>Tên: {order.address.fullname}</p>
                  <p>Số điện thoại: {order.address.phone}</p>
                  <p>Địa chỉ: {order.address.address}</p>
                </div>
              ) : (
                <div className="order-address">
                  <p>
                    Tên: {order.address.firstName} {order.address.lastName}
                  </p>
                  <p>Số điện thoại: {order.address.phone}</p>
                  <p>
                    Địa chỉ: {order.address.street}, {order.address.commune},{" "}
                    {order.address.district}, {order.address.city}
                  </p>
                </div>
              )}
              <div className="order-summary-container">
                <div className="order-summary">
                  <h4>Thành tiền:</h4>
                  <p>{formatPrice(order.amount)}</p>
                  <div className="order-actions">
                    {order.payment === false && (
                      <button onClick={() => payForOrder(order._id)}>
                        Thanh toán
                      </button>
                    )}
                    {order.status === "Giao thành công" ? (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        disabled={!canCancelOrder(order)}
                        className={
                          canCancelOrder(order)
                            ? "cancel-button"
                            : "cancel-button disabled"
                        }
                      >
                        Hủy đơn
                      </button>
                    ) : (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        disabled={!canCancelOrder(order)}
                        className={
                          canCancelOrder(order)
                            ? "cancel-button"
                            : "cancel-button disabled"
                        }
                      >
                        Hủy đơn
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
