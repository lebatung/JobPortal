import React from "react";
import "../admin/css/style.css";
import Sidebar from "./components/Sidebar";
import Header from "../admin/components/Header";
import { Outlet } from "react-router-dom";
export default function AdminDashboard() {
  return (
    <>
      <div className="admin-dashboard">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="content">
          <div className="header">
            <Header />
          </div>
          <div className="sub-content"> 
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
