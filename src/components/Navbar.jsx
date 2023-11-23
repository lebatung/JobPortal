import React from "react";

import Jobs from "./NavbarComponents/jobs/Jobs";
import LoginDropDown from "./NavbarComponents/LoginDropDown";
import { Image } from "antd";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { isAuthenticated, username } = useAuth();

  const navBar = {
    navBarContainer: {
      display: "flex",
      position: "relative",
      color: "white",
      background:
        "linear-gradient(90deg, rgba(16,11,96,1) 0%, rgba(14,4,157,1) 40%, rgba(14,28,148,1) 87%)",
      padding: "20px 80px",
      justifyContent: "space_between",
      alignItems: "center",
    },
    leftNavBarItemContainer: {
      display: "flex",
      position: "relative",
      justifyContent: "center",
      alignContent: "center",
      textDecoration: "none",
    },
    rightNavBarItemContainer: {
      display: "flex",
      position: "absolute",
      justifyContent: "center",
      alignContent: "center",

      right: "30px",
      navBarItems: {
        listStyle: "none",
      },
    },
    navBarItems: {
      listStyle: "none",
      padding: "0px 20px",
      cursor: "pointer",
    },
  };

  const handleMyJobsClick = () => {
    if (isAuthenticated) {
      window.location.href = "/myJobs";
    } else {
      toast.error("Bạn cần đăng nhập để truy cập vào trang này.", {
        position: 'top-center',
        autoClose: 2500,
      });
    }
  };
  return (
    <>
      <ToastContainer />
      <nav style={navBar.navBarContainer}>
        <Link to={"/"}>
          <img
            src={`http://localhost:8080/api/files/MyJobLogo.png`}
            alt="logo"
            width={100}
            height={50}
          />
        </Link>

        <ul style={navBar.leftNavBarItemContainer}>
          <li style={navBar.navBarItems}>
            <Link
              to={"/jobs"}
              style={{ textDecoration: "none", color: "white" }}
            >
              Việc làm
            </Link>
          </li>

          <li
            style={{
              ...navBar.navBarItems,
              color: "white",
              textDecoration: "none",
            }}
          >
            <Link
              to={"/companies"}
              style={{ textDecoration: "none", color: "white" }}
            >
              Công ty
            </Link>
          </li>

          <li
            style={{
              ...navBar.navBarItems,
              color: "white",
              textDecoration: "none",
            }}
          >
            <a
              style={{ textDecoration: "none", color: "white" }}
              onClick={handleMyJobsClick}
            >
              Việc làm của tôi
            </a>
          </li>
        </ul>

        <ul style={navBar.rightNavBarItemContainer}>
          <li style={navBar.rightNavBarItemContainer.navBarItems}>
            <LoginDropDown />
          </li>
        </ul>
      </nav>
    </>
  );
}
