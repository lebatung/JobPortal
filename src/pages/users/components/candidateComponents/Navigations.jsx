import React from "react";
import {
  DashboardOutlined,
  UserOutlined,
  HeartOutlined,
  HomeOutlined,
  AuditOutlined,
  FileProtectOutlined,
  MessageOutlined,

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
  {
    key: "messages",
    icon: <MessageOutlined />,
    label: "Tin nhắn",
    to: "/candidateDashboard/messages",
  },
  {
    key: "cvs",
    icon: <AuditOutlined />,
    label: "Tạo CV",
    to: "/candidateDashboard/cvs",
  },
  
];
