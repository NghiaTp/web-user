import React from "react";
import "./Navbar.css";
import { assets } from "../../src/assets/assets";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };
  return (
    <div className="navbar">
      <img src={assets.logo} alt="" className="logo" />
      <button onClick={logout}>Đăng xuất</button>
    </div>
  );
};

export default Navbar;
