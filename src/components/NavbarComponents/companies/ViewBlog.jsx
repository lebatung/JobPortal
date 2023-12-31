import React, { useState, useEffect } from "react";

import {
  Layout,
  Typography,
  Card,
  Row,
  Col,
  Image,
  Button,
  Modal,
  Descriptions,
  Input,
} from "antd";
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
  BarcodeOutlined,
  MailFilled,
  ArrowRightOutlined,
  HeartOutlined,
  MessageOutlined,
  MoneyCollectOutlined,
  FieldTimeOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { useAuth } from "../../../contexts/AuthContext";

import SendMessage from "./SendMessage";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Apply from "./Apply";

import {
  request,
  loadPersonalDetailByUsername,
  loadFavoriteBlogsByPersonalDetailId,
  loadBlogById,
  loadRelatedBlogs,
  loadUserByUsername,
  loadUser,
} from "../../../helpers/axios_helper";
import styled from "styled-components";

const { Header, Content, Sider } = Layout;
const { Title, Paragraph } = Typography;

export default function ViewBlog(props) {
  //console.log(props);
  const { isAuthenticated, username } = useAuth();

  const handleViewClick = props.handleViewClick;
  const selectedBlogId = props.selectedBlogId;

  const [loading, setLoading] = useState();

  const companyDetail = props.companyDetail;
  const handleFavoriteClick = props.handleFavoriteClick;
  const handleUnFavoriteClick = props.handleUnFavoriteClick;
  const favoriteBlogsList = props.favoriteBlogsList;

  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");

  const [isApplyModalVisible, setIsApplyModalVisible] = useState(false);
  const [isSendMessageModalVisible, setIsSendMessageModalVisible] =
    useState(false);
  const [user, setUser] = useState({
    id: "",
  });
  const [appliedBlogId, setAppliedBlogId] = useState("");

  function formatDateString(originalDate) {
    const parts = originalDate.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  const [relatedBlogs, setRelatedBlogs] = useState([]);
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
    loadPersonalDetailByUsername(username)
      .then((data) => {
        setPersonalDetail(data);
        //console.log(user.id);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });

    loadBlogById(selectedBlogId)
      .then((data) => {
        setBlog(data);
      })
      .catch((error) => {
        console.error("Error loading users:", error);
      });
    loadRelatedBlogs(companyDetail.category.id)
      .then((data) => {
        setRelatedBlogs(data);
      })
      .catch((error) => {
        console.error("Error loading users:", error);
      });
    loadUserByUsername(username)
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });
  }, [selectedBlogId, username, user.id]);

  const headingStyle = {
    fontWeight: "Bold",
    fontSize: "20px",
    color: "#002347",
  };
  const paragraphStyleHeading = {
    fontSize: "20px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    textAlign: "left",
  };

  const paragraphTitle = {
    color: "#001253",
    marginRight: 6,
  };

  const appliedButton = {
    marginBottom: "10px",
    backgroundColor: "#ff914d",
    color: "#fff",
    fontSize: "16px",
    padding: "0px 20px",
  };
  const favoriteButton = {
    marginBottom: "10px",
    fontSize: "16px",
    padding: "0px 33px",
  };
  const sendMessageButton = {
    marginBottom: "10px",
    fontSize: "16px",
    padding: "0px 27px",
  };

  const HoverableCard = styled(Card)`
    flex: 1;
    transition: background-color 0.3s;
    cursor: pointer;
    margin-bottom: 8px;
    &:hover {
      background-color: #f0f0f0;
    }
  `;

  const handleApplyClick = (blogId) => {
    if (isAuthenticated) {
      setAppliedBlogId(blogId);
      setIsApplyModalVisible(true);
      //console.log(blogId);
    } else {
      toast.error("Bạn cần đăng nhập để sử dụng chức năng này!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };
  const handleSendMessage = () => {
    if (isAuthenticated) {
      setIsSendMessageModalVisible(true);
    } else {
      toast.error("Bạn cần đăng nhập để sử dụng chức năng này!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const handleConfirm = () => {
    // console.log("selectedApplyId", selectedApplyId);
    // console.log("selectedOption",selectedOption);
    // console.log("messageTitle",messageTitle);
    // console.log("messageContent",messageContent);
    // Tạo form data chứa selectedApplyId và selectedOption

    const formDataMessage = {
      userId: user.id,
      recipientId: blog.userId,
      conversationName: messageTitle,
      messageContent: messageContent,
    };
    console.log(formDataMessage);

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
  };

  const handleClickRelatedBlog = (relatedBlogId) => {
    // setSelectedBlogId(relatedBlogId);
    // console.log(selectedBlogId);
    handleViewClick(relatedBlogId);
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
                  src={`http://localhost:8080/api/files/${companyDetail.avatar}`}
                  alt="Avatar"
                />
              </Card>
            </Col>
            <Col span={20}>
              <Card>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "3fr 1fr", // Chia thành 2 cột có độ rộng bằng nhau
                    gridGap: "10px",
                  }}
                >
                  <div>
                    <Paragraph style={headingStyle}>
                      <strong>{blog.title}</strong>
                    </Paragraph>
                    <Paragraph>
                      <strong style={{ color: "#001253", marginRight: 6 }}>
                        Công ty:
                      </strong>{" "}
                      {companyDetail.name}
                    </Paragraph>
                    <Paragraph>
                      <strong style={{ color: "#001253", marginRight: 6 }}>
                        Địa chỉ:
                      </strong>{" "}
                      {companyDetail.address}
                    </Paragraph>
                    <Paragraph>
                      <strong style={{ color: "#001253", marginRight: 6 }}>
                        Mức lương:{" "}
                      </strong>
                      {blog.salaryMin} - {blog.salaryMax} Triệu đồng |{" "}
                      <strong style={{ color: "#001253", marginRight: 6 }}>
                        Hạn nộp hồ sơ:
                      </strong>{" "}
                      {formatDateString(blog.deadLine)}
                    </Paragraph>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      padding: "10px",
                    }}
                  >
                    <Button
                      size="large"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyClick(blog.id);
                      }}
                      style={appliedButton}
                    >
                      <ArrowRightOutlined />
                      Ứng tuyển
                    </Button>
                    {favoriteBlogsList.some(
                      (favorite) => favorite.blogId === blog.id
                    ) ? (
                      <Button
                        onClick={(e) => {
                          const favoriteItem = favoriteBlogsList.find(
                            (fav) => fav.blogId === blog.id
                          );
                          if (favoriteItem) {
                            const favoriteId = favoriteItem.id;
                            handleUnFavoriteClick(favoriteId);
                          }
                        }}
                        size="large"
                        style={{
                          color: "#ff1800",
                          marginBottom: "10px",
                          fontSize: "16px",
                          padding: "0px 23px",
                        }}
                      >
                        <HeartFilled />
                        Đã lưu tin
                      </Button>
                    ) : (
                      <Button
                        onClick={(e) => {
                          handleFavoriteClick(blog.id);
                        }}
                        size="large"
                        style={{
                          marginBottom: "10px",
                          fontSize: "16px",
                          padding: "0px 33px",
                        }}
                      >
                        <HeartOutlined />
                        Lưu tin
                      </Button>
                    )}
                    <Button
                      size="large"
                      style={sendMessageButton}
                      onClick={(e) => {
                        handleSendMessage();
                      }}
                    >
                      <MessageOutlined />
                      Nhắn tin
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          <div style={{ margin: "0px 0" }}></div>
          <Row align="stretch">
            <Col gutter={16} span={16}>
              <Card
                title={<span style={{ color: "#002347" }}>Yêu cầu chung</span>}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Paragraph>
                      <CrownOutlined style={paragraphTitle} />
                      <strong style={paragraphTitle}>Kinh Nghiệm:</strong>{" "}
                      {parseInt(blog.exp) === 0
                        ? "Không yêu cầu kinh nghiệm"
                        : `${blog.exp} năm kinh nghiệm`}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph>
                      <IdcardOutlined style={paragraphTitle} />
                      <strong style={paragraphTitle}>
                        Trình độ chuyên môn:
                      </strong>
                      {blog.education}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph>
                      <MenuOutlined style={paragraphTitle} />
                      <strong style={paragraphTitle}>Ngành, nghề:</strong>{" "}
                      {blog.category.name}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph>
                      <AuditOutlined style={paragraphTitle} />
                      <strong style={paragraphTitle}>Chức vụ:</strong>
                      {blog.position}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph>
                      <TeamOutlined style={paragraphTitle} />
                      <strong style={paragraphTitle}>Số lượng:</strong>{" "}
                      {blog.quantity}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph>
                      <DeploymentUnitOutlined style={paragraphTitle} />
                      <strong style={paragraphTitle}>Giới tính:</strong>{" "}
                      {blog.gender}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph>
                      <ScheduleOutlined style={paragraphTitle} />
                      <strong style={paragraphTitle}>
                        Thời gian làm việc:
                      </strong>{" "}
                      {blog.workingTime}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph>
                      <EnvironmentOutlined style={paragraphTitle} />
                      <strong style={paragraphTitle}>
                        Địa điểm làm việc:
                      </strong>{" "}
                      {blog.location.name}
                    </Paragraph>
                  </Col>
                </Row>
              </Card>
              <Card
                title={
                  <span style={{ color: "#002347" }}>Mô tả công việc</span>
                }
              >
                <Paragraph>
                <div dangerouslySetInnerHTML={{ __html: blog.detail }} />
                </Paragraph>
              </Card>
              <Card
                title={
                  <span style={{ color: "#002347" }}>
                    Yêu cầu hồ sơ ứng tuyển
                  </span>
                }
              >
                <Paragraph>- Sơ yếu lí lịch (CV)</Paragraph>
                <Paragraph>- Các bằng cấp liên quan</Paragraph>
              </Card>
            </Col>
            <Col span={8}>
              <Row gutter={24}>
                <Col span={24}>
                  <Card style={{ alignItems: "left" }}>
                    <Paragraph style={paragraphStyleHeading}>
                      <span style={{ color: "#002347" }}>
                        Thông tin công ty
                      </span>
                    </Paragraph>
                    <Paragraph>
                      <MenuOutlined
                        style={{ color: "#001253", marginRight: 6 }}
                      />
                      <strong style={{ color: "#001253", marginRight: 6 }}>
                        Nhóm ngành, nghề:
                      </strong>{" "}
                      {companyDetail.category.name}
                    </Paragraph>
                    <Paragraph>
                      <EnvironmentOutlined
                        style={{ color: "#001253", marginRight: 6 }}
                      />
                      <strong style={{ color: "#001253", marginRight: 6 }}>
                        Địa điểm:
                      </strong>{" "}
                      {companyDetail.location.name}
                    </Paragraph>
                    <Paragraph>
                      <BarcodeOutlined
                        style={{ color: "#001253", marginRight: 6 }}
                      />
                      <strong style={{ color: "#001253", marginRight: 6 }}>
                        Mã số thuế:
                      </strong>{" "}
                      {companyDetail.taxCode}
                    </Paragraph>
                  </Card>
                </Col>
                <Col span={24}>
                  <Card>
                    <Paragraph style={paragraphStyleHeading}>
                      <span style={{ color: "#002347" }}>
                        Thông tin liên hệ
                      </span>
                    </Paragraph>
                    <strong style={{ color: "#001253", marginRight: 6 }}>
                      Địa chỉ:
                    </strong>{" "}
                    <Paragraph>
                      <EnvironmentOutlined
                        style={{ color: "#001253", marginRight: 6 }}
                      />
                      {companyDetail.address}
                    </Paragraph>
                    <strong style={{ color: "#001253", marginRight: 6 }}>
                      Website:
                    </strong>{" "}
                    <Paragraph>
                      <GlobalOutlined
                        style={{ color: "#001253", marginRight: 6 }}
                      />
                      <a>
                        {" "}
                        {companyDetail.linkWebsite ? (
                          <span>{companyDetail.linkWebsite}</span>
                        ) : (
                          <span>Chưa cập nhật</span>
                        )}
                      </a>
                    </Paragraph>
                    <strong style={{ color: "#001253", marginRight: 6 }}>
                      Số điện thoại liên hệ:
                    </strong>{" "}
                    <Paragraph>
                      <PhoneOutlined
                        style={{ color: "#001253", marginRight: 6 }}
                      />
                      <a>{companyDetail.phoneNumber}</a>
                    </Paragraph>
                    <strong style={{ color: "#001253", marginRight: 6 }}>
                      Email:
                    </strong>{" "}
                    <Paragraph>
                      <MailFilled
                        style={{ color: "#001253", marginRight: 6 }}
                      />
                      <a>
                        {" "}
                        {companyDetail.email ? (
                          <span>{companyDetail.email}</span>
                        ) : (
                          <span>Chưa cập nhật</span>
                        )}
                      </a>
                    </Paragraph>
                  </Card>
                </Col>
                <Col span={24}>
                  <Card>
                    {" "}
                    <Paragraph style={paragraphStyleHeading}>
                      <span style={{ color: "#002347" }}>
                        Công việc tương tự
                      </span>
                    </Paragraph>
                    <Row align="stretch" style={{ marginTop: "12px" }}>
                      {relatedBlogs.map((relatedBlog) => (
                        <Col gutter={16} span={24} key={relatedBlog.id}>
                          <HoverableCard
                            title={
                              <span style={{ color: "#003366" }}>
                                {relatedBlog.title}
                              </span>
                            }
                            onClick={() =>
                              handleClickRelatedBlog(relatedBlog.id)
                            }
                          >
                            <Row gutter={16}>
                              <Col span={12}>
                                <div>
                                  <MoneyCollectOutlined
                                    style={{
                                      color: "#E14D2A",
                                      marginRight: "4",
                                    }}
                                  />{" "}
                                  {relatedBlog.salaryMin} -{" "}
                                  {relatedBlog.salaryMax} Triệu đồng
                                </div>
                              </Col>

                              <Col span={12}>
                                <div>
                                  <EnvironmentOutlined
                                    style={{
                                      color: "#E14D2A",
                                      marginRight: "4",
                                    }}
                                  />{" "}
                                  {relatedBlog.location.name}
                                </div>
                              </Col>
                            </Row>
                          </HoverableCard>
                        </Col>
                      ))}
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Content>
      </Layout>
      <Modal
        title="Ứng tuyển công việc"
        style={{ color: "#ff914d", fontSize: "20px" }}
        visible={isApplyModalVisible}
        onCancel={() => setIsApplyModalVisible(false)}
        footer={[
          <div
            key="custom-footer"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button key="back" onClick={() => setIsApplyModalVisible(false)}>
              Đóng
            </Button>
            ,
          </div>,
        ]}
      >
        {selectedBlogId && <Apply appliedBlogId={appliedBlogId} />}
      </Modal>
      <Modal
        title="Gửi tin nhắn"
        visible={isSendMessageModalVisible}
        onCancel={() => setIsSendMessageModalVisible(false)}
        footer={[
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              key="back"
              onClick={() => setIsSendMessageModalVisible(false)}
            >
              Close
            </Button>
            <div>
              <Button key="confirm" type="primary" onClick={handleConfirm}>
                Confirm
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
    </>
  );
}
