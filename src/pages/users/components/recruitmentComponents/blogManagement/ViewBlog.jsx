import React, { useState, useEffect } from "react";

import { Layout, Typography, Card, Row, Col, Image } from "antd";
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
} from "@ant-design/icons";
import { useAuth } from "../../../../../contexts/AuthContext";

import {
  loadPersonalDetailByUsername,
  loadBlogById,
} from "../../../../../helpers/axios_helper";

const { Header, Content, Sider } = Layout;
const { Title, Paragraph } = Typography;

export default function ViewBlog(props) {
  const selectedBlogId = props.selectedBlogId;
  const { username } = useAuth();

  function formatDateString(originalDate) {
    const parts = originalDate.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
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
  }, [selectedBlogId, username]);

  const paragraphStyleHeading = {
    fontSize: "20px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
  };
  const headingStyle = {
    fontWeight: "Bold",
    fontSize: "20px",
    color: "#002347",
  };
  const paragraphTitle = {
    color: "#001253",
    marginRight: 6,
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
              <Paragraph style={headingStyle}>
                      <strong>{blog.title}</strong>
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
                      {formatDateString(blog.deadLine)}
                    </Paragraph>
              </Card>
            </Col>
          </Row>
          <div style={{ margin: "0px 0" }}></div>
          <Row align="stretch">
            <Col gutter={16} span={16}>
              <Card title={<span style={{ color: "#002347" }}>Yêu cầu chung</span>}>
              <Row gutter={16}>
                  <Col span={12}>
                    <Paragraph>
                      <CrownOutlined style={paragraphTitle} />
                      <strong style={paragraphTitle}>Kinh Nghiệm:</strong>{" "}
                      {parseInt(blog.exp) === 0 ? "Không yêu cầu kinh nghiệm" : `${blog.exp} năm kinh nghiệm`}
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
              <Card title={
                  <span style={{ color: "#002347" }}>Mô tả công việc</span>
                }>
                <Paragraph>
                  {blog.detail.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </Paragraph>
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
                      {personalDetail.category.name}
                    </Paragraph>
                    <Paragraph>
                      <EnvironmentOutlined
                        style={{ color: "#001253", marginRight: 6 }}
                      />
                      <strong style={{ color: "#001253", marginRight: 6 }}>
                        Địa điểm:
                      </strong>{" "}
                      {blog.location.name}
                    </Paragraph>
                    <Paragraph>
                      <BarcodeOutlined
                        style={{ color: "#001253", marginRight: 6 }}
                      />
                      <strong style={{ color: "#001253", marginRight: 6 }}>
                        Mã số thuế:
                      </strong>{" "}
                      {personalDetail.taxCode}
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
                      {personalDetail.address}
                    </Paragraph>
                    <strong style={{ color: "#001253", marginRight: 6 }}>
                      Website:
                    </strong>{personalDetail.linkWebsite}
                    <Paragraph>
                      <GlobalOutlined
                        style={{ color: "#001253", marginRight: 6 }}
                      />
                      <a>{personalDetail.linkWebsite} </a>
                    </Paragraph>
                    <strong style={{ color: "#001253", marginRight: 6 }}>
                      Số điện thoại liên hệ:
                    </strong>{" "}
                    <Paragraph>
                      <PhoneOutlined
                        style={{ color: "#001253", marginRight: 6 }}
                      />
                      <a>{personalDetail.phoneNumber}</a>
                    </Paragraph>
                    <strong style={{ color: "#001253", marginRight: 6 }}>
                      Email:
                    </strong>{" "}
                    <Paragraph>
                      <MailFilled
                        style={{ color: "#001253", marginRight: 6 }}
                      />
                      <a>{personalDetail.email}</a>
                    </Paragraph>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  );
}
