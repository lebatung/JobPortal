import React from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const container = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
};
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  flex: 1,
  backgroundColor: "#f5f5f5",
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
