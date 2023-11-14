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
import { Pagination } from "antd";

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
    border: 1px solid #ccc;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    &:hover {
      background-color: #f0f0f0;
    }
  `;

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filteredCompanies =
    selectedCategory === "all"
      ? companies
      : companies.filter((company) => company.category.id === selectedCategory);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCompanies.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  return (
    <>
      <div style={containerWrapper}>
        <div style={Container}>
          <div style={selectContainerStyle}>
            <Select
              showSearch
              defaultValue="all"
              onChange={handleCategoryChange}
              placeholder="Tìm kiếm lĩnh vực, ngành nghề"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
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
              {currentItems.map((company) => (
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
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={filteredCompanies.length}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
