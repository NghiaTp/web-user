import React, { useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { useEffect } from "react";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {

  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Đăng nhập");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      setShowLogin(false); // Set setShowLogin to false if token exists
    } else {
      setShowLogin(true); // Set setShowLogin to true if token doesn't exist
    }
  }, [setShowLogin, setToken]);

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === "Đăng nhập") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }
    const response = await axios.post(newUrl, data);
    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      setShowLogin(false);
    }
    else{
      alert(response.data.message)
    }
  };

  return (
    <div className="login-popup">
      <form action="" className="login-popup-container" onSubmit={onLogin}>
        <div className="login-popup-title">
          <h2 style={{ color: "#38B6FF" }}>{currState}</h2>
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
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Họ Tên"
              required
            />
          )}
          <input
            type="email"
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            placeholder="Email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Mật khẩu"
            required
          />
        </div>
        <button type="submit">
          {currState === "Đăng ký" ? "Tạo tài khoản" : "Đăng nhập"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required/>
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
