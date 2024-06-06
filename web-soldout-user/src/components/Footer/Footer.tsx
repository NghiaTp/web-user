import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";
const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.soldout_icon} alt=""  style={{width: 120, height: 50}}/>
          <p>Theo dõi SoldOut trên công động để cập nhật tin tức nhanh nhất!</p>
          <div className="footer-social-icon">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.instagram_icon} alt="" />
            <img src={assets.tiktok_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>SoldOut</h2>
          <ul>
            <li>Trang chủ</li>
            <li>Về chúng tôi</li>
            <li>Vận chuyển</li>
            <li>Chính sách</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>Liên lạc</h2>
          <ul>
            <li>+84-927131304</li>
            <li>phantruongnghia.071002@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-address">CÔNG TY SOLDOUT - Q12, Tô Ký, Tp HCM</p>
    </div>
  );
};

export default Footer;
