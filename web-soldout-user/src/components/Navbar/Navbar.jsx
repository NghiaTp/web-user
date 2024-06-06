import React, { useContext, useState } from "react";
import "../Navbar/Navbar.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
const Navbar = ({setShowLogin}) => {
  const [menu, setMenu] = useState("home");

  const {getTotalCartAmount} = useContext(StoreContext);

  return (
    <div className="navbar">
      <Link to='/'><img src={assets.soldout_icon} className="logo" /></Link>
      <ul className="navbar-menu">
        <li onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>Cửa hàng</li>
        <li onClick={()=>setMenu("laptop")} className={menu==="laptop"?"active":""}>Flash sale</li>
        <li onClick={()=>setMenu("phone")} className={menu==="phone"?"active":""}>Top sản phẩm</li>
        <li onClick={()=>setMenu("support")} className={menu==="support"?"active":""}>Hỗ trợ</li>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} className="icon" />
        <img src={assets.account_icon} className="icon" />
        <div className="navbar-search-icon">
          <Link to='/cart'><img src={assets.basket_icon} className="icon" /></Link>
          <div className={getTotalCartAmount()===0?"":"dot"}></div>
        </div>
        <button onClick={() => setShowLogin(true)}>Đăng nhập</button>
      </div>
    </div>
  );
};

export default Navbar;
