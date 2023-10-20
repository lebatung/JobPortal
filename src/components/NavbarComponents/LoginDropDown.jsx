import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import "./style.css";

import {
  UserOutlined,
  CaretDownOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

import { Button } from "antd";

import LoginForm from "../../pages/users/Form/LoginForm";
import { Link } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { getAuthToken } from "../../helpers/axios_helper";

const LoginDropDown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);

  const { username, userRole } = useAuth();

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleLoginForm = () => {
    setIsLoginFormVisible(!isLoginFormVisible);
  };
  const handleLoginFormClick = (e) => {
    e.stopPropagation();
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const updateIsAuthenticated = (values) => {
    setIsAuthenticated(values);
  };
  const updateIsLoginFormVisible = (value) => {
    setIsLoginFormVisible(value);
  };

  const onLogOut = () => {
    localStorage.removeItem("auth_token");
    setIsAuthenticated(false);
  };

  const { getActualUserRole } = useAuth();
  const actualUserRole = getActualUserRole();

  const dashboardNavigation = () => {
    let targetUrl = "";

    switch (userRole) {
      case "ROLE_ADMIN":
        targetUrl = "/adminDashboard";
        break;
      case "ROLE_RECRUITMENT":
        targetUrl = "/recruitmentDashboard";
        break;
      case "ROLE_CANDIDATE":
        targetUrl = "/candidateDashboard";
        break;
      default:
        break;
    }

    navigate(targetUrl);
    //console.log(highestRole);
  };

  useEffect(() => {
    if (getAuthToken()) {
      setIsAuthenticated(true);
      
    }
  }, [isAuthenticated]);

  const loginStyle = {
    loginDropDownBtn: {
      border: "1px solid lightgray",
      color: "white",
      cursor: "pointer",
      width: "150px",
      height: "50px",
      backgroundColor: "transparent",
    },
    dropdownContent: {
      top: "60px",
      display: "block",
      position: "absolute",
      backgroundColor: "#fff",
      width: "310px",
      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
      borderRadius: "10px",
      right: "0px",
      transform: "translateZ(100%)",

      textAlign: "left",
      zIndex: "151",

      dropdownContentLabel: {
        color: "black",
        marginLeft: "10px",
      },
      dropdownContentLink: {
        textDecoration: "none",
        color: "black",
      },
    },
    dropdownContentItemContainer: {
      padding: "15px 10px",
      alignItem: "left",
      cursor: "pointer",
    },
  };

  const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Màu overlay mờ */
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  const LoginContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 700px;
    height: auto;
    padding: 20px;
    background-color: white;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    display: block;
    z-index: 1002;
    transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    animation: 0.25s ease-in-out 0s 1 normal none running;
  `;

  const LoginFormContainer = {
    LoginFormTitle: {
      color: "#000",
      alignContent: "center",
    },
    LoginForm: {},
    LoginLabel: {
      color: "#000",
      margin: "0px 0px 5px",
      fontWeight: "500",
      display: "inline-block",
      fontSize: "14px",
      fontHeight: "18px",
    },
    LoginButton: {
      margin: "5px 0px 0px",
      right: "0",
    },
    LoginAction: {
      margin: "10px 0px 0px",
      justifyContent: "right",
      display: "inline-flex",
      alignItems: "center",
    },
  };

  return (
    <>
      {isAuthenticated ? (
        // Hiển thị nội dung sau khi đăng nhập
        <>
          <Button
            onClick={toggleDropdown}
            style={loginStyle.loginDropDownBtn}
            className="hoverLoginDropdownBtn"
          >
            <UserOutlined /> {username} <CaretDownOutlined />
          </Button>
          {isDropdownOpen && (
            <div style={loginStyle.dropdownContent}>
              <div
                style={loginStyle.dropdownContentItemContainer}
                className="hoverLoginButton"
              >
                <span
                  onClick={dashboardNavigation}
                  style={loginStyle.dropdownContent.dropdownContentLink}
                >
                  <LoginOutlined /> &nbsp; Trang quản trị
                </span>
                {isLoginFormVisible && (
                  <div>
                    <Overlay>
                      <LoginContainer onClick={handleLoginFormClick}>
                        <h2 style={LoginFormContainer.LoginFormTitle}>
                          Đăng Nhập
                        </h2>
                        <LoginForm />
                      </LoginContainer>
                    </Overlay>
                  </div>
                )}
              </div>

              <hr />

              <label style={loginStyle.dropdownContent.dropdownContentLabel}>
                Đăng xuất
              </label>

              <div
                style={loginStyle.dropdownContentItemContainer}
                className="hoverLoginButton"
              >
                <a
                  href="/"
                  style={loginStyle.dropdownContent.dropdownContentLink}
                  onClick={onLogOut}
                >
                  <UserAddOutlined /> &nbsp; Đăng xuất
                </a>
              </div>
            </div>
          )}
        </>
      ) : (
        // Hiển thị nội dung cho người dùng chưa đăng nhập
        <>
          <Button
            onClick={toggleDropdown}
            style={loginStyle.loginDropDownBtn}
            className="hoverLoginDropdownBtn"
          >
            <UserOutlined /> Đăng nhập <CaretDownOutlined />
          </Button>

          {isDropdownOpen && (
            <div style={loginStyle.dropdownContent}>
              <div
                style={loginStyle.dropdownContentItemContainer}
                className="hoverLoginButton"
                onClick={toggleLoginForm}
              >
                <a style={loginStyle.dropdownContent.dropdownContentLink}>
                  <LoginOutlined /> &nbsp; Đăng nhập
                </a>
                {isLoginFormVisible && (
                  <div>
                    <Overlay>
                      <LoginContainer onClick={handleLoginFormClick}>
                        <h2 style={LoginFormContainer.LoginFormTitle}>
                          Đăng Nhập
                        </h2>
                        <LoginForm
                          updateIsAuthenticated={updateIsAuthenticated}
                          updateIsLoginFormVisible={updateIsLoginFormVisible}
                        />
                      </LoginContainer>
                    </Overlay>
                  </div>
                )}
              </div>

              <hr />

              <label style={loginStyle.dropdownContent.dropdownContentLabel}>
                Đăng ký tài khoản
              </label>

              <div
                style={loginStyle.dropdownContentItemContainer}
                className="hoverLoginButton"
              >
                <Link
                  to="/register"
                  href=""
                  style={loginStyle.dropdownContent.dropdownContentLink}
                >
                  <UserAddOutlined /> &nbsp; Tạo tài khoản mới
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default LoginDropDown;
