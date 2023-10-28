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
                  <strong>{blog.title}</strong>
                </Paragraph>
                <Paragraph>
                  <strong>Công ty:</strong> {personalDetail.name}
                </Paragraph>
                <Paragraph>
                  <strong>Địa chỉ:</strong> {personalDetail.address}
                </Paragraph>
                <Paragraph>
                  <strong>Mức lương: </strong>
                  {blog.salaryMin} - {blog.salaryMax} Triệu đồng |{" "}
                  <strong>Hạn nộp hồ sơ:</strong> {formatDateString(blog.deadLine)}
                </Paragraph>
              </Card>
            </Col>
          </Row>
          <div style={{ margin: "0px 0" }}></div>
          <Row align="stretch">
            <Col gutter={16} span={16}>
              <Card title="Yêu cầu chung">
                <Row gutter={-8}>
                  <Col span={12}>
                    <Paragraph>
                      <CrownOutlined style={{ marginRight: 4 }} />
                      <strong style={{ marginRight: 4 }}>
                        Kinh Nghiệm:
                      </strong>{" "}
                      {blog.exp}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph>
                      <IdcardOutlined style={{ marginRight: 4 }} />
                      <strong style={{ marginRight: 4 }}>
                        Trình độ chuyên môn:
                      </strong>
                      {blog.education}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph>
                      <MenuOutlined style={{ marginRight: 4 }} />
                      <strong style={{ marginRight: 4 }}>
                        Ngành, nghề:
                      </strong>{" "}
                      {blog.category.name}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph>
                      <AuditOutlined style={{ marginRight: 4 }} />
                      <strong style={{ marginRight: 4 }}>Chức vụ:</strong>
                      {blog.position}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph>
                      <TeamOutlined style={{ marginRight: 4 }} />
                      <strong style={{ marginRight: 4 }}>Số lượng:</strong>{" "}
                      {blog.quantity}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph>
                      <DeploymentUnitOutlined style={{ marginRight: 4 }} />
                      <strong style={{ marginRight: 4 }}>
                        Giới tính:
                      </strong>{" "}
                      {blog.gender}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph>
                      <ScheduleOutlined style={{ marginRight: 4 }} />
                      <strong style={{ marginRight: 4 }}>
                        Thời gian làm việc:
                      </strong>{" "}
                      {blog.workingTime}
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph>
                      <EnvironmentOutlined style={{ marginRight: 4 }} />
                      <strong style={{ marginRight: 4 }}>
                        Địa điểm làm việc:
                      </strong>{" "}
                      {blog.location.name}
                    </Paragraph>
                  </Col>
                </Row>
              </Card>
              <Card title="Mô tả công việc">
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
                  <Card>
                    <Paragraph style={paragraphStyleHeading}>
                      Thông tin công ty
                    </Paragraph>
                    <Paragraph>
                      <EnvironmentOutlined style={{ marginRight: 4 }} />
                      {personalDetail.address}
                    </Paragraph>
                    <Paragraph>
                      <PhoneOutlined style={{ marginRight: 4 }} />
                      {personalDetail.phoneNumber}
                    </Paragraph>
                    <Paragraph>
                      <GlobalOutlined style={{ marginRight: 4 }} />
                      <a>{personalDetail.linkWebsite} </a>
                    </Paragraph>
                  </Card>
                </Col>
                <Col span={24}>
                  <Card>
                    <Paragraph>20/10/23</Paragraph>
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
