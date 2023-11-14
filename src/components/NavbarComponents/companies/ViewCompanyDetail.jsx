import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Descriptions,
  Typography,
  Space,
  Col,
  Row,
  Layout,
  Image,
  Button,
  Modal,
  Input,
} from "antd";
import {
  request,
  loadCompanyNBlogs,
  loadPersonalDetailByUsername,
  loadFavoriteBlogsByPersonalDetailId,
  loadUserByUsername,
} from "../../../helpers/axios_helper";
import {
  ArrowRightOutlined,
  BarcodeOutlined,
  EnvironmentOutlined,
  FieldTimeOutlined,
  GlobalOutlined,
  HeartFilled,
  HeartOutlined,
  LoadingOutlined,
  MailFilled,
  MailOutlined,
  MenuOutlined,
  MessageOutlined,
  MoneyCollectOutlined,
  PhoneOutlined,
  SendOutlined,
  WalletOutlined,
} from "@ant-design/icons";

import { useAuth } from "../../../contexts/AuthContext";

import ViewBlog from "./ViewBlog";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Header, Content, Sider } = Layout;
const { Title, Paragraph } = Typography;

export default function ViewCompanyDetail() {
  const [companyDetail, setCompanyDetail] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState({
    id: "",
  });
  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [floading, setFloading] = useState(false);

  const [personalDetailId, setPersonalDetailId] = useState("");
  const [favoriteBlogsList, setFavoriteBlogsList] = useState([]);

  const { isAuthenticated, username } = useAuth();

  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isSendMessageModalVisible, setIsSendMessageModalVisible] =
    useState(false);

  function formatDateString(originalDate) {
    const parts = originalDate.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  const loadFavoriteBlogs = () => {
    loadFavoriteBlogsByPersonalDetailId(personalDetailId)
      .then((data) => {
        setFavoriteBlogsList(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error loading favoriteBlogsList:", error);
      });
  };

  const { slug } = useParams();

  useEffect(() => {
    loadCompanyNBlogs(slug)
      .then((data) => {
        setCompanyDetail(data);
        setBlogs(data.blogs);
        console.log(data);
        console.log(data.blogs);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading loadCompanyNBlogs:", error);
      });
    if (username) {
      loadPersonalDetailByUsername(username)
        .then((data) => {
          setPersonalDetailId(data.id);
          console.log(data.id);
        })
        .catch((error) => {
          console.error("Error loading loadPersonalDetailByUsername:", error);
        });
    }
    loadUserByUsername(username)
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });
  }, [username, user.id]);

  useEffect(() => {
    console.log("personaldetailID", personalDetailId);
    if (personalDetailId) {
      loadFavoriteBlogsByPersonalDetailId(personalDetailId)
        .then((data) => {
          setFavoriteBlogsList(data);
          //console.log(data);
        })
        .catch((error) => {
          console.error(
            "Error loading loadFavoriteBlogsByPersonalDetailId:",
            error
          );
        });
    }
  }, [personalDetailId]);

  const Container = {
    margin: "0 auto",
    backgroundColor: "#ffffff",
  };

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

  const companyDetailContainer = {
    textAlign: "left",
  };

  const containerWrapper = {
    backgroundColor: "#f5f5f5f5",
    width: "80%",
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
  margin: 8px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #f0f0f0;
    border: 1px solid #ff6f4e;
  }
