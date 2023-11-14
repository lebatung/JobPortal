import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  loadBlogsByCategorySlug,
  request,
  loadFavoriteBlogsByPersonalDetailId,
  loadPersonalDetailByUsername,
  loadUserByUsername,
  loadLocations,
} from "../helpers/axios_helper";
import { Card, Col, Row, Image, Pagination, Modal, Button, Select } from "antd";
import styled from "styled-components";
import {
  EnvironmentOutlined,
  FieldTimeOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";

import ViewLandingBlog from "./ViewLandingBlog";
import { useAuth } from "../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";

const { Option } = Select;
export default function BlogList() {
  const { slug } = useParams();
  const [blogsByCategorySlug, setBlogsByCategorySlug] = useState([]);
  const [floading, setFloading] = useState(false);
  const [favoriteBlogsList, setFavoriteBlogsList] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState("");
  const [user, setUser] = useState({
    id: "",
  });

  const [personalDetailId, setPersonalDetailId] = useState("");
  const { username, isAuthenticated, userId } = useAuth();

  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  const [locations, setLocation] = useState([]);

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

    loadBlogsByCategorySlug(slug)
      .then((data) => {
        setBlogsByCategorySlug(data);
      })
      .catch((error) => {
        console.error("Error loading loadBlogsByCategorySlug:", error);
      });

    loadLocations(slug)
      .then((data) => {
        setLocation(data);
      })
      .catch((error) => {
        console.error("Error loading loadBlogsByCategorySlug:", error);
      });
  }, [slug, username, user.id]);

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

  function formatDateString(originalDate) {
    const parts = originalDate.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#f5f5f5",
  };

  const blogsByCategorySlugContainer = {
    marginTop: "20px",
    width: "90%",
  };

  const sendMessageButton = {
    marginBottom: "10px",
    fontSize: "16px",
    padding: "0px 27px",
  };

  const filteringContainer = {
    display: "flex",
  };

  const selectContainerStyle = {
    display: "flex",
    margin: "14px 5px",
    justifyContent: "flex-end",
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

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleViewClick = (blog) => {
    console.log(blog);
    if (floading) {
      return;
    }

    setSelectedBlog(blog);
    setIsViewModalVisible(true);
  };

  // const handleCategoryChange = (value) => {
  //   setSelectedCategory(value);
  //   setCurrentPage(1); // Reset current page when changing category
  // };

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

  const handleSalaryChange = (value) => {
    setSelectedSalary(value);
    setCurrentPage(1);
  };

  const handleLocationChange = (value) => {
    setSelectedLocation(value);
    setCurrentPage(1);
  };

  const [selectedSalary, setSelectedSalary] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const filteredBlogs =
    selectedLocation === "all"
      ? blogsByCategorySlug
      : blogsByCategorySlug.filter(
          (blog) => blog.location.id === selectedLocation
        );

  const filterBlogsBySalary = (value) => {
    return selectedSalary === "all"
      ? filteredBlogs
      : filteredBlogs.filter((blog) => {
          const selectedSalaryRange = value.split("-").map(Number);
          const blogSalaryMin = blog.salaryMin;
          const blogSalaryMax = blog.salaryMax;
          console.log(
            "blogSalaryMin",
            blogSalaryMin,
            "blogSalaryMax",
            blogSalaryMax
          );
          // Kiểm tra xem blog có nằm trong khoảng lương được chọn không
          return (
            blogSalaryMin >= selectedSalaryRange[0] &&
            blogSalaryMax <= selectedSalaryRange[1]
          );
        });
  };

  const filteredBlogsBySalary = filterBlogsBySalary(selectedSalary);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

  const startIndexSalary = (currentPage - 1) * pageSize;
  const endIndexSalary = startIndexSalary + pageSize;
  const currentBlogsFilteredBySalary = filteredBlogsBySalary.slice(
    startIndexSalary,
    endIndexSalary
  );

  return (
    <>
      <div style={blogsByCategorySlugContainer}>
        <Card
          title={
            <span style={{ color: "#100b64" }}>
              {blogsByCategorySlug[0]
                ? blogsByCategorySlug[0].category.name
                : "Chưa có tin tuyển dụng"}
              ({blogsByCategorySlug.length})
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
                style={{ width: "150px" }}
                showSearch
                defaultValue="all"
                onChange={handleLocationChange}
                placeholder="Tìm kiếm địa điểm"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
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
          </div>

          <Row align="stretch" style={{ marginTop: "12px" }}>
            {currentBlogsFilteredBySalary.map((blog) => (
              <Col span={8} key={blog.id}>
                <HoverableCard
                  style={{height: "216px" }}
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
                      <h4 style={{ margin: 0 }}>{blog.personalDetail.name}</h4>
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3>{blog.title}</h3>
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
          total={blogsByCategorySlug.length}
          pageSize={pageSize}
          onChange={handleChangePage}
        />
      </div>

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
}
