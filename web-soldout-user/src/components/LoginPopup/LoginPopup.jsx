import React, { useState, useEffect, useContext } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Đăng nhập");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    newPassword: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  const { setUserInfo } = useUser();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }

    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
    if (storedEmail && storedPassword) {
      setData({
        ...data,
        email: storedEmail,
        password: storedPassword,
      });
      setRememberMe(true);
    }
  }, [setShowLogin, setToken]);

  const onLogin = async (event) => {
    event.preventDefault();

    if (currState === "Đăng ký" && data.password !== data.confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }

    let newUrl = url;
    if (currState === "Đăng nhập") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    try {
      const response = await axios.post(newUrl, {
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (response.data.success) {
        const message =
          currState === "Đăng nhập"
            ? "Bạn muốn đăng nhập với tài khoản này?"
            : "Bạn muốn đăng ký với email này?";

        Swal.fire({
          title: "Thông báo!",
          icon: "question",
          text: message,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Đồng ý",
          cancelButtonText: "Hủy",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const { token  } = response.data;
            setToken(token);
            localStorage.setItem("token", token);
            localStorage.setItem("userId", response.data.data._id);
            localStorage.setItem("name", response.data.data.name);
            localStorage.setItem("avatar", response.data.data.avatar);

            setUserInfo({
              userId: response.data.data._id,
              name: response.data.data.name,
              avatar: response.data.data.avatar,
              token: token,
            });

            Swal.fire({
              icon: "success",
              text:
                currState === "Đăng nhập"
                  ? "Đăng nhập thành công!"
                  : "Đăng ký thành công!",
              timer: 1000,
              showConfirmButton: false,
            });
            console.log("id nè: ", response.data.data._id);

            setShowLogin(false);

            if (rememberMe) {
              localStorage.setItem("email", data.email);
              localStorage.setItem("password", data.password);
            } else {
              localStorage.removeItem("email");
              localStorage.removeItem("password");
            }
          }
        });
      } else {
        toast.error(
          response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.error("Login/Register error:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(`${url}/api/auth/send-otp`, {
        email: data.email,
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          text: "OTP đã được gửi đến email của bạn.",
          timer: 1000,
          showConfirmButton: false,
        });
      } else {
        toast.error(
          response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${url}/api/auth/reset-password`, {
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          text: "Mật khẩu đã được đặt lại thành công.",
          timer: 1000,
          showConfirmButton: false,
        });
        setForgotPassword(false);
        setCurrState("Đăng nhập");
      } else {
        toast.error(
          response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.error("Reset Password error:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="login-popup">
      <form
        action=""
        className="login-popup-container"
        onSubmit={forgotPassword ? handleResetPassword : onLogin}
      >
        <div className="login-popup-title">
          <h2 style={{ color: "#38B6FF" }}>
            {forgotPassword ? "Đặt lại mật khẩu" : currState}
          </h2>
          <img
            src={assets.cross_icon}
            alt=""
            onClick={() => setShowLogin(false)}
            className="close-icon"
          />
        </div>
        <div className="login-popup-inputs">
          {forgotPassword ? (
            <>
              <div className="otp-container">
                <input
                  name="email"
                  onChange={onChangeHandler}
                  value={data.email}
                  type="email"
                  placeholder="Email"
                  required
                />
                <input
                  name="otp"
                  onChange={onChangeHandler}
                  value={data.otp}
                  type="text"
                  placeholder="Nhập OTP"
                  required
                />
                <button
                  type="button"
                  className="otp-button"
                  onClick={handleSendOtp}
                >
                  Gửi OTP
                </button>
                <input
                  name="newPassword"
                  onChange={onChangeHandler}
                  value={data.newPassword}
                  type="password"
                  placeholder="Mật khẩu mới"
                  required
                />
              </div>
            </>
          ) : (
            <>
              {currState === "Đăng ký" && (
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
              {currState === "Đăng ký" && (
                <input
                  name="confirmPassword"
                  onChange={onChangeHandler}
                  value={data.confirmPassword}
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  required
                />
              )}
            </>
          )}
        </div>
        <button type="submit">
          {forgotPassword
            ? "Đặt lại mật khẩu"
            : currState === "Đăng ký"
            ? "Tạo tài khoản"
            : "Đăng nhập"}
        </button>
        {!forgotPassword && (
          <div className="login-popup-condition">
            {currState === "Đăng ký" ? (
              <input type="checkbox" required />
            ) : (
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
            )}
            <p>
              {currState === "Đăng ký"
                ? "Tôi đồng ý với điều kiện và điều khoản"
                : "Ghi nhớ"}
            </p>
          </div>
        )}
        {currState === "Đăng nhập" && !forgotPassword ? (
          <>
            <p>
              Bạn chưa có tài khoản?{" "}
              <span
                onClick={() => setCurrState("Đăng ký")}
                style={{ color: "#38B6FF", cursor: "pointer" }}
              >
                Đăng ký ngay
              </span>
            </p>
            <p>
              <span
                onClick={() => setForgotPassword(true)}
                style={{ cursor: "pointer", color: "#38B6FF" }}
              >
                Quên mật khẩu?
              </span>
            </p>
          </>
        ) : (
          <p>
            {currState === "Đăng ký" ? (
              <span onClick={() => setCurrState("Đăng nhập")}>
                Đăng nhập ngay
              </span>
            ) : (
              <></>
            )}
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
