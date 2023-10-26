import React, {useEffect, useState} from "react";
import { Menu, Avatar, Typography } from 'antd';
import { DASHBOARD_SIDEBAR_LINKS } from "../candidateComponents/Navigations";
import { Link } from "react-router-dom";

import "../../css/style.css";

import { useAuth } from "../../../../contexts/AuthContext";

import { loadPersonalDetailByUsername } from "../../../../helpers/axios_helper";

const { Text } = Typography;



function Sidebar() {

  const [personalDetail, setPersonalDetail] = useState({
    avatar: "",
    name: "",
    email: "",
    gender: "",
    location: "",
    category: "",
    address: "",
    dayOfBirth: null,
    phoneNumber: "",
    taxCode: "",
    linkWebsite: "",
  });

  const { username } = useAuth();
  useEffect(() => {
    loadPersonalDetailByUsername(username)
      .then((data) => {
        setPersonalDetail(data);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });

    
  }, [username]);


  return (
    <div className="sidebar-container">
      <Menu mode="vertical" theme="dark">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
      <Avatar size={64}  src={`http://localhost:8080/api/files/${personalDetail.avatar}`} alt="Avatar"/>

        <Text style={{ marginTop: '8px', fontWeight: 'bold', color:'white' }}>Hi, {username}!</Text>
      </div>
      {DASHBOARD_SIDEBAR_LINKS.map((item) => (
        <Menu.Item key={item.key} icon={item.icon}>
          <Link to={item.to}>{item.label}</Link>
        </Menu.Item>
      ))}
    </Menu>
    </div>
    
  );
}

export default Sidebar;
