import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../src/assets/assets";
import Swal from "sweetalert2";

const List = ({ url }) => {
  const [list, setList] = useState([]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/product/list`);
    if (response.data.success) {
      setList(response.data.data);
      const formattedList = response.data.data.map((item) => ({
        ...item,
        price: formatPrice(item.price),
      }));
      setList(formattedList);
    } else {
      toast.error("Tải danh sách sản phẩm thất bại! ");
    }
  };

  const deleteProduct = (productId) => {
    Swal.fire({
      title: "Xóa sản phẩm?",
      text: "Bạn có chắc xóa sản phẩm này khỏi list!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.post(`${url}/api/product/delete`, {
          id: productId,
        });
        Swal.fire({
          title: "Xóa!",
          text: "Đã xóa sản phẩm này",
          icon: "success",
        });
        if (response.data.success) {
          toast.success("Xóa thành công!");
        } else {
          toast.error("Xóa thất bại!");
        }
      }
      await fetchList();
    });
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>Danh sách tất cả sản phẩm</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Hình</b>
          <b>Tên sản phẩm</b>
          <b>Loại sản phẩm</b>
          <b>Giá</b>
          <b>Hãng</b>
          <b>Thay đổi</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/` + item.image} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price}</p>
              <p>{item.brand}</p>
              <div>
                <img src={assets.update_icon} className="iconAction_edit" />
                <img
                  src={assets.delete_icon}
                  className="iconAction"
                  onClick={() => deleteProduct(item._id)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
