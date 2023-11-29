import React, { useState, useEffect } from "react";
import { Table, Button, Space, Modal, Select, Row, Col, Card } from "antd";
import axios from "axios";
import {
  loadBlogsByUserId,
  loadBlogsByUserIdandStatus,
  loadBlogsSortedByEnable,
  loadUserByUsername,
  request,
} from "../../../../../helpers/axios_helper";

import { useAuth } from "../../../../../contexts/AuthContext";
import SearchComponents from "../SearchComponent";

import ViewBlog from "./ViewBlog";
import EditBlog from "./EditBlog";
import AddBlog from "./AddBlog";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import Icon from "@ant-design/icons/lib/components/Icon";

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
  const [selectedEnable, setSelectedEnable] = useState(null);

  const [activeBlogsData, setActiveBlogsData] = useState([]);
  const [inactiveBlogsData, setInactiveBlogsData] = useState([]);
  const [pendingBlogsData, setPendingBlogsData] = useState([]);
  const [rejectedBlogsData, setRejectedBlogsData] = useState([]);

  const handleDeleteClick = (record) => {
    // Xử lý logic xóa blog
    setSelectedBlogId(record.id);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = () => {
    if (selectedBlogId !== null) {
      console.log(selectedBlogId);

      request("DELETE", `/api/blogs/delete/${selectedBlogId}`)
        .then((response) => {
          console.log("Removed", response);
          toast.success("Xóa tin tuyển dụng thành công!");
        })
        .catch((error) => {
          toast.error("Xóa tin tuyển dụng thất bại!");
          console.error("Error removal blog:", error);
        });

      console.log("Deleted!");
      setIsDeleteModalVisible(false);
    } else {
      console.error("Selected blog id is null.");
    }
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
  };

  const [searchResults, setSearchResults] = useState([]);
  const [showNoResults, setShowNoResults] = useState(false);
  const performSearch = (searchTerm) => {
    const filteredUsers = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredUsers);
  };

  const handleEnableChange = (value) => {
    setSelectedEnable(value);
  };

  const handleFilter = () => {
    if (selectedEnable !== null) {
      const filteredBlogs = blogs.filter(
        (blog) => blog.enable === selectedEnable
      );
      setSearchResults(filteredBlogs);
      setShowNoResults(filteredBlogs.length === 0);
    } else {
      setSearchResults(blogs);
      setShowNoResults(false);
    }
  };

  const renderEnableColumn = (enable) => {
    const statusMap = {
      0: { text: "Đang hoạt động", color: "green" },
      1: { text: "Ngừng hoạt động", color: "red" },
      2: { text: "Chờ duyệt", color: "blue" },
      3: { text: "Từ chối", color: "orange" },
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
      title: "Tên công việc",
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
      title: "Hành động",
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
              className={"ant-btn-primary"}
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

  const { username, userId } = useAuth();

  useEffect(() => {
    loadUserByUsername(username)
      .then((data) => {
        setUser(data);
        //console.log(user.id);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });
  }, [username]);

  useEffect(() => {

    loadBlogsByUserId(userId)
      .then((data) => {
        setBlogs(data.reverse());
      })
      .catch((error) => {
        console.error("Error loading users:", error);
      });

      loadBlogsByUserIdandStatus(userId)
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
  }, []);

  const cardData = [
    {
      status: "Đang hoạt động",
      iconType: "play-circle",
      imageSrc: `http://localhost:8080/api/files/blogsActive.png`,
      data: activeBlogsData.length,
      textColor: "#3587A4",
    },
    {
      status: "Ngừng hoạt động",
      iconType: "pause-circle",
      imageSrc: `http://localhost:8080/api/files/blogsInactive.png`,
      data: inactiveBlogsData.length,
      textColor: "#2D898B",
    },
    {
      status: "Chờ duyệt",
      iconType: "clock-circle",
      imageSrc: `http://localhost:8080/api/files/blogsPending.png`,
      data: pendingBlogsData.length,
      textColor: "#C1DFF0",
    },
    {
      status: "Từ chối",
      iconType: "clock-circle",
      imageSrc: `http://localhost:8080/api/files/blogsRejected.png`,
      data: rejectedBlogsData.length,
      textColor: "#C1DFF0",
    },
  ];

  return (
    <>
      <ToastContainer />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Row gutter={1}>
          {cardData.map((data, index) => (
            <Col span={6} key={index}>
              <Card
                style={{
                  margin: "5px",
                  borderRadius: "5px",
                  border: "1px solid grey",
                  height: "135px",
                  width: "270px",
                }}
              >
                <Row>
                  <Col span={12}>
                    <div style={{ flex: 1 }}>
                      <img
                        src={data.imageSrc}
                        alt={data.status}
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: "center", marginLeft: "10px" }}>
                      <Icon
                        type={data.iconType}
                        style={{ fontSize: "24px", marginRight: "8px" }}
                      />
                      <h3 style={{ display: "inline" }}>{data.status}</h3>
                      <h4>{data.data}</h4>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <div
        style={{
          marginBottom: 10,
          marginTop: 5,
          marginLeft: 5,
          marginRight: 5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SearchComponents
          onSearch={performSearch}
         
        />
        <div>
          <Select
            style={{
              width: 200,
              marginRight: 10,
              border: "0.5px solid grey",
              borderRadius: "5px",
            }}
            placeholder="Lọc người tin tuyển dụng theo trạng thái"
            onChange={handleEnableChange}
          >
            <Select.Option value={null}>Tất cả</Select.Option>
            <Select.Option value={0}>Hoạt động</Select.Option>
            <Select.Option value={1}>Ngừng hoạt động</Select.Option>
            <Select.Option value={2}>Chờ duyệt</Select.Option>
            <Select.Option value={3}>Từ chối</Select.Option>
          </Select>
          <Button type="primary" onClick={handleFilter}>
            Lọc
          </Button>
        </div>
        <Button type="primary" onClick={() => handleCreateClick()}>
          Đăng tin tuyển dụng
          {/* <Link to={"/adminDashboard/users/add-user"}>Add New User</Link> */}
        </Button>
      </div>
      <hr />
      <div className="App">
        <Table
          dataSource={
            showNoResults
              ? []
              : searchResults.length > 0
              ? searchResults
              : blogs
          }
          columns={columns}
          locale={{
            emptyText: showNoResults ? "Không có kết quả" : "Không có dữ liệu",
          }}
        />
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
        {selectedBlogId && <ViewBlog selectedBlogId={selectedBlogId} />}
      </Modal>
      <Modal
        title="Cập nhật tin tuyển dụng"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        width={1200}
        footer={[
          <div
            key="custom-footer"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button key="back" onClick={() => setIsEditModalVisible(false)}>
              Close
            </Button>
            ,
          </div>,
        ]}
      >
        {selectedBlogId && <EditBlog selectedBlogId={selectedBlogId} />}
      </Modal>
      <Modal
        title="Đăng tin tuyển dụng"
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        width={1200}
        footer={[
          <div
            key="custom-footer"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button key="back" onClick={() => setIsCreateModalVisible(false)}>
              Close
            </Button>
            ,
          </div>,
        ]}
      >
        {<AddBlog />}
      </Modal>
      <Modal
        title={selectedBlogEnable === 1 ? "Confirm Disable" : "Confirm Enable"}
        visible={isEnableModalVisible}
        onOk={handleEnable}
        onCancel={() => setIsEnableModalVisible(false)}
      >
        Bạn có chắc rằng muốn{" "}
        {selectedBlogEnable === 1 ? "Kích hoạt" : "Vô hiệu hóa"} tin tuyển dụng này không?
      </Modal>
      <Modal
        title={"Confirm Deleting"}
        visible={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
      >
        Bạn có chắc rằng muốn {"Xóa"} tin tuyển dụng này không?
      </Modal>
    </>
  );
}

export default BlogsManagement;
