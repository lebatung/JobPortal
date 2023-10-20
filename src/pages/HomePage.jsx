import React from 'react'
import Navbar from '../components/Navbar';
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";


export default function HomePage() {
  return (
    <>
      <Navbar></Navbar>
      <Footer></Footer>  
      <Outlet />
    </>
    
    )
}
