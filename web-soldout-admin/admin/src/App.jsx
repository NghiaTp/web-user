import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Add from "../pages/Add/Add";
import Orders from "../pages/Orders/Orders";
import List from "../pages/List/List";
import Category from "../pages/Category/Category";
import UserList from "../pages/UserManager/UserList";
import StaffList from "../pages/StaffManager/StaffList";
import Statistical from "../pages/Statistical/Statistical";
import TopSellingProducts from "../pages/TopSelling/TopSellingProducts";
import CancelOrder from "../pages/CancelOrder/CancelOrder";
import Login from "../pages/Login/Login";
import PrivateRoute from "../routes/PrivateRoute";
import MainLayout from "../components/MainLayout/MainLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const App = () => {
  const [role, setRole] = useState(localStorage.getItem("role") || "guest");
  const url = "http://172.16.88.130:8010";

  const handleLogin = (userRole) => {
    setRole(userRole);
  };

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} url={url} />} />
        <Route
          element={role !== "guest" ? <MainLayout /> : <Navigate to="/" />}
        >
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/orders" element={<Orders url={url} />} />
          <Route path="/cancel-order" element={<CancelOrder url={url} />} />

          {/* Route yêu cầu quyền admin */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/categories" element={<Category url={url} />} />
            <Route path="/user-manager" element={<UserList url={url} />} />
            <Route path="/staff-manager" element={<StaffList url={url} />} />
            <Route path="/statistical" element={<Statistical url={url} />} />
            <Route
              path="/top-selling"
              element={<TopSellingProducts url={url} />}
            />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
