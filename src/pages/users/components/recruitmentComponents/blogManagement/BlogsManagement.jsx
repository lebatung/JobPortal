import React, { useState, useEffect } from "react";
import { Table, Button, Space, Modal } from "antd";
import axios from "axios";
import {
  loadBlogsByUserId,
  loadUserByUsername,
} from "../../../../../helpers/axios_helper";

import { useAuth } from "../../../../../contexts/AuthContext";
import SearchComponents from "../SearchComponent";

import ViewBlog from "./ViewBlog";
import EditBlog from "./EditBlog";
import AddBlog from "./AddBlog";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

function BlogsManagement() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState({
    id: "",
    personalDetailId: "",
  });

  const [isEnableModalVisible, setIsEnableModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);


  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [selectedBlogEnable, setSelectedBlogEnable] = useState(null);

  const handleDeleteClick = (record) => {
    // Xử lý logic xóa blog
    setSelectedBlogEnable(record.id);
    setIsDeleteModalVisible(true);

  };

  const handleDelete = () => {
    console.log("Deleted!");
    setIsDeleteModalVisible(false);
  };

  const handleEditClick = (record) => {
    // Xử lý logic chỉnh sửa blog
    setSelectedBlogId(record.id);
    setIsEditModalVisible(true);
  };

  const handleViewClick = (record) => {
    // Xử lý logic xem blog
    setSelectedBlogId(record.id);
    setIsViewModalVisible(true);
  };

  const handleEnableClick = (record) => {
    // Xử lý logic kích hoạt blog
    setSelectedBlogId(record.id);
    setSelectedBlogEnable(record.enable);
    setIsEnableModalVisible(true);
  };

  const handleEnable = () => {
    if (selectedBlogId !== null && selectedBlogId !== null) {
      const blogEnableDTO = {
        id: selectedBlogId,
        enable: selectedBlogEnable === 1 ? 0 : 1,
      };

      //console.log("blogEnableDTO:", blogEnableDTO);

      axios
        .put(`/api/blogs/enable`, blogEnableDTO)
        .then((response) => {
          console.log(
            `${
              selectedBlogEnable === 1 ? "Disabled" : "Enabled"
            } blog with ID ${selectedBlogId}`
          );
          setIsEnableModalVisible(false);
        })
        .catch((error) => {
          console.error("Error disabling/enabling blog:", error);
          setIsEnableModalVisible(false);
        });
    } else {
      console.error(
        "Record is invalid or does not contain an ID or active value."
      );
    }
  };
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
      0: { text: "Enable", color: "green" },
      1: { text: "Disable", color: "red" },
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
          <Button
            className="ant-btn-danger"
            onClick={() => handleDeleteClick(record)}
          >
            Delete
          </Button>
          {record.enable === 0 || record.enable === 1 ? (
            <Button
              onClick={() => handleEditClick(record)}
              className={
                "ant-btn-primary"
              }
            >
              {"Edit"}
            </Button>
          ) : null}
    
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

    loadBlogsByUserId(user.id)
      .then((data) => {
        setBlogs(data);
      })
      .catch((error) => {
        console.error("Error loading users:", error);
      });
  }, [user.id, username, isEnableModalVisible]);

  return (
    <>
      <ToastContainer />
      <div
        style={{
          marginBottom: 10,
          marginTop: 10,
          marginLeft: 5,
          marginRight: 5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          
        }}
      >
        <SearchComponents onSearch={performSearch} />
        <Button type="primary" onClick={() => handleCreateClick()}>
          Đăng tin tuyển dụng
          {/* <Link to={"/adminDashboard/users/add-user"}>Add New User</Link> */}
        </Button>
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
        width={1200}
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
      <Modal
        title="Edit User Detail"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        width={1200}
        footer={[
          <Button key="back" onClick={() => setIsEditModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedBlogId && (
          <EditBlog selectedBlogId={selectedBlogId}/>

        )}
      </Modal>
      <Modal
        title="Create User"
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        width={1200}
        footer={[
          <Button key="back" onClick={() => setIsCreateModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {
          <AddBlog/>

        }
      </Modal>
      <Modal
        title={selectedBlogEnable === 1 ? "Confirm Disable" : "Confirm Enable"}
        visible={isEnableModalVisible}
        onOk={handleEnable}
        onCancel={() => setIsEnableModalVisible(false)}
      >
        Are you sure you want to{" "}
        {selectedBlogEnable === 1 ? "disable" : "enable"} this blog?
      </Modal>
      <Modal
        title={"Confirm Deleting"}
        visible={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
      >
        Are you sure you want to {"delete"} this user's account?
      </Modal>
    </>
  );
}

export default BlogsManagement;
