import React, { useContext, useState } from "react";
import "../Navbar/Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate} from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
const Navbar = ({setShowLogin}) => {
  const [menu, setMenu] = useState("home");

  const {getTotalCartAmount,token,setToken} = useContext(StoreContext);

  const navigate = useNavigate()

  // const navigate = useNavigation();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/")
  }

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
        <div className="navbar-search-icon">
          <Link to='/cart'><img src={assets.basket_icon} className="icon" /></Link>
          <div className={getTotalCartAmount()===0?"":"dot"}></div>
        </div>
        {!token?<button onClick={() => setShowLogin(true)}>Đăng nhập</button>
        :<div className="navbar-profile">
          <img src={assets.profile_icon} className="icon_profile"/>
          <ul className="nav-profile-dropdown">
            <li><img src={assets.order_list} alt="" /><p>Lịch sử đơn hàng</p></li>
            <hr />
            <li><img src={assets.favorite_icon} alt="" /><p>Sản phẩm yêu thích</p></li>
            <hr />
            <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Đăng xuất</p></li>
          </ul>
        </div>  
        }
        
      </div>
    </div>
  );
};

export default Navbar;
