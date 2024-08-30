import React from "react";
import { Fade, Zoom, Slide } from "react-slideshow-image";
import { assets } from "../../assets/assets";
import "./Header.css";
import { useNavigate } from "react-router-dom";
// import ImageSlider from "./ImageSlider";

const Header = () => {
  const navigate = useNavigate();
  // const slider = [
  //   {
  //     image: assets.slide_1,
  //   },
  //   {
  //     image: assets.slide_2,
  //   },
  //   {
  //     image: assets.slide_3,
  //   },
  //   {
  //     image: assets.slide_4,
  //   },
  //   {
  //     image: assets.slide_5,
  //   },
  //   {
  //     image: assets.slide_6,
  //   },
  //   {
  //     image: assets.slide_7,
  //   },
  //   {
  //     image: assets.slide_8,
  //   },
  // ];

  // const slider_container = {
  //   width: '72%',
  //   height: '344px',
  //   margin: '30px auto',
  // }

  return (
    <div className="header">
      <img src={assets.header_image} alt="" className="img-header" />
      <div className="img_container">
        <div className="img_product_phone" onClick={() => navigate('/apple-product')}>
            <img
              src={assets.iphone}
              alt=""
              style={{ width: 400, height: "100%", borderRadius: 20 }}
            />
            <p className="title_image">Xem thêm sản phẩm của Apple</p>
        </div>
        <div className="img_product_phone" onClick={() => navigate('/samsung-product')}>
            <img
              src={assets.samsung_galaxy}
              alt=""
              style={{ width: 400, height: "100%", borderRadius: 20 }}
            />
            <p className="title_image">Xem thêm sản phẩm của Samsung</p>
        </div>
      </div>

      <div className="header-contents">
        <h2>Sản phẩm nổi bật</h2>
        <p>
          Khám phá những sản phẩm được thịnh hành nhất, có nhiều công nghệ mới
          cùng với kiểu dáng đẹp và được nhiều người dùng tin dùng nhất
        </p>
        <button onClick={() => navigate('/product')}>Đi đến</button>
      </div>
    </div>
  );
};

export default Header;
