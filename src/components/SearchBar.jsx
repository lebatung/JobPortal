import React, { useState, useEffect } from "react";
import { Layout, Input, Select, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { request, loadLocations } from "../helpers/axios_helper";

const { Content } = Layout;
const { Option } = Select;

const SearchBar = () => {
  const [locations, setLocations] = useState([]);

  // State để lưu trữ giá trị của input và location được chọn
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedLocation, setSelectedLocation] = React.useState("");

  // Hàm xử lý sự kiện khi người dùng ấn nút tìm kiếm
  const handleSearch = () => {
    console.log(`Tìm kiếm: ${searchTerm}, Địa điểm: ${selectedLocation}`);
    // Thực hiện các hành động tìm kiếm tại đây
  };

  const searchBarContainerStyle = {
    display: "flex",
    justifyContent: "center",
    margin: "20px",
  };

  useEffect(() => {
    loadLocations()
      .then((data) => {
        setLocations(data);
      })
      .catch((error) => {
        console.error("Error loading locations:", error);
      });
  }, []);

  return (
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
            >
              {locations.map((locations) => (
                <Option key={locations.id} value={locations.id}>
                  {locations.name}
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
  );
};

export default SearchBar;
