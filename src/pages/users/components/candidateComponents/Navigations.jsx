import React from "react";
import {
  DashboardOutlined,
  UserOutlined,
  HeartOutlined,
  HomeOutlined,
  AuditOutlined,
  FileProtectOutlined,

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
    to: "/candidateDashboard",
  },
  {
    key: "userDetail",
    icon: <UserOutlined />,
    label: "Thông tin cá nhân",
    to: "/candidateDashboard/personalDetail",
  },
  {
    key: "cvs",
    icon: <AuditOutlined />,
    label: "Quản lý CV",
    to: "/candidateDashboard/cvs",
  },
  {
    key: "applied",
    icon: <FileProtectOutlined />,
    label: "Tin tuyển dụng",
    to: "/candidateDashboard/applied",
  },
  {
    key: "favorites",
    icon: <HeartOutlined />,
    label: "Công việc yêu thích",
    to: "/candidateDashboard/favorites",
  },
  
];
