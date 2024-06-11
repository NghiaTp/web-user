import React, { useEffect, useState } from "react";
import "./Add.css";
import { assets } from "../../src/assets/assets";
import axios from 'axios'
import { toast } from "react-toastify";

const Add = () => {
  const url = "http://localhost:8010"
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Điện thoại",
    brand: "Iphone",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("image", image);
    formData.append("category", data.category);
    formData.append("brand", data.brand);
    const response = await axios.post(`${url}/api/product/add`, formData)
    if(response.data.success){
      setData({
        name:"",
        description:"",
        price:"",
        category: "Điện thoại",
        brand: "Apple",
      })
      setImage(false)
      toast.success('Thêm sản phẩm mới thành công!');
    }
    else{
      toast.error('Thêm sản phẩm thất bại!')
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-image flex-col">
          <p>Tải ảnh lên</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_file}
              alt=""
              className="image-upload"
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Tên sản phẩm:</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Nhập ở đây"
          />
        </div>
        <div className="add-product-description flex-col">
          <p>Mô tả:</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Nhập mô tả sản phẩm"
            required
          ></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Loại sản phẩm:</p>
            <select name="category" onChange={onChangeHandler}>
              <option value="Điện thoại">Điện thoại</option>
              <option value="Laptop">Laptop</option>
              <option value="Tablet">Tablet</option>
              <option value="Tai nghe">Tai nghe</option>
              <option value="Loa">Loa</option>
              <option value="Phụ kiện">Phụ kiện</option>
              <option value="Smartwatch">Smartwatch</option>
            </select>
          </div>
          <div className="add-category flex-col">
            <p>Thuộc hãng:</p>
            <select name="brand" onChange={onChangeHandler}>
              <option value="Apple">Apple</option>
              <option value="Samsung">Samsung</option>
              <option value="Xiaomi">Xiaomi</option>
              <option value="Huawei">Huawei</option>
              <option value="Oppo">Oppo</option>
              <option value="Vivo">Vivo</option>
              <option value="Realme">Realme</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Giá sản phẩm:</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="1000đ"
            />
          </div>
        </div>
        <button type="submit" className="add-btn">
          Thêm mới
        </button>
      </form>
    </div>
  );
};

export default Add;
