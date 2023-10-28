import React, { useEffect, useState } from "react";
import { Card, Row, Col, Image, Select } from "antd";
import styled from "styled-components";
import {
  EnvironmentOutlined,
  ApiOutlined,
  WalletOutlined,
} from "@ant-design/icons";

import "antd/dist/antd";

import {
  rquest,
  loadAllRecruitments,
  loadCategories,
} from "../../../helpers/axios_helper";

const { Option } = Select;
export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadAllRecruitments()
      .then((data) => {
        setCompanies(data);
      })
      .catch((error) => {
        console.error("Error loading locations:", error);
      });
    loadCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });
  }, []);

  const exContainer = {
    margin: "20px",
    backgroundColor: "#ffffff",
    width: "80%",
  };
  const selectContainerStyle = {
    display: "flex",
    position: "absolute",
    right: 0,
  };
  const HoverableCard = styled(Card)`
    transition: background-color 0.3s;
    &:hover {
      background-color: #f0f0f0;
    }
  `;

  const [selectedCategory, setSelectedCategory] = useState("all"); // State cho category được chọn

  // Lọc danh sách công ty theo category
  const filteredCompanies =
    selectedCategory === "all"
      ? companies
      : companies.filter(
          (company) => company.category.name === selectedCategory
        );

  return (
    <>
      <div style={exContainer}>
        {/* Dropdown filter cho category */}
        <Select
          defaultValue="all"
          onChange={(value) => setSelectedCategory(value)}
         
        >
          <Option value="all">Tất cả</Option>
          {/* Thêm các category khác vào đây */}
        </Select>
        <Row gutter={[16, 16]}>
          {companies.map((company) => (
            <Col key={company.id} xs={24} sm={12} md={8} lg={8}>
              <HoverableCard>
                <Row gutter={16}>
                  <Col span={8}>
                    <Image
                      style={{ width: "100%" }}
                      src={`http://localhost:8080/api/files/${company.avatar}`}
                      alt={company.name}
                    />
                  </Col>
                  <Col span={16}>
                    <Card.Meta
                      title={company.name}
                      description={
                        <div style={{ textAlign: "left" }}>
                          <p>
                            <ApiOutlined /> {company.category.name}
                          </p>
                          <p>
                            <EnvironmentOutlined /> {company.location.name}
                          </p>
                          <p>
                            <WalletOutlined /> {company.blogs.length} Công việc
                          </p>
                        </div>
                      }
                    />
                  </Col>
                </Row>
              </HoverableCard>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}
