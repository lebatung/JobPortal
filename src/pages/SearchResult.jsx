import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import ViewLandingBlog from "./ViewLandingBlog";
import {
  EnvironmentOutlined,
  FieldTimeOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import {
  Card,
  Col,
  Row,
  Image,
  Pagination,
  Modal,
  Button,
  Select,
  Input,
} from "antd";
import {
  request,
  loadLocations,
  loadCategories,
  loadFavoriteBlogsByPersonalDetailId,
  loadPersonalDetailByUsername,
  loadUserByUsername,
} from "../helpers/axios_helper";
import styled from "styled-components";

const SearchResult = () => {
  const location = useLocation();
  const { isAuthenticated, username, userId } = useAuth();
  const { Option } = Select;
  const { searchResult: initialSearchResult } = location.state || {};
  const [searchResult, setSearchResult] = useState(initialSearchResult || []);

  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [province, setProvince] = useState("");

  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [floading, setFloading] = useState(false);
  const [favoriteBlogsList, setFavoriteBlogsList] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState("");
  const [user, setUser] = useState({
    id: "",
  });

  const [personalDetailId, setPersonalDetailId] = useState("");

  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  const [selectedSalary, setSelectedSalary] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const filterBlogs = () => {
    if (!searchResult) {
      return [];
    }
    return searchResult.filter((blog) => {
      const selectedSalaryRange =
        selectedSalary === "all"
          ? [0, Infinity]
          : selectedSalary.split("-").map(Number);
      const blogSalaryMin = blog.salaryMin;
      const blogSalaryMax = blog.salaryMax;

      const meetsSalaryCriteria =
        blogSalaryMin >= selectedSalaryRange[0] &&
        blogSalaryMax <= selectedSalaryRange[1];

      const meetsLocationCriteria =
        selectedLocation === "all" || blog.location.id === selectedLocation;

      const meetsCategoryCriteria =
        selectedCategory === "all" || blog.category.id === selectedCategory;

      return (
        meetsSalaryCriteria && meetsLocationCriteria && meetsCategoryCriteria
      );
    });
  };

  const filteredBlogs = filterBlogs();

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleSalaryChange = (value) => {
    setSelectedSalary(value);
    setCurrentPage(1);
  };

  const handleLocationChange = (value) => {
    setSelectedLocation(value);
    setCurrentPage(1);
  };
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    // console.log("Tên công việc:", jobTitle);
    // console.log("Ngành nghề:", industry);
    // console.log("Tỉnh thành:", province);
    const searchData = {
      jobTitle: jobTitle,
      industry: industry,
      province: province,
    };
    console.log(searchData);
    request("POST", "http://localhost:8080/api/search", searchData)
      .then((response) => {
        console.log(response.data);
        setSearchResult(response.data);
      })
      .catch((error) => {
        console.error("Error searching:", error);
      });
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

  const loadFavoriteBlogs = () => {
    console.log(personalDetailId);
    loadFavoriteBlogsByPersonalDetailId(personalDetailId)
      .then((data) => {
        setFavoriteBlogsList(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error loading favoriteBlogsList:", error);
      });
  };

  const handleFavoriteClick = () => {
    if (isAuthenticated) {
      const dto = {
        personalDetailId: personalDetailId,
        blogId: selectedBlog.id,
      };
      console.log(dto);
      setFloading(true);
      request("POST", "http://localhost:8080/api/favorites/create", dto)
        .then((response) => {
          loadFavoriteBlogs();
          setFloading(false);
        })
        .catch((error) => {
          console.log("Error setFavoriteBlogsList on Catch");
        });

      saveUserInteractionFav(selectedBlog.id);
    } else {
      toast.error("Bạn cần đăng nhập để sử dụng chức năng này!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };
  const handleViewClick = (blog) => {
    console.log(blog);
    if (floading) {
      return;
    }

    setSelectedBlog(blog);
    setIsViewModalVisible(true);
  };

  function formatDateString(originalDate) {
    const parts = originalDate.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  const searchResultContainer = {
    marginTop: "20px",
    width: "90%",
  };

  const filteringContainer = {
    display: "flex",
  };

  const selectContainerStyle = {
    display: "flex",
    margin: "14px 5px",
    justifyContent: "flex-end",
  };

  const searchContainer = {
    display: "flex",
    flexDirection: "row", // Xếp các thành phần theo hàng ngang
    justifyContent: "space-between", // Canh giữa các thành phần
    maxWidth: "800px",
    width: "100%", // Đảm bảo chiều rộng tối đa là 800px
    margin: "10px",
    padding: "14px",
    backgroundColor: "#0079DE",
    borderRadius: "10px",
    border: "1px solid #0079DE",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const inputButtonContainerStyle = {
    display: "flex",
    width: "100%",
    alignItems: "center",
  };

  const inputStyle = {
    flex: 1, // Thẻ input chiếm phần lớn chiều rộng còn lại
    marginRight: "10px",
  };

  const selectStyle = {
    width: "200px", // Đặt chiều rộng cho các Select
    marginRight: "10px",
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

  useEffect(() => {
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

    loadLocations()
      .then((data) => {
        setLocations(data);
      })
      .catch((error) => {
        console.error("Error loading loadBlogsByCategorySlug:", error);
      });
    loadCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error loading loadBlogsByCategorySlug:", error);
      });
  }, []);

  useEffect(() => {
    console.log("personaldetailID", personalDetailId);
    if (personalDetailId) {
      loadFavoriteBlogsByPersonalDetailId(personalDetailId)
        .then((data) => {
          setFavoriteBlogsList(data);
          console.log("loadFavoriteBlogsByPersonalDetailId", data);
        })
        .catch((error) => {
          console.error(
            "Error loading loadFavoriteBlogsByPersonalDetailId:",
            error
          );
        });
    }
  }, [personalDetailId]);
  useEffect(() => {
    setSearchResult(initialSearchResult);
  }, [initialSearchResult]);
  return (
    <>
      <div style={searchContainer}>
        <div style={inputButtonContainerStyle}>
          <Input
            placeholder="Nhập tên công việc"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            style={inputStyle}
          />
          <Select
            showSearch
            placeholder="Chọn ngành nghề"
            style={selectStyle}
            value={industry}
            onChange={(value) => setIndustry(value)}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="">Chọn ngành nghề</Option>
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
          <Select
            showSearch
            placeholder="Chọn tỉnh thành"
            style={selectStyle}
            value={province}
            onChange={(value) => setProvince(value)}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="">Chọn tỉnh thành</Option>
            {locations.map((location) => (
              <Option key={location.id} value={location.id}>
                {location.name}
              </Option>
            ))}
          </Select>
          <Button
            type="primary"
            style={{ backgroundColor: "#FF6F4E" }}
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
      {searchResult && searchResult.length > 0 ? (
        <>
          <div style={searchResultContainer}>
            <Card
              title={
                <span style={{ color: "#100b64" }}>
                  {"Kết quả tìm kiếm"}({searchResult.length})
                </span>
              }
            >
              <div style={filteringContainer}>
                <div style={selectContainerStyle}>
                  <Select
                    style={{ width: "150px" }}
                    defaultValue="all"
                    onChange={handleSalaryChange}
                  >
                    <Option value="all">Tất cả</Option>
                    <Option key="13" value="1-3">
                      {" "}
                      1-3 Triệu{" "}
                    </Option>
                    <Option key="35" value="3-5">
                      {" "}
                      3-5 Triệu{" "}
                    </Option>
                    <Option key="57" value="5-7">
                      {" "}
                      5-7 Triệu{" "}
                    </Option>
                    <Option key="710" value="7-10">
                      {" "}
                      7-10 Triệu{" "}
                    </Option>
                    <Option key="1015" value="10-15">
                      {" "}
                      10-15 Triệu{" "}
                    </Option>
                    <Option key="1520" value="15-20">
                      {" "}
                      15-20 Triệu{" "}
                    </Option>
                    <Option key="2030" value="20-30">
                      {" "}
                      20-30 Triệu{" "}
                    </Option>
                    <Option key="3040" value="30-40">
                      {" "}
                      30-40 Triệu{" "}
                    </Option>
                    <Option key="4050" value="40-50">
                      {" "}
                      40-50 Triệu{" "}
                    </Option>
                    <Option key="51" value="50-">
                      {" "}
                      Trên 50 Triệu{" "}
                    </Option>
                  </Select>
                </div>
                <div style={selectContainerStyle}>
                  <Select
                    style={{ width: "200px" }}
                    showSearch
                    defaultValue="all"
                    onChange={handleLocationChange}
                    placeholder="Tìm kiếm địa điểm"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="all">Tất cả</Option>
                    {locations.map((location) => (
                      <Option key={location.id} value={location.id}>
                        {location.name}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div style={selectContainerStyle}>
                  <Select
                    style={{ width: "200px" }}
                    showSearch
                    defaultValue="all"
                    onChange={handleCategoryChange}
                    placeholder="Tìm kiếm nhóm ngành, nghề"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="all">Tất cả</Option>
                    {categories.map((category) => (
                      <Option key={category.id} value={category.id}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              <Row align="stretch" style={{ marginTop: "12px" }}>
                {currentBlogs.map((blog) => (
                  <Col span={8} key={blog.id}>
                    <HoverableCard
                      style={{ height: "216px" }}
                      onClick={() => handleViewClick(blog)}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <div style={{ marginRight: "30px", flexShrink: 0 }}>
                          {/* Hình ảnh */}
                          <Image
                            style={{
                              width: "80px",
                              height: "40px",
                              objectFit: "cover",
                            }}
                            src={`http://localhost:8080/api/files/${blog.personalDetail.avatar}`}
                            alt={blog.title}
                          />
                        </div>

                        <div
                          style={{
                            textAlign: "left",
                            textTransform: "uppercase",
                          }}
                        >
                          {/* Thẻ p */}
                          <h4 style={{ margin: 0 }}>
                            {blog.personalDetail.name}
                          </h4>
                        </div>
                      </div>

                      <div style={{ flex: 1 }}>
                        <h3 style={{ color: "#100b64" }}>{blog.title}</h3>
                        <p>{blog.name}</p>
                        <div
                          style={{
                            justifyContent: "space-between",
                          }}
                        >
                          <Row gutter={24}>
                            <Col span={8}>
                              <div>
                                <MoneyCollectOutlined
                                  style={{
                                    color: "#E14D2A",
                                    marginRight: "4",
                                  }}
                                />{" "}
                                {blog.salaryMin} - {blog.salaryMax} Triệu đồng
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
                        </div>
                      </div>
                    </HoverableCard>
                  </Col>
                ))}
              </Row>
            </Card>
            <Pagination
              current={currentPage}
              total={searchResult.length}
              pageSize={pageSize}
              onChange={handleChangePage}
            />
          </div>
        </>
      ) : (
        <p>Không có kết quả phù hợp.</p>
      )}
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
        {selectedBlog && (
          <ViewLandingBlog
            selectedBlog={selectedBlog}
            favoriteBlogsList={favoriteBlogsList}
            handleViewClick={handleViewClick}
            handleFavoriteClick={handleFavoriteClick}
            handleUnFavoriteClick={handleUnFavoriteClick}
          />
        )}
      </Modal>
    </>
  );
};

export default SearchResult;
