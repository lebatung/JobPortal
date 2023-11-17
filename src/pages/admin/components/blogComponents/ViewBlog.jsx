import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Typography, Card, Row, Col, Image, Button, Modal } from "antd";
import {
  EnvironmentOutlined,
  CrownOutlined,
  PhoneOutlined,
  GlobalOutlined,
  IdcardOutlined,
  TeamOutlined,
  MenuOutlined,
  ScheduleOutlined,
  AuditOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../../contexts/AuthContext";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  request,
  loadPersonalDetail,
  loadBlogById,
} from "../../../../helpers/axios_helper";

const { Header, Content, Sider } = Layout;
const { Title, Paragraph } = Typography;

export default function ViewBlog(props) {
  const selectedBlogId = props.selectedBlogId;
  const { username } = useAuth();

  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);

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
    userRoleDTOList: "",
  });
  const [blog, setBlog] = useState({
    image: "none.jpg",
    title: "",
    detail: "",
    deadLine: "",
    salaryMin: "",
    salaryMax: "",
    workingTime: "",
    quantity: "",
    position: "",
    exp: "",
    gender: "",
    location: "",
    category: "",
    userId: "",
    enable: "",
  });

  useEffect(() => {
    loadBlogById(selectedBlogId)
      .then((data) => {
        setBlog(data);
      })
      .catch((error) => {
        console.error("Error loading users:", error);
      });

    loadPersonalDetail(blog.userId)
      .then((data) => {
        setPersonalDetail(data);
        //console.log(user.id);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });
  }, [
    selectedBlogId,
    blog.userId,
    isApproveModalVisible,
    isRejectModalVisible,
  ]);

  const paragraphStyleHeading = {
    fontSize: "20px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
  };

  const handleApproveClick = () => {
    setIsApproveModalVisible(true);
  };

  const onApproved = () => {
    const blogEnableDTO = {
      id: selectedBlogId,
      enable: 0,
    };

    console.log("UserUpdateDTO:", blogEnableDTO);

    axios
      .put(`/api/blogs/enable`, blogEnableDTO)
      .then((response) => {
        toast.success("Đã duyệt tin tuyển dụng thành công");
        setIsApproveModalVisible(false);
      })
      .catch((error) => {
        console.error("Duyệt tin thất bại:", error);
        console.error("Error approve blog:", error);
      });
  };
  const handleRejectClick = () => {
    setIsRejectModalVisible(true);
  };

  const onRejected = () => {
    const blogEnableDTO = {
      id: selectedBlogId,
      enable: 3,
    };

    console.log("UserUpdateDTO:", blogEnableDTO);

    axios
      .put(`/api/blogs/enable`, blogEnableDTO)
      .then((response) => {
        toast.success("Đã từ chối tin tuyển dụng");
        setIsRejectModalVisible(false);
      })
      .catch((error) => {
        console.error("Duyệt tin thất bại:", error);
        console.error("Error approve blog:", error);
      });
  };

  const headingStyle = {
    fontWeight: "Bold",
    fontSize: "20px",
    color: "#002347",
  };
  return (
    <>
    
      <Layout style={{ padding: "0px" }}>
        <Content>
          <Row align="stretch">
            <Col span={4}>
              <Card
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    width: "auto",
                    height: "auto",
                  }}
                  width={100}
                  height={100}
                  src={`http://localhost:8080/api/files/${personalDetail.avatar}`}
                  alt="Avatar"
                />
              </Card>
            </Col>
            <Col span={20}>
              <Card>
                <Paragraph>
                  <strong style={headingStyle}>{blog.title}</strong>
                </Paragraph>
                <Paragraph>
                  <strong style={{ color: "#001253", marginRight: 6 }}>
                    Công ty:
                  </strong>{" "}
                  {personalDetail.name}
                </Paragraph>
                <Paragraph>
                  <strong style={{ color: "#001253", marginRight: 6 }}>
                    Địa chỉ:
                  </strong>{" "}
                  {personalDetail.address}
                </Paragraph>
                <Paragraph>
                  <strong style={{ color: "#001253", marginRight: 6 }}>
                    Mức lương:{" "}
                  </strong>
                  {blog.salaryMin} - {blog.salaryMax} Triệu đồng |{" "}
                  <strong style={{ color: "#001253", marginRight: 6 }}>
                    Hạn nộp hồ sơ:
                  </strong>{" "}
                  {blog.deadLine}
                </Paragraph>
              </Card>
            </Col>
          </Row>
          <div style={{ margin: "0px 0" }}></div>
          <Row align="stretch">
            <Col gutter={16} span={16}>
              <Card title={<span style={{ color: "#002347" }}>Yêu cầu chung</span>}>
                <Row gutter={-8}>
                  <Col span={12}>
                    <Paragraph>
                      <CrownOutlined style={{ marginRight: 4 }} />
                      <strong style={{ color: "#001253", marginRight: 6 }}>
                        Kinh Nghiệm:
                      </strong>{" "}
                      {blog.exp ? (
                        <span>{blog.exp} năm kinh nghiệm</span>
                      ) : (
                        <span>Không yêu cầu kinh nghiệm</span>
                      )}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph>
                      <IdcardOutlined style={{ marginRight: 4 }} />
                      <strong style={{ color: "#001253", marginRight: 6 }}>
                        Trình độ chuyên môn:
                      </strong>
                      {blog.education}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph>
                      <MenuOutlined style={{ marginRight: 4 }} />
                      <strong style={{ color: "#001253", marginRight: 6 }}>
                        Ngành, nghề:
                      </strong>{" "}
                      {blog.category.name}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph>
                      <AuditOutlined style={{ marginRight: 4 }} />
                      <strong style={{ color: "#001253", marginRight: 6 }}>
                        Chức vụ:
                      </strong>
                      {blog.position}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph>
                      <TeamOutlined style={{ marginRight: 4 }} />
                      <strong style={{ color: "#001253", marginRight: 6 }}>
                        Số lượng:
                      </strong>{" "}
                      {blog.quantity}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph>
                      <DeploymentUnitOutlined style={{ marginRight: 4 }} />
                      <strong style={{ color: "#001253", marginRight: 6 }}>
                        Giới tính:
                      </strong>{" "}
                      {blog.gender}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph>
                      <ScheduleOutlined style={{ marginRight: 4 }} />
                      <strong style={{ color: "#001253", marginRight: 6 }}>
                        Thời gian làm việc:
                      </strong>{" "}
                      {blog.workingTime}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph>
                      <EnvironmentOutlined style={{ marginRight: 4 }} />
                      <strong style={{ color: "#001253", marginRight: 6 }}>
                        Địa điểm làm việc:
                      </strong>{" "}
                      {blog.location.name}
                    </Paragraph>
                  </Col>
                </Row>
              </Card>
              <Card title={
                  <span style={{ color: "#002347" }}>Mô tả công việc</span>
                }>
                <div dangerouslySetInnerHTML={{ __html: blog.detail }} />
              </Card>
            </Col>
            <Col span={8}>
              <Row gutter={24}>
                <Col span={24}>
                  <Card>
                    <Paragraph style={paragraphStyleHeading}>
                      <span style={{ color: "#002347" }}>
                        Thông tin công ty
                      </span>
                    </Paragraph>
                    <Paragraph>
                      <MenuOutlined
                        style={{ color: "#001253", marginRight: 6 }}
                      />
                      
                      {personalDetail.category.name}
                    </Paragraph>
                    <Paragraph>
                      <EnvironmentOutlined  style={{ color: "#001253", marginRight: 6 }} />
                      {personalDetail.address}
                    </Paragraph>
                    <Paragraph>
                      <PhoneOutlined  style={{ color: "#001253", marginRight: 6 }} />
                      {personalDetail.phoneNumber}
                    </Paragraph>
                    <Paragraph>
                      <GlobalOutlined  style={{ color: "#001253", marginRight: 6 }} />
                      <a>{personalDetail.linkWebsite} </a>
                    </Paragraph>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Content>
      </Layout>
      <div style={{ marginTop: 16 }}>
        <Button
          type="primary"
          onClick={() => handleApproveClick()}
          style={{ marginRight: 16 }}
        >
          Approve
        </Button>
        <Button className="ant-btn-danger" onClick={() => handleRejectClick()}>
          Reject
        </Button>
      </div>
      <Modal
        visible={isApproveModalVisible}
        onOk={onApproved}
        onCancel={() => setIsApproveModalVisible(false)}
      >
        Are you sure you want to {"Approved"} this blog?
      </Modal>
      <Modal
        visible={isRejectModalVisible}
        onOk={onRejected}
        onCancel={() => setIsRejectModalVisible(false)}
      >
        Are you sure you want to {"Rejected"} this blog?
      </Modal>
    </>
  );
}
