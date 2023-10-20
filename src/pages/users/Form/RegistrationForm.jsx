import React, { useState } from "react";

import CandidateRegistrationForm from "./CandidateRegistrationForm";
import RecruitmentRegistrationForm from "./RecruitmentRegistrationForm";
import {
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import { Tabs } from "antd";
import { Link } from "react-router-dom";

const { TabPane } = Tabs;


const RegistrationForm = () => {
  
  const [activeTab, setActiveTab] = useState("1");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const pDiv = {
    textAlign: "center",
    fontSize: "17px",
  };


  return (
    <Tabs activeKey={activeTab} onChange={handleTabChange}>
      <TabPane
        tab={
          <span>
            <UserOutlined />
            Đăng ký dành cho ứng viên
          </span>
        }
        key="1"
      >
        {/* Nội dung của Tab 1 */}
        <div>
          <CandidateRegistrationForm/>
          <p style={pDiv}>
            Đã có tài khoản?{" "}
            <Link to="/login" href="/">
              Đăng nhập
            </Link>
          </p>
        </div>
      </TabPane>

      <TabPane
        tab={
          <span>
            <TeamOutlined />
            Đăng ký dành cho nhà tuyển dụng
          </span>
        }
        key="2"
      >
        {/* Register for recruitment */}
        <div>
          <RecruitmentRegistrationForm/>
          <p style={pDiv}>
            Đã có tài khoản?{" "}
            <Link to="/login" href="/">
              Đăng nhập
            </Link>
          </p>
        </div>
      </TabPane>
    </Tabs>
  );
};

export default RegistrationForm;
