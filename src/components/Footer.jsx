import { Col, Row } from "antd";
import Paragraph from "antd/es/skeleton/Paragraph";
import React from "react";
import { Link } from "react-router-dom"; // Import Link from your routing library

const footerStyle = {
  backgroundColor: "#004fc6",
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
};

function Footer() {
  return (
    <footer style={footerStyle}>
      <div style={FootetContainer}>
        <Row justify="space-around">
          <Col md={4}>
            <p style={titleStyle}>DÀNH CHO ỨNG VIÊN</p>
            <Paragraph>
              <Link to="/admin">Trang quản trị</Link>
            </Paragraph>
            <Paragraph>
              <Link to="/jobs">Việc làm</Link>
            </Paragraph>
            <Paragraph>
              <Link to="/companies">Công ty</Link>
            </Paragraph>
          </Col>
          <Col md={4}>
            <p style={titleStyle}>DÀNH CHO NHÀ TUYỂN DỤNG</p>
          </Col>
          <Col md={4}>
            <p style={titleStyle}>THÔNG TIN LIÊN HỆ</p>
          </Col>
        </Row>
      </div>
    </footer>
  );
}

export default Footer;
