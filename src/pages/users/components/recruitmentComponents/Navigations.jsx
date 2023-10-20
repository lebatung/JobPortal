import React from "react";
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  HomeOutlined,
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
    to: "/recruitmentDashboard",
  },
  {
    key: "userDetail",
    icon: <UserOutlined />,
    label: "Thông tin cá nhân",
    to: "/recruitmentDashboard/personalDetail",
  },
  {
    key: "blogs",
    icon: <UserOutlined />,
    label: "Tin tuyển dụng",
    to: "/recruitmentDashboard/blogs",
  },
  {
    key: "candidates",
    icon: <UserOutlined />,
    label: "Người ứng tuyển",
    to: "/recruitmentDashboard/candidates",
  },
];
