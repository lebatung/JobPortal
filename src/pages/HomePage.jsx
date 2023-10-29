import React from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const container = {
  backgroundColor: "#f5f5f5",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
};
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  backgroundColor: "#f5f5f5",
  flex: 1,
};

export default function HomePage() {
  return (
    <>
      <Navbar></Navbar>
      <SearchBar />
      <div style={container}>
        
        <div style={containerStyle}>
          <Outlet />
        </div>

        <Footer></Footer>
      </div>
    </>
  );
}
