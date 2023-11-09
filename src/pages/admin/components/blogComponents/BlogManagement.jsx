import React, { useState, useEffect } from "react";
import { Table, Button, Space, Modal } from "antd";

import {
  loadPendingBlogs,
  loadUserByUsername,
} from "../../../../helpers/axios_helper";

import { useAuth } from "../../../../contexts/AuthContext";
import SearchComponents from "../SearchComponent";

import ViewBlog from "./ViewBlog";


import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

function BlogsManagement() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState({
    id: "",
    personalDetailId: "",
  });

  const [isEnableModalVisible, setIsEnableModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [selectedBlogEnable, setSelectedBlogEnable] = useState(null);


  const handleViewClick = (record) => {
    // Xử lý logic xem blog
    setSelectedBlogId(record.id);
    setIsViewModalVisible(true);
  };

  const handleEnableClick = (record) => {
    // Xử lý logic kích hoạt blog
    setSelectedBlogId(record.id);
    setIsEnableModalVisible(true);
  };

  const handleEnable = () => {
    console.log("Disable/Enable!");
    setIsEnableModalVisible(false);
  }
  const handleCreateClick = () => {
    setIsCreateModalVisible(true);
    
  }

  const [searchResults, setSearchResults] = useState([]);
  const performSearch = (searchTerm) => {
    const filteredUsers = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredUsers);
  };
  const renderEnableColumn = (enable) => {
    const statusMap = {
      0: { text: "Active", color: "green" },
      1: { text: "Inactive", color: "red" },
      2: { text: "Pending", color: "blue" },
      3: { text: "Rejected", color: "orange" },
    };
    const statusInfo = statusMap[enable] || { text: "Unknown", color: "black" };

    return <span style={{ color: statusInfo.color }}>{statusInfo.text}</span>;
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "rowNumber",
      key: "rowNumber",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Trạng thái",
      dataIndex: "enable",
      key: "enable",
      render: renderEnableColumn,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          
          <Button onClick={() => handleViewClick(record)}>View</Button>
          {record.enable === 0 || record.enable === 1 ? (
            <Button
              onClick={() => handleEnableClick(record)}
              className={
                record.enable === 0 ? "ant-btn-danger" : "ant-btn-primary"
              }
            >
              {record.enable === 1 ? "Enable" : "Disable"}
            </Button>
          ) : null}
        </Space>
      ),
    },
  ];

  const { username } = useAuth();



  useEffect(() => {
    loadUserByUsername(username)
      .then((data) => {
        setUser(data);
        //console.log(user.id);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });

      loadPendingBlogs()
      .then((data) => {
        setBlogs(data);
      })
      .catch((error) => {
        console.error("Error loading loadPendingBlogs:", error);
      });
  }, [username, isCreateModalVisible]);

  return (
    <>
      <ToastContainer />
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SearchComponents onSearch={performSearch} />
        
      </div>
      <hr />
      <div className="App">
        <Table 
         dataSource={searchResults.length > 0 ? searchResults : blogs}
         columns={columns} />
      </div>
      <Modal
        title="Tin Tuyển Dụng"
        visible={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        width={1400}
        footer={[
          <Button key="back" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedBlogId && (
          <ViewBlog selectedBlogId={selectedBlogId}/>

        )}
      </Modal>
      
    
    </>
  );
}

export default BlogsManagement;
