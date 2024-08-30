import React, { useEffect, useState } from "react";
import "./CancelOrder.css";
import axios from "axios";
import { toast } from "react-toastify";

const CancelOrder = ({ url }) => {
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCancelledOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list-cancel-order");
      if (response.data.success) {
        setCancelledOrders(response.data.data);
        console.log(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching cancelled orders:", error);
      toast.error("Không thể lấy danh sách đơn hàng đã hủy");
    }
  };

  useEffect(() => {
    fetchCancelledOrders();
  }, []);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredOrders = cancelledOrders.filter((order) =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="cancelled-orders add">
      <h3>Đơn Hàng Đã Hủy</h3>
      <div className="filter">
        <label htmlFor="search">Tìm kiếm theo mã đơn:</label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Nhập mã đơn"
        />
      </div>
      <div className="container">
        {filteredOrders.map((order, index) => (
          <div key={index} className="cancelled-order-item">
            <div className="order-content">
              <div className="order-status">
                <p>Mã đơn hàng: {order._id}</p>
                <p>Hình thức thanh toán: {order.type}</p>
                <p>Trạng thái: Đã hủy</p>
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
              {order.type === "Trực tiếp" ? (
                <div className="order-address">
                  <p className="address-title">Thông tin địa chỉ:</p>
                  <div className="address-item">
                    <span>Tên:</span>
                    <span>{order.address.fullname}</span>
                  </div>
                  <div className="address-item">
                    <span>Số điện thoại:</span>
                    <span>{order.address.phone}</span>
                  </div>
                  <div className="address-item">
                    <span>Địa chỉ:</span>
                    <span>{order.address.address}</span>
                  </div>
                </div>
              ) : (
                <div className="order-address">
                  <p className="address-title">Thông tin địa chỉ:</p>
                  <div className="address-item">
                    <span>Tên:</span>
                    <span>
                      {order.address.firstName} {order.address.lastName}
                    </span>
                  </div>
                  <div className="address-item">
                    <span>Số điện thoại:</span>
                    <span>{order.address.phone}</span>
                  </div>
                  <div className="address-item">
                    <span>Địa chỉ:</span>
                    <span>
                      {order.address.street}, {order.address.commune},{" "}
                      {order.address.district}, {order.address.city}
                    </span>
                  </div>
                </div>
              )}
              <div className="order-amount">
                <h4>Thành tiền:</h4>
                <p>{formatPrice(order.amount)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CancelOrder;
