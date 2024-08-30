import React, { useEffect, useState } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [sortStatus, setSortStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchListOrders = async () => {
    const response = await axios.get(url + "/api/order/list-orders");
    if (response.data.success) {
      setOrders(response.data.data);
      console.log(response.data.data);
    } else {
      toast.error(response.data.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + "/api/order/update-status", {
      orderId,
      status: event.target.value,
    });
    if (response.data.success) {
      await fetchListOrders();
    }
  };

  useEffect(() => {
    fetchListOrders();
  }, []);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleSortChange = (event) => {
    setSortStatus(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredOrders = orders
    .filter((order) => {
      const statusMatch =
        sortStatus === "all" ||
        (sortStatus === "Chưa thanh toán"
          ? !order.payment
          : order.status === sortStatus);
      const searchMatch =
        searchTerm === "" ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && searchMatch;
    })
    .sort((a, b) => {
      const statusOrder = [
        "Chưa thanh toán",
        "Chờ xác nhận",
        "Đang chuẩn bị đơn",
        "Đang vận chuyển",
        "Giao thành công",
      ];
      return (
        statusOrder.indexOf(a.payment ? a.status : "Chưa thanh toán") -
        statusOrder.indexOf(b.payment ? b.status : "Chưa thanh toán")
      );
    });

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="filter">
        <label htmlFor="status-filter">Sắp xếp theo trạng thái:</label>
        <select
          id="status-filter"
          onChange={handleSortChange}
          value={sortStatus}
        >
          <option value="all">Tất cả</option>
          <option value="Chưa thanh toán">Chưa thanh toán</option>
          <option value="Chờ xác nhận">Chờ xác nhận</option>
          <option value="Đang chuẩn bị đơn">Đang chuẩn bị đơn</option>
          <option value="Đang vận chuyển">Đang vận chuyển</option>
          <option value="Giao thành công">Giao thành công</option>
        </select>

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
          <div key={index} className="my-orders-order">
            <div className="order-status">
              <p>Hình thức thanh toán: {order.type}</p>
              <p>
                Trạng thái: {order.payment ? order.status : "Chưa thanh toán"}
              </p>

              {order.payment && (
                <select
                  onChange={(event) => statusHandler(event, order._id)}
                  value={order.status}
                >
                  <option value="Chờ xác nhận">Chờ xác nhận</option>
                  <option value="Đang chuẩn bị đơn">Đang chuẩn bị đơn</option>
                  <option value="Đang vận chuyển">Đang vận chuyển</option>
                  <option value="Giao thành công">Giao thành công</option>
                </select>
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
            <div className="order-summary">
              <h4>Thành tiền:</h4>
              <p>{formatPrice(order.amount)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
