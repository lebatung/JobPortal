import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "antd";
import Sidebar from "./components/Sidebar";
import Header from "../admin/components/Header";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  request,
  loadBlogsSortedByEnable,
  loadUserByRoles,
  loadUsersByActive
} from "../../helpers/axios_helper"; // Thay đổi đường dẫn tới file request của bạn
import { set } from "react-hook-form";

ChartJS.register(ArcElement, Tooltip, Legend);

const { Meta } = Card;

export default function AdminDashboard() {
  const [candidateData, setCandidateData] = useState([]);
  const [recruitmentData, setRecruitmentData] = useState([]);

  const [activeBlogsData, setActiveBlogsData] = useState([]);
  const [inactiveBlogsData, setInactiveBlogsData] = useState([]);
  const [pendingBlogsData, setPendingBlogsData] = useState([]);
  const [rejectedBlogsData, setRejectedBlogsData] = useState([]);

  const [activeUsersData, setActiveUsersData] = useState([]);
  const [pendingUsersData, setPendingUsersData] = useState([]);
  const [inactiveUsersData, setInactiveUsersData] = useState([]);

  useEffect(() => {
    loadUserByRoles()
      .then((response) => {
        console.log("users Response:", response);
        if (response) {
          setCandidateData(response.candidates || []);
          setRecruitmentData(response.recruitments || []);
        } else {
          console.error("No data in loadUserByRoles response.");
        }
      })
      .catch((error) => {
        console.error("Error loading loadUserByRoles:", error);
      });

    loadBlogsSortedByEnable()
      .then((response) => {
        console.log("blogs Response:", response);
        if (response) {
          setActiveBlogsData(response.activeBlogs || []);
          setInactiveBlogsData(response.inactiveBlogs || []);
          setPendingBlogsData(response.pendingBlogs || []);
          setRejectedBlogsData(response.rejectedBlogs || []);
        } else {
          console.error("No data in loadBlogsSortedByEnable response.");
        }
      })
      .catch((error) => {
        console.error("Error loading loadBlogsSortedByEnable:", error);
      });

    loadUsersByActive()
      .then((response) => {
        console.log("users Active Response:", response);
        if (response) {
          setActiveUsersData(response.activeUsers || []);
          setPendingUsersData(response.pendingUsers || []);
          setInactiveUsersData(response.inactiveUsers || []);

        } else {
          console.error("No data in loadUsersByActive response.");
        }
      })
      .catch((error) => {
        console.error("Error loading loadUsersByActive:", error);
      });
  }, []);

  // Dữ liệu cho biểu đồ Doughnut for users
  const usersChartData = {
    labels: ["Ứng viên", "Nhà tuyển dụng"],
    datasets: [
      {
        data: [candidateData.length, recruitmentData.length],
        backgroundColor: ["#E0D0C1", "#A76D60"],
      },
    ],
  };
  // Dữ liệu cho biểu đồ Doughnut for users Active
  const usersActiveChartData = {
    labels: ["Hoạt động", "Không hoạt động", "Chờ duyệt"],
    datasets: [
      {
        data: [activeUsersData.length, inactiveUsersData.length, pendingUsersData.length],
        backgroundColor: ["#3587A4", "#2D898B", "#C1DFF0"],
      },
    ],
  };
  // Dữ liệu cho biểu đồ Doughnut for blogs
  const blogsChartData = {
    labels: [
      "Tin đang hoạt động",
      "Tin không hoạt động",
      "Tin bị từ chối",
      "Tin đang chờ duyệt",
    ],
    datasets: [
      {
        data: [
          activeBlogsData.length,
          inactiveBlogsData.length,
          rejectedBlogsData.length,
          pendingBlogsData.length,
        ],
        backgroundColor: ["#08415C", "#6B818C", "#CC2936", "#F1BF98"],
      },
    ],
  };

  return (
    <>
      <div className="admin-dashboard">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="content">
          <div className="header">
            <Header />
          </div>
          <div className="sub-content">
            {/* Hàng cho quản lý người dùng */}
            <Row gutter={0}>
              <Col span={8}>
                <Card title="Quản lý người dùng" bordered={false}>
                  <Doughnut
                    data={usersChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      width: 200,
                      height: 200,
                      aspectRatio: 1,
                    }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Quản lý Trạng thái người dùng" bordered={false}>
                  <Doughnut
                    data={usersActiveChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      width: 200,
                      height: 200,
                      aspectRatio: 1,
                    }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Quản lý Tin tuyển dụng" bordered={false}>
                  <Doughnut
                    data={blogsChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      width: 300,
                      height: 300,
                      aspectRatio: 1,
                    }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Hàng cho quản lý Tin tuyển dụng */}
            
          </div>
        </div>
      </div>
    </>
  );
}
