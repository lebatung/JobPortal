import React from "react";
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  HomeOutlined,
  MessageOutlined,
  BlockOutlined,
} from "@ant-design/icons";

export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "homepage",
    icon: <HomeOutlined  />,
    label: "HomePage",
    to: "/",
  },
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: "Dashboard",
    to: "/adminDashboard",
  },
  {
    key: "users",
    icon: <UserOutlined />,
    label: "Người dùng",
    to: "/adminDashboard/users",
  },
  {
    key: "categories",
    icon: <AppstoreAddOutlined />,
    label: "Danh mục",
    to: "/adminDashboard/categories",
  },
  {
    key: "blogs",
    icon: <BlockOutlined />,
    label: "Tin tuyển dụng",
    to: "/adminDashboard/blogs",
  },  
  {
    key: "messages",
    icon: <MessageOutlined />,
    label: "Tin nhắn",
    to: "/adminDashboard/messages",
  },
];
