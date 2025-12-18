import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../main.css";

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="app-layout">
      <Navbar />

      <button className="logout-fixed-btn" onClick={handleLogout}>
        Logout
      </button>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
