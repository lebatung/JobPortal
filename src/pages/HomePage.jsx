import React from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const containerStyle = {
  backgroundColor: "white",
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: "#f9f9faff",
};

export default function HomePage() {
  return (
    <>
      <Navbar></Navbar>
      <SearchBar />
      <div style={containerStyle}>
        
        <Outlet />
      </div>

      <Footer></Footer>
    </>
  );
}
