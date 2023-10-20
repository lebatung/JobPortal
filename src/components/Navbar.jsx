import React from "react";
import Jobs from "./NavbarComponents/Jobs";
import LoginDropDown from "./NavbarComponents/LoginDropDown";

import { Link } from "react-router-dom";

export default function Navbar() {


  const navBar = {
    navBarContainer: {
      display: "flex",
      position: "relative",
      color: "white",
      background: "linear-gradient(90deg, rgba(16,11,96,1) 0%, rgba(14,4,157,1) 40%, rgba(14,28,148,1) 87%)",
      padding: "20px 80px",
      justifyContent: "space_between",
      alignItems: "center",
    },
    leftNavBarItemContainer: {
      display: "flex",
      position: "relative",
      justifyContent: "center",
      alignContent: "center",

      
    },
    rightNavBarItemContainer: {
      display: "flex",
      position: "absolute",
      justifyContent: "center",
      alignContent: "center",

      right: "30px",
     navBarItems :{
      listStyle: "none",
     },
    },
    navBarItems: {
      listStyle: "none",
      padding: "0px 20px",
      cursor: "pointer",
    },


  };

  return (
    <nav style={navBar.navBarContainer}>
      <a>LOGO</a>

      <ul style={navBar.leftNavBarItemContainer}>
        <li style={navBar.navBarItems}>
          <Jobs />
        </li>
        <li style={navBar.navBarItems} >Công ty</li>
        <li style={navBar.navBarItems} >
        <Link
          
          to={"/myJobs"}>
          Việc làm của tôi
        </Link>
        
        </li>
      </ul>

      <ul style={navBar.rightNavBarItemContainer}>
        <li style={navBar.rightNavBarItemContainer.navBarItems}>
        <LoginDropDown/>
        </li>
      </ul>
    </nav>
  );
}
