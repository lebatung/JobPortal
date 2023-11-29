import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Row,
  Col,
  Card,
  Select,
  Descriptions,
  Input,
} from "antd";

import {
  loadPendingBlogs,
  loadUserByUsername,
  loadAllBlogss,
  loadBlogsSortedByEnable,
  request,
} from "../../../../helpers/axios_helper";

import { useAuth } from "../../../../contexts/AuthContext";
import SearchComponents from "../SearchComponent";

import ViewBlog from "./ViewBlog";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import Icon from "@ant-design/icons/lib/components/Icon";
import axios from "axios";

function BlogsManagement() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState({
    id: "",
    personalDetailId: "",
  });

  const [isEnableModalVisible, setIsEnableModalVisible] = useState(false);
  const [isEnableOnlyModalVisible, setIsEnableOnlyModalVisible] =
    useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");

  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedBlogEnable, setSelectedBlogEnable] = useState(null);

  const [activeBlogsData, setActiveBlogsData] = useState([]);
  const [inactiveBlogsData, setInactiveBlogsData] = useState([]);
  const [pendingBlogsData, setPendingBlogsData] = useState([]);
  const [rejectedBlogsData, setRejectedBlogsData] = useState([]);

  const [selectedEnable, setSelectedEnable] = useState(null);

  const handleViewClick = (record) => {
    // Xử lý logic xem blog
    setSelectedBlogId(record.id);
    setIsViewModalVisible(true);
  };

  const handleEnableClick = (record) => {
    setSelectedBlogId(record.id);
    setSelectedBlog(record);
    setSelectedBlogEnable(record.enable);

    if (record.enable === 0) {
      // Nếu blog đang hiển thị và được bấm Disable
      setIsEnableModalVisible(true);
    } else {
      // Nếu blog đang bị ẩn và được bấm Enable
      setIsEnableOnlyModalVisible(true);
    }
  };

  const handleConfirm = () => {
    const formDataMessage = {
      userId: user.id,
      recipientId: selectedBlog.userId,
      conversationName: messageTitle,
      messageContent: messageContent,
    };

    // Gửi tin nhắn
    request(
      "post",
      "http://localhost:8080/api/messages/create",
      formDataMessage
    )
      .then((response) => {
        toast.success("Gửi tin nhắn thành công!");
      })
      .catch((error) => {
        toast.error("Gửi tin nhắn thất bại!");
      });

    // Xử lý enable/disable blog
    const blogEnableDTO = {
      id: selectedBlogId,
      enable: selectedBlogEnable === 1 ? 0 : 1,
    };

    console.log("blogEnableDTO:", blogEnableDTO);

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
  };
  const handleEnableConfirmOnly = () => {
    // Xử lý enable/disable blog
    const blogEnableDTO = {
      id: selectedBlogId,
      enable: selectedBlogEnable === 1 ? 0 : 1,
    };

    console.log("blogEnableDTO:", blogEnableDTO);

    axios
      .put(`/api/blogs/enable`, blogEnableDTO)
      .then((response) => {
        console.log(
          `${
            selectedBlogEnable === 1 ? "Disabled" : "Enabled"
          } blog with ID ${selectedBlogId}`
        );
        setIsEnableOnlyModalVisible(false);
        toast.success("Kích hoạt tin tuyển dụng thành công")
      })
      .catch((error) => {
        console.error("Error disabling/enabling blog:", error);
        setIsEnableModalVisible(false);
      });
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
      0: { text: "Đang hoạt động", color: "#0d64d6" },
      1: { text: "Ngừng hoạt động", color: "#139c00" },
      2: { text: "Chờ duyệt", color: "#ffc90e" },
      3: { text: "Từ chối", color: "#750808" },
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
      title: "Tên công ty",
      dataIndex: "blog.personalDetail.name",
      key: "companyName",
      render: (text, record) => (
        <span>
          {record.personalDetail && record.personalDetail.name
            ? record.personalDetail.name
            : "N/A"}
        </span>
      ),
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
  useEffect(() => {
    loadUserByUsername(username)
      .then((data) => {
        setUser(data);
        //console.log(user.id);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });

    loadAllBlogss()
      .then((data) => {
        // Đảo ngược mảng dữ liệu trước khi đặt vào state
        setBlogs(data.reverse());
      })
      .catch((error) => {
        console.error("Error loading loadPendingBlogs:", error);
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
  }, [username, isCreateModalVisible]);

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
          alignItems: "center",
        }}
      >
        <SearchComponents onSearch={performSearch} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "350px",
          }}
        >
          <div>
            {/* Nội dung của phần tử div con */}
            <Select
              style={{
                width: 200,
                marginRight: 10,
                border: "0.5px solid grey",
                borderRadius: "5px",
              }}
              placeholder="Lọc người dùng theo trạng thái enable"
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
        </div>
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
          <div
            key="custom-footer"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button key="back" onClick={() => setIsViewModalVisible(false)}>
              Close
            </Button>
            ,
          </div>,
        ]}
      >
        {selectedBlogId && <ViewBlog selectedBlogId={selectedBlogId} />}
      </Modal>
      <Modal
        title="Ngừng hoạt động tin tuyển dụng"
        visible={isEnableModalVisible}
        onCancel={() => setIsEnableModalVisible(false)}
        footer={[
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button key="back" onClick={() => setIsEnableModalVisible(false)}>
              Đóng
            </Button>
            <div>
              <Button key="confirm" type="primary" onClick={handleConfirm}>
                Xác nhận
              </Button>
            </div>
          </div>,
        ]}
      >
        <>
          <Descriptions title="Message" column={1}>
            <Descriptions.Item
              label="Tiêu đề"
              labelStyle={{ color: "black" }}
              labelCol={{ span: 8 }}
            >
              <Input
                placeholder="Message Title"
                value={messageTitle}
                onChange={(e) => setMessageTitle(e.target.value)}
              />
            </Descriptions.Item>
            <Descriptions.Item
              label="Nội dung"
              labelStyle={{ color: "black" }}
              labelCol={{ span: 8 }}
            >
              <Input.TextArea
                placeholder="Message Content"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
              />
            </Descriptions.Item>
          </Descriptions>
        </>
      </Modal>
      <Modal
        title="Kích hoạt tin tuyển dụng"
        visible={isEnableOnlyModalVisible}
        onCancel={() => setIsEnableOnlyModalVisible(false)}
        footer={[
          <div
            key="custom-footer"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              key="back"
              onClick={() => setIsEnableOnlyModalVisible(false)}
            >
              Đóng
            </Button> 
            <div  onClick={handleEnableConfirmOnly} style={{marginLeft: 16}}>
              <Button
              key="confirm"
              type="primary"
             
            >
              Xác nhận
            </Button>
            </div>
            
            ,
          </div>,
        ]}
      >
        Bạn có muốn kích hoạt tin tuyển dụng này hoạt động trở lại không?
      </Modal>
    </>
  );
}

export default BlogsManagement;