`;

  // Storing Interaction between user_id and blog_id
  const { userId } = useAuth();
  const saveUserInteraction = async (blogId) => {
    try {
      if (isAuthenticated) {
        const interactionData = {
          userId: userId,
          blogId: blogId,
          interactionType: "CLICK",
        };

        const response = await request(
          "POST",
          "/api/user-interactions/create",
          interactionData
        );
        console.log(response.data);
        console.log("CLICK INTERACTION", interactionData);
      } else {
        console.log("User is not authenticated. Please log in.");
      }
    } catch (error) {
      console.error("Error saving user interaction:", error);
    }
  };

  const saveUserInteractionFav = async (blogId) => {
    try {
      if (isAuthenticated) {
        const interactionData = {
          userId: userId,
          blogId: blogId,
          interactionType: "FAVORITE",
        };

        const response = await request(
          "POST",
          "/api/user-interactions/create",
          interactionData
        );
        console.log(response.data);
        console.log("FAVORITE INTERACTION", interactionData);
      } else {
        console.log("User is not authenticated. Please log in.");
      }
    } catch (error) {
      console.error("Error saving user interaction:", error);
    }
  };

  const handleViewClick = (blogId) => {
    if (floading) {
      return;
    }
    setSelectedBlogId(blogId);
    //console.log(selectedBlogId);

    saveUserInteraction(blogId);

    setIsViewModalVisible(true);
  };
  const handleConfirm = () => {
    // console.log("selectedApplyId", selectedApplyId);
    // console.log("selectedOption",selectedOption);
    // console.log("messageTitle",messageTitle);
    // console.log("messageContent",messageContent);
    // Tạo form data chứa selectedApplyId và selectedOption

    const formDataMessage = {
      userId: user.id,
      recipientId: blogs[0].userId,
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

  const handleUnFavoriteClick = (favoriteId) => {
    request("DELETE", `http://localhost:8080/api/favorites/${favoriteId}`)
      .then((response) => {
        console.log("Removed", favoriteId);
        loadFavoriteBlogs();
      })
      .catch((error) => {
        console.error("Error removal favorite:", error);
      });
  };

  const handleFavoriteClick = (blogId) => {
    if (isAuthenticated) {
      const dto = {
        personalDetailId: personalDetailId,
        blogId,
      };
      setFloading(true);
      request("POST", "http://localhost:8080/api/favorites/create", dto)
        .then((response) => {
          loadFavoriteBlogs();
          setFloading(false);
        })
        .catch((error) => {
          console.log("Error setFavoriteBlogsList on Catch");
        });

      saveUserInteractionFav(blogId);
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

  return (
    <>
      {" "}
      <ToastContainer />
      <div style={containerWrapper}>
        <div style={Container}>
          <div style={companyDetailContainer}>
            {loading ? (
              <LoadingOutlined />
            ) : (
              <Layout style={{ padding: "0px" }}>
                <Content>
                  <Row align="stretch" gutter={[12, 2]}>
                    <Col span={18} gutter={16}>
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
                                  {companyDetail.name}
                                </Paragraph>

                                <Paragraph>
                                  <EnvironmentOutlined
                                    style={{ color: "#001253", marginRight: 6 }}
                                  />
                                  <strong
                                    style={{ color: "#001253", marginRight: 6 }}
                                  >
                                    Địa chỉ:
                                  </strong>{" "}
                                  {companyDetail.address}
                                </Paragraph>
                                <Paragraph>
                                  <WalletOutlined
                                    style={{ color: "#001253", marginRight: 6 }}
                                  />
                                  <strong
                                    style={{ color: "#001253", marginRight: 6 }}
                                  >
                                    Tin tuyển dụng:
                                  </strong>
                                  {companyDetail.blogs.length}
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

                      <Card
                        title="Công việc đang tuyển dụng"
                        style={{ marginTop: "12px" }}
                      >
                        <Row align="stretch" style={{ marginTop: "12px" }}>
                          {companyDetail.blogs.map((blog) => (
                            <Col gutter={16} span={24} key={blog.id}>
                              <HoverableCard
                                title={
                                  <span style={{ color: "#003366" }}>
                                    {blog.title}
                                  </span>
                                }
                                onClick={() => handleViewClick(blog.id)}
                              >
                                <Row gutter={16}>
                                  <Col span={8}>
                                    <div>
                                      <MoneyCollectOutlined
                                        style={{
                                          color: "#E14D2A",
                                          marginRight: "4",
                                        }}
                                      />{" "}
                                      {blog.salaryMin} - {blog.salaryMax} Triệu
                                      đồng
                                    </div>
                                  </Col>
                                  <Col span={8}>
                                    <div>
                                      <FieldTimeOutlined
                                        style={{
                                          color: "#E14D2A",
                                          marginRight: "4",
                                        }}
                                      />{" "}
                                      {formatDateString(blog.deadLine)}
                                    </div>
                                  </Col>
                                  <Col span={8}>
                                    <div>
                                      <EnvironmentOutlined
                                        style={{
                                          color: "#E14D2A",
                                          marginRight: "4",
                                        }}
                                      />{" "}
                                      {blog.location.name}
                                    </div>
                                  </Col>
                                </Row>
                                <Row
                                  justify="end"
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                  }}
                                >
                                  <Col style={{ marginTop: 15 }}>
                                    {favoriteBlogsList.some(
                                      (favorite) => favorite.blogId === blog.id
                                    ) ? (
                                      <Button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const favoriteItem =
                                            favoriteBlogsList.find(
                                              (fav) => fav.blogId === blog.id
                                            );
                                          if (favoriteItem) {
                                            const favoriteId = favoriteItem.id;
                                            handleUnFavoriteClick(favoriteId);
                                          }
                                        }}
                                        style={{
                                          marginRight: 8,
                                          color: "#ff1800",
                                        }}
                                      >
                                        <HeartFilled />
                                        Đã lưu tin
                                      </Button>
                                    ) : (
                                      <Button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleFavoriteClick(blog.id);
                                        }}
                                        style={{ marginRight: 8 }}
                                      >
                                        <HeartOutlined />
                                        Lưu tin
                                      </Button>
                                    )}
                                  </Col>
                                </Row>
                              </HoverableCard>
                            </Col>
                          ))}
                        </Row>
                      </Card>
                    </Col>
                    <Col span={6}>
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
                              <strong
                                style={{ color: "#001253", marginRight: 6 }}
                              >
                                Nhóm ngành, nghề:
                              </strong>{" "}
                              {companyDetail.category.name}
                            </Paragraph>
                            <Paragraph>
                              <EnvironmentOutlined
                                style={{ color: "#001253", marginRight: 6 }}
                              />
                              <strong
                                style={{ color: "#001253", marginRight: 6 }}
                              >
                                Địa điểm:
                              </strong>{" "}
                              {companyDetail.location.name}
                            </Paragraph>
                            <Paragraph>
                              <BarcodeOutlined
                                style={{ color: "#001253", marginRight: 6 }}
                              />
                              <strong
                                style={{ color: "#001253", marginRight: 6 }}
                              >
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
                            <strong
                              style={{ color: "#001253", marginRight: 6 }}
                            >
                              Địa chỉ:
                            </strong>{" "}
                            <Paragraph>
                              <EnvironmentOutlined
                                style={{ color: "#001253", marginRight: 6 }}
                              />
                              {companyDetail.address}
                            </Paragraph>
                            <strong
                              style={{ color: "#001253", marginRight: 6 }}
                            >
                              Website:
                            </strong>{" "}
                            <Paragraph>
                              <GlobalOutlined
                                style={{ color: "#001253", marginRight: 6 }}
                              />
                              <a>{companyDetail.linkWebsite} </a>
                            </Paragraph>
                            <strong
                              style={{ color: "#001253", marginRight: 6 }}
                            >
                              Số điện thoại liên hệ:
                            </strong>{" "}
                            <Paragraph>
                              <PhoneOutlined
                                style={{ color: "#001253", marginRight: 6 }}
                              />
                              <a>{companyDetail.phoneNumber}</a>
                            </Paragraph>
                            <strong
                              style={{ color: "#001253", marginRight: 6 }}
                            >
                              Email:
                            </strong>{" "}
                            <Paragraph>
                              <MailFilled
                                style={{ color: "#001253", marginRight: 6 }}
                              />
                              <a>{companyDetail.email}</a>
                            </Paragraph>
                          </Card>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Content>
              </Layout>
            )}
          </div>{" "}
        </div>
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
          <ViewBlog
            companyDetail={companyDetail}
            selectedBlogId={selectedBlogId}
            favoriteBlogsList={favoriteBlogsList}
            handleViewClick={handleViewClick}
            handleFavoriteClick={handleFavoriteClick}
            handleUnFavoriteClick={handleUnFavoriteClick}
          />
        )}
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
