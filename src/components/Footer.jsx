import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Col, Row, Typography, Modal, Form, Input, Button } from "antd";

import { request } from "../helpers/axios_helper";
import { toast } from "react-toastify";

const { Paragraph } = Typography;

const footerStyle = {
  backgroundColor: "#100a65",
  marginTop: "20px",
  padding: "20px",
  bottom: "0",
  width: "100%",
};

const FootetContainer = {
  textAlign: "center",
  bottom: "0",
  width: "90%",
  margin: "auto",
};

const titleStyle = {
  color: "#fff",
  textAlign: "left",
  fontWeght: "bold",
  fontSize: "16px",
};

const paragraphStyle = {
  color: "#fff",
  textAlign: "left",
};

const contactContainerStyle = {
  display: "flex",
  alignItems: "center",
};

const contactStyle = {
  backgroundColor: "#ff6f4e",
  padding: "20px",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function Footer() {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [province, setProvince] = useState("");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const validateEmail = (rule, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return Promise.reject("Please enter a valid email address!");
    }
    return Promise.resolve();
  };

  const handleSearchByFooterLink = (provinceValue) => {
    // console.log("Tên công việc:", jobTitle);
    // console.log("Ngành nghề:", industry);
    // console.log("Tỉnh thành:", province);
    const searchData = {
      jobTitle,
      industry,
      province: provinceValue,
    };
    console.log(searchData);
    request("POST", "http://localhost:8080/api/search", searchData)
      .then((response) => {
        console.log(response.data);
        navigate("/search-result", { state: { searchResult: response.data } });
      })
      .catch((error) => {
        console.error("Error searching:", error);
      });
  };

  const handleSearchByFooterLinkCate = (industryvalue) => {
    // console.log("Tên công việc:", jobTitle);
    // console.log("Ngành nghề:", industry);
    // console.log("Tỉnh thành:", province);
    const searchData = {
      jobTitle,
      industry: industryvalue,
      province,
    };
    console.log(searchData);
    request("POST", "http://localhost:8080/api/search", searchData)
      .then((response) => {
        console.log(response.data);
        navigate("/search-result", { state: { searchResult: response.data } });
      })
      .catch((error) => {
        console.error("Error searching:", error);
      });
  };

  const onFinish = (values) => {
    const formData = {
      senderEmail: values.email,
      subject: values.subject,
      body: values.enquiry,
    };

    request("POST", "http://localhost:8080/mail/sendMailTo", formData)
      .then((response) => {
        console.log("Mail sent successfully:", response.data);
        toast.success("Gửi mail thành công");
        // Đóng Modal sau khi gửi thành công
        setIsModalVisible(false);
      })
      .catch((error) => {
        console.error("Failed to send mail:", error);
      });

    console.log(formData);
  };

  return (
    <footer style={footerStyle}>
      <div style={FootetContainer}>
        <Row justify="space-around">
          <Col md={4}>
            <p style={titleStyle}>CÁC LIÊN KẾT CHÍNH</p>
            <Paragraph style={paragraphStyle}>
              <Link style={paragraphStyle} to="/jobs">
                Việc làm
              </Link>
            </Paragraph>
            <Paragraph style={paragraphStyle}>
              <Link style={paragraphStyle} to="/companies">
                Công ty
              </Link>
            </Paragraph>
            <Paragraph style={paragraphStyle}>
              <Link style={paragraphStyle} to="/jobs">
                Tìm kiếm việc làm
              </Link>
            </Paragraph>
          </Col>
          <Col md={4}>
            <p style={titleStyle}>VIỆC LÀM THEO THÀNH PHỐ</p>
            <Paragraph style={paragraphStyle}>
              <div onClick={() => handleSearchByFooterLink(79)}>
                <Link style={paragraphStyle}>Hồ Chí Minh</Link>
              </div>
            </Paragraph>
            <Paragraph style={paragraphStyle}>
              <div onClick={() => handleSearchByFooterLink(1)}>
                <Link style={paragraphStyle}>Hà Nội</Link>
              </div>
            </Paragraph>
            <Paragraph style={paragraphStyle}>
              <div onClick={() => handleSearchByFooterLink(92)}>
                <Link style={paragraphStyle}>Cần Thơ</Link>
              </div>
            </Paragraph>
            <Paragraph style={paragraphStyle}>
              <div onClick={() => handleSearchByFooterLink(31)}>
                <Link style={paragraphStyle}>Hải Phòng</Link>
              </div>
            </Paragraph>
            <Paragraph style={paragraphStyle}>
              <div onClick={() => handleSearchByFooterLink(48)}>
                <Link style={paragraphStyle}>Đà Nẵng</Link>
              </div>
            </Paragraph>
          </Col>
          <Col md={4}>
            <p style={titleStyle}>VIỆC LÀM THEO NHÓM NGÀNH, NGHỀ</p>
            <Paragraph style={paragraphStyle}>
              <div onClick={() => handleSearchByFooterLinkCate(51)}>
                <Link style={paragraphStyle}>Công nghệ thông tin</Link>
              </div>
            </Paragraph>
            <Paragraph style={paragraphStyle}>
              <div onClick={() => handleSearchByFooterLinkCate(53)}>
                <Link style={paragraphStyle}>Cơ khí</Link>
              </div>
            </Paragraph>
            <Paragraph style={paragraphStyle}>
              <div onClick={() => handleSearchByFooterLinkCate(66)}>
                <Link style={paragraphStyle}>Kế toán</Link>
              </div>
            </Paragraph>
            <Paragraph style={paragraphStyle}>
              <div onClick={() => handleSearchByFooterLinkCate(52)}>
                <Link style={paragraphStyle}>Ngân hàng</Link>
              </div>
            </Paragraph>
            <Paragraph style={paragraphStyle}>
              <div onClick={() => handleSearchByFooterLinkCate(62)}>
                <Link style={paragraphStyle}>Xây dựng</Link>
              </div>
            </Paragraph>
          </Col>
          <Col md={4}>
            <p style={titleStyle}>THÔNG TIN LIÊN HỆ</p>
            <Paragraph style={paragraphStyle}>
              <p style={paragraphStyle}>
                SĐT liên hệ: <a>0907870489</a>
              </p>
            </Paragraph>
            <Paragraph style={paragraphStyle}>
              <div style={contactContainerStyle}>
                <span style={{ marginRight: "10px" }}>Hoặc</span>{" "}
                {/* Thêm marginRight cho khoảng cách */}
                <Button type="link" onClick={showModal} style={contactStyle}>
                  Contact Us
                </Button>
              </div>
            </Paragraph>

            <Modal
              title="Contact Us"
              visible={isModalVisible}
              onCancel={handleCancel}
              footer={null}
            >
              <Form onFinish={onFinish}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Please enter your email!" },
                    { validator: validateEmail },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="subject"
                  label="Subject"
                  rules={[
                    { required: true, message: "Please enter the subject!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="enquiry"
                  label="Enquiry"
                  rules={[
                    { required: true, message: "Please enter your enquiry!" },
                  ]}
                >
                  <Input.TextArea />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </Col>
        </Row>
      </div>
    </footer>
  );
}

export default Footer;
