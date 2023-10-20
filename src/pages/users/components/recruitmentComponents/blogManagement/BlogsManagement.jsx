import React, { useState, useEffect } from "react";
import { Table, Button, Space, Modal } from "antd";

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
          <Button type="primary" onClick={() => handleEditClick(record)}>
            Edit
          </Button>

          <Button
            className="ant-btn-danger"
            onClick={() => handleDeleteClick(record)}
          >
            Delete
          </Button>

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

    loadBlogsByUserId(user.id)
      .then((data) => {
        setBlogs(data);
      })
      .catch((error) => {
        console.error("Error loading users:", error);
      });
  }, [user.id, username]);

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
        <Button type="primary" onClick={() => handleCreateClick()}>
          Thêm tin tuyển dụng
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
        {selectedBlogEnable === 1 ? "disable" : "enable"} this user's account?
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