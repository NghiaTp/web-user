import React, { useContext, useState } from "react";
import "../Navbar/Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";

const Navbar = ({ setShowLogin, setShowSearchPopup }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const { userInfo } = useUser();
  const {url} = useContext(StoreContext);

  const navigate = useNavigate();

  const logout = () => {
    Swal.fire({
      title: "Thông báo!",
      text: "Bạn muốn đăng xuất?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
      }
    });
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.soldout_icon} className="logo" alt="Logo" />
      </Link>
      <ul className="navbar-menu">
        <li
          onClick={() => {
            navigate("/"), setMenu("home");
          }}
          className={menu === "home" ? "active" : ""}
        >
          Cửa hàng
        </li>
        <li
          onClick={() => {
            navigate("/sale-product"), setMenu("sale");
          }}
          className={menu === "sale" ? "active" : ""}
        >
          Flash sale
        </li>
        <li
          onClick={() => setMenu("support")}
          className={menu === "support" ? "active" : ""}
        >
          Hỗ trợ
        </li>
      </ul>
      <div className="navbar-right">
        <img
          src={assets.search_icon}
          className="icon"
          onClick={() => setShowSearchPopup(true)}
          alt="Search"
        />
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} className="icon" alt="Cart" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Đăng nhập</button>
        ) : (
          <div className="navbar-profile">
            <img
              src={`${url}/${userInfo.avatar}`}
              className="icon_profile"
              alt="Profile"
            />
            <ul className="nav-profile-dropdown">
              <li
                onClick={() =>
                  navigate(`/profile/${userInfo.userId}`)
                }
              >
                <img src={assets.profile} alt="Profile" />
                <p>Thông tin cá nhân</p>
              </li>
              <hr />
              <li onClick={() => navigate("/my-orders")}>
                <img src={assets.order_list} alt="Orders" />
                <p>Lịch sử đơn hàng</p>
              </li>
              <hr />
              <li onClick={() => navigate("/favorite")}>
                <img src={assets.favorite_icon} alt="Favorites" />
                <p>Sản phẩm yêu thích</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="Logout" />
                <p>Đăng xuất</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
