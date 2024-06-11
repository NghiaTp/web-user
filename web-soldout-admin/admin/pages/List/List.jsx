import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import {} from '@heroicons/react'
import { assets } from "../../src/assets/assets";

const List = () => {
  const url = "http://localhost:8010";
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/product/list`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Tải danh sách sản phẩm thất bại! ");
    }
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
              <img src={`${url}/images/` + item.image}/>
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price}đ</p>
              <p>{item.brand}</p>
              <div>
                <img src={assets.update_icon} className="iconAction_edit" />
                <img src={assets.delete_icon} className="iconAction" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
