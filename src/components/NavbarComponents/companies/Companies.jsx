import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        console.log(data);
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

  const Container = {
    margin: "0 auto",
    backgroundColor: "#ffffff",

    padding: "5px",
  };
  const selectContainerStyle = {
    display: "flex",
    margin: "14px",
    justifyContent: "flex-end",
  };
  const companyCardContainer = {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  };

  const containerWrapper = {
    backgroundColor: "#f5f5f5f5",
  };
  const HoverableCard = styled(Card)`
    flex: 1;
    transition: background-color 0.3s;
    cursor: pointer;
    margin: 8px;
    &:hover {
      background-color: #f0f0f0;
    }
  `;

  const [selectedCategory, setSelectedCategory] = useState("all"); // State cho category được chọn

  // Lọc danh sách công ty theo category
  const filteredCompanies =
    selectedCategory === "all"
      ? companies
      : companies.filter((company) => company.category.id === selectedCategory);

  return (
    <>
      <div style={containerWrapper}>
        <div style={Container}>
          <div style={selectContainerStyle}>
            {/* Dropdown filter cho category */}
            <Select
              defaultValue="all"
              onChange={(value) => setSelectedCategory(value)}
            >
              <Option value="all">Tất cả lĩnh vực, ngành nghề</Option>
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </div>
          <div style={companyCardContainer}>
            <Row gutter={[16, 16]}>
              {companies.map((company) => (
                <Col key={company.id} xs={24} sm={12} md={8} lg={8}>
                  <Link to={`/companies/${company.slug}`}>
                    {" "}
                    <HoverableCard>
                      <Row gutter={16}>
                        <Col span={8}>
                          <Image
                            style={{ width: "80%" }}
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
                                  <EnvironmentOutlined />{" "}
                                  {company.location.name}
                                </p>
                                <p>
                                  <WalletOutlined /> {company.blogs.length} Công
                                  việc
                                </p>
                              </div>
                            }
                          />
                        </Col>
                      </Row>
                    </HoverableCard>
                  </Link>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </div>
    </>
  );
}
