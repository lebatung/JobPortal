import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, Image, Select, Layout, Input, Button } from "antd";
import styled from "styled-components";
import {
  EnvironmentOutlined,
  ApiOutlined,
  WalletOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import "antd/dist/antd";
import { Pagination } from "antd";

import {
  rquest,
  loadAllRecruitments,
  loadCategories,
  loadLocations,
} from "../../../helpers/axios_helper";

const { Option } = Select;
const { Content } = Layout;
export default function Companies() {
  const [originalCompanies, setOriginalCompanies] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);

  const [locations, setLocations] = useState([]);

  // State để lưu trữ giá trị của input và location được chọn
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedLocation, setSelectedLocation] = React.useState("");

  // Hàm xử lý sự kiện khi người dùng ấn nút tìm kiếm
  const handleSearch = () => {
    // Lọc danh sách công ty dựa trên tên công ty và địa điểm
    const filteredCompanies = originalCompanies.filter((company) => {
      const nameMatch =
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.name.toLowerCase() === searchTerm.toLowerCase();

      const locationMatch =
        selectedLocation === "" || company.location.id === selectedLocation;

      return nameMatch && locationMatch;
    });

    // Cập nhật danh sách công ty sau khi lọc
    setCompanies(filteredCompanies);
  };

  useEffect(() => {
    loadAllRecruitments()
      .then((data) => {
        setOriginalCompanies(data);
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

    loadLocations()
      .then((data) => {
        setLocations(data);
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
    justifyContent: "space-around", // hoặc "space-between"
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
      border: 1px solid #ff6f4e;
    }
  `;

  const searchBarContainerStyle = {
    display: "flex",
    justifyContent: "center",
    margin: "20px",
  };

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
          <siv>
            <Layout>
              <Content style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: "80%" }}>
                  <div style={searchBarContainerStyle}>
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder="Nhập nội dung tìm kiếm việc làm..."
                      onChange={(e) => setSearchTerm(e.target.value)}
                      value={searchTerm}
                      style={{ width: 800 }}
                      
                    />
                    <Select
                      placeholder="Chọn địa điểm"
                      value={selectedLocation}
                      onChange={(value) => setSelectedLocation(value)}
                      style={{ width: 200, marginRight: "10px" }}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      defaultValue="all"
                    >
                      <Option value="">Tất cả</Option>
                      {locations.map((location) => (
                        <Option key={location.id} value={location.id}>
                          {location.name}
                        </Option>
                      ))}
                    </Select>
                    <Button
                      type="primary"
                      onClick={handleSearch}
                      style={{ backgroundColor: "#FF914D" }}
                    >
                      Tìm kiếm
                    </Button>
                  </div>
                </div>
              </Content>
            </Layout>
          </siv>
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
            <Row gutter={[16, 16]} justify="center">
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
