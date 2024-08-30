// src/components/MainLayout.jsx
import React from "react";
import Navbar from "../Navbar/Navbar";
import Slidebar from "../SlideBar/Slidebar";
import { Outlet } from "react-router-dom";
import "./MainLayout.css";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="app-content">
        <Slidebar />
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
