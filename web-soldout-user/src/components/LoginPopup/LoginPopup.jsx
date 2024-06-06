import React, { useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("Đăng ký");
  return (
    <div className="login-popup">
      <form action="" className="login-popup-container">
        <div className="login-popup-title">
          <h2 style={{color: '#38B6FF'}}>{currState}</h2>
          <img
            src={assets.cross_icon}
            alt=""
            onClick={() => setShowLogin(false)}
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Đăng nhập" ? (
            <></>
          ) : (
            <input type="text" placeholder="Họ Tên" required />
          )}
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Mật khẩu" required />
        </div>
        <button>
          {currState === "Đăng ký" ? "Tạo tài khoản" : "Đăng nhập"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox"/>
          {currState === "Đăng ký" ? (
            <p>Tôi đồng ý với điều kiện và điều khoản</p>
          ) : (
            <p>Ghi nhớ</p>
          )}
        </div>
        {currState === "Đăng nhập" ? (
          <p>
            Bạn chưa có tài khoản?{" "}
            <span onClick={() => setCurrState("Đăng ký")}>Đăng ký ngay</span>
          </p>
        ) : (
          <p>
            Bạn đã có tài khoản?{" "}
            <span onClick={() => setCurrState("Đăng nhập")}>
              Đăng nhập ngay
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
