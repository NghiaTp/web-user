import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import FlashSale from "./pages/FlashSale/FlashSale";
import SearchPopup from "./components/SearchPopup/SearchPopup";
import FavoriteProduct from "./pages/FavoriteProduct/FavoriteProduct";
import { ToastContainer } from "react-toastify";
import UserProfile from "./pages/Profile/UserProfile";
import { UserProvider } from "./context/UserContext";
import UpdateProfile from "./pages/UpdateProfile/UpdateProfile";
import Address from "./pages/Address/Address";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import ListAppleProduct from "./pages/ListProduct/ListAppleProduct";
import ListSamsungProduct from "./pages/ListProduct/ListSamsungProduct";
import ListPhoneProduct from './pages/ListProductCategory/ListPhoneProduct'
import ListTabletProduct from "./pages/ListProductCategory/ListTabletProduct";
import ListLaptopProduct from "./pages/ListProductCategory/ListLaptopProduct";
import ProductDisplay from "./ProductDisplay/ProductDisplay";
import ListProduct from "./pages/ListProduct/ListProduct";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSearch, setShowSearchPopup] = useState(false);

  return (
    <>
      <UserProvider>
        {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
        {showSearch ? (
          <SearchPopup setShowSearchPopup={setShowSearchPopup} />
        ) : (
          <></>
        )}
        <div className="app">
          <ToastContainer />

          <Navbar
            setShowLogin={setShowLogin}
            setShowSearchPopup={setShowSearchPopup}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<PlaceOrder />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/product-detail/:id" element={<ProductDetail />} />
            <Route path="/sale-product" element={<FlashSale />} />
            <Route path="/favorite" element={<FavoriteProduct />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/update-profile/:userId" element={<UpdateProfile/>}/>
            <Route path="/address" element={<Address/>}/>
            <Route path="/change-password" element={<ChangePassword/>}/>
            <Route path="/apple-product" element={<ListAppleProduct/>}/>
            <Route path="/samsung-product" element={<ListSamsungProduct/>}/>
            <Route path="/phone-product" element={<ListPhoneProduct/>}/>
            <Route path="/tablet-product" element={<ListTabletProduct/>}/>
            <Route path="/laptop-product" element={<ListLaptopProduct/>}/>
            <Route path="/product" element={<ListProduct/>}/>
          </Routes>
        </div>
        <Footer />
      </UserProvider>
    </>
  );
};

export default App;
