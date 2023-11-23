import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import ViewLandingBlog from "./ViewLandingBlog";
import {
  Input,
  Select,
  Button,
  Slider,
  Carousel,
  Card,
  Col,
  Row,
  Image,
  Modal,
  Pagination,
} from "antd";
import Footer from "../components/Footer";

import {
  request,
  loadCategories,
  loadLocations,
  loadListMostBlogFrequency,
  loadAllBlogsByCategoryId,
  loadUserByUsername,
  loadPersonalDetailByUsername,
  loadFavoriteBlogsByPersonalDetailId,
  loadNewestBlogs,
  loadListCategoriesNBlogsRelated,
  loadHighSalaryBlogs,
  loadOutStandingRecruitments,
} from "../helpers/axios_helper";
import styled from "styled-components";
import {
  ApiOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Link, Navigate, useAsyncError, useNavigation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";

const container = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
};

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  flex: 1,
  backgroundColor: "#f5f5f5",
};

const searchNSliderContainer = {
  display: "flex",
  width: "90%",
  backgroundColor: "#004FC6",
  marginTop: "20px",
  padding: "2px",
  borderRadius: "15px",
};

const searchContainer = {
  maxWidth: "800px",
  width: "40%",
  margin: "auto 20px",
  padding: "14px",
  backgroundColor: "#0079DE",
  borderRadius: "10px",
  border: "1px solid #0079DE",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const sliderContainer = {
  width: "60%",
  margin: "12px",
};

const inputButtonContainerStyle = {
  display: "flex",
  width: "100%",
  alignItems: "center",
  marginBottom: "10px",
};

const inputStyle = {
  marginRight: "10px",
};

const selectContainerStyle = {
  display: "flex",
  width: "100%",
  justifyContent: "space-between",
};

const selectStyle = {
  flex: 1,
  marginRight: "10px",
};

const categoriesListContainer = {
  marginTop: "20px",
  width: "90%",
};

const newestBlogsContainer = {
  marginTop: "20px",
  width: "90%",
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

const { Option } = Select;
export default function LandingPage() {
  // SEARCH
  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [province, setProvince] = useState("");

  const [hotJobs, setHotJobs] = useState([]);
  const [categoriesNBlogs, setCategoriesNBlogs] = useState([]);
  const [outStandingRecruitment, setOutStandingRecruitment] = useState([]);

  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState("");

  const [newestBlogs, setMewestBlogs] = useState([]);
  const [highSalaryBlogs, setHighSalaryBlogs] = useState([]);

  const { username, isAuthenticated, userId } = useAuth();
  const [user, setUser] = useState({
    id: "",
  });
  const [personalDetailId, setPersonalDetailId] = useState("");
  const [floading, setFloading] = useState(false);
  const [favoriteBlogsList, setFavoriteBlogsList] = useState([]);

  //func
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState(null);

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
        navigate("/search-result", { state: { searchResult: response.data } });
      })
      .catch((error) => {
        console.error("Error searching:", error);
      });
  };

  const handleViewClick = (blog) => {
    console.log(blog);
    if (floading) {
      return;
    }

    setSelectedBlog(blog);
    setIsViewModalVisible(true);
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

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

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
  }, [username, user.id]);

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
    loadCategories()
      .then((data) => {
        setCategories(data);
        //console.log(user.id);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });
    loadLocations()
      .then((data) => {
        setLocations(data);
        //console.log(user.id);
      })
      .catch((error) => {
        console.error("Error loading locations:", error);
      });
    loadListMostBlogFrequency()
      .then((data) => {
        setHotJobs(data);
        //console.log(user.id);
      })
      .catch((error) => {
        console.error("Error loading hotJobs:", error);
      });
    loadListCategoriesNBlogsRelated()
      .then((data) => {
        setCategoriesNBlogs(data);
        //console.log(user.id);
      })
      .catch((error) => {
        console.error("Error loading hotJobs:", error);
      });

    loadListMostBlogFrequency()
      .then((data) => {
        setHotJobs(data);
        //console.log(user.id);
      })
      .catch((error) => {
        console.error("Error loading hotJobs:", error);
      });

    loadNewestBlogs()
      .then((data) => {
        setMewestBlogs(data);
        //console.log(data);
      })
      .catch((error) => {
        console.error("Error loading hotJobs:", error);
      });

    loadHighSalaryBlogs()
      .then((data) => {
        setHighSalaryBlogs(data);
        //console.log(data);
      })
      .catch((error) => {
        console.error("Error loading hotJobs:", error);
      });

    loadOutStandingRecruitments()
      .then((data) => {
        setOutStandingRecruitment(data);
        //console.log(data);
      })
      .catch((error) => {
        console.error("Error loading hotJobs:", error);
      });
  }, []);

  const groupedBlogs = hotJobs.reduce((result, blog, index) => {
    const chunkIndex = Math.floor(index / 3);
    if (!result[chunkIndex]) {
      result[chunkIndex] = [];
    }
    result[chunkIndex].push(blog);
    return result;
  }, []);

  const groupedCategories = categoriesNBlogs.reduce(
    (result, category, index) => {
      const chunkIndex = Math.floor(index / 6);
      if (!result[chunkIndex]) {
        result[chunkIndex] = [];
      }
      result[chunkIndex].push(category);
      return result;
    },
    []
  );

  const groupedOutStandingRecruitments = outStandingRecruitment.reduce(
    (result, category, index) => {
      const chunkIndex = Math.floor(index / 6);
      if (!result[chunkIndex]) {
        result[chunkIndex] = [];
      }
      result[chunkIndex].push(category);
      return result;
    },
    []
  );

  // NewestBlogs
  const handleNewestBlogsChangePage = (page) => {
    setCurrentNewestPage(page);
  };
  const [currentNewestPage, setCurrentNewestPage] = useState(1);
  const pageSize = 12;
  const startNewestBlogsIndex = (currentNewestPage - 1) * pageSize;
  const endNewestBlogsIndex = startNewestBlogsIndex + pageSize;
  const currentNewBlogs = newestBlogs.slice(
    startNewestBlogsIndex,
    endNewestBlogsIndex
  );

  // HighSalary
  const handleHighSalaryBlogsChangePage = (page) => {
    setCurrentHighlaryPage(page);
  };
  const [currentHighSalaryPage, setCurrentHighlaryPage] = useState(1);
  const startNHighSalaryIndex = (currentHighSalaryPage - 1) * pageSize;
  const endHighSalaryIndex = startNHighSalaryIndex + pageSize;
  const currentHighSalaryBlogs = highSalaryBlogs.slice(
    startNHighSalaryIndex,
    endHighSalaryIndex
  );

  return (
    <>
      <Navbar></Navbar>

      <div style={container}>
        <div style={containerStyle}>
          <div style={searchNSliderContainer}>
            <div style={searchContainer}>
              <div style={inputButtonContainerStyle}>
                <Input
                  placeholder="Nhập tên công việc"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  style={inputStyle}
                />
                <Button
                  type="primary"
                  style={{ backgroundColor: "#FF6F4E" }}
                  onClick={handleSearch}
                >
                  Tìm kiếm
                </Button>
              </div>
              <div style={selectContainerStyle}>
                <Select
                  showSearch
                  placeholder="Chọn ngành nghề"
                  style={selectStyle}
                  value={industry}
                  onChange={(value) => setIndustry(value)}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
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
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="">Chọn tỉnh thành</Option>
                  {locations.map((location) => (
                    <Option key={location.id} value={location.id}>
                      {location.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            <div style={sliderContainer}>
              <Carousel
                showArrows={true}
                showThumbs={false}
                dots={false}
                slidesToShow={1}
                slidesToScroll={1}
                autoplay
                autoplaySpeed={5000}
              >
                {groupedBlogs.map((blogGroup, index) => (
                  <div key={index}>
                    <h3 style={{ color: "#fff" }}>Tin tuyển dụng nổi bật</h3>
                    <Row gutter={16}>
                      {blogGroup.map((blog) => (
                        <Col span={8} key={blog.id}>
                          <HoverableCard
                            style={{ display: "flex", height: "216px" }}
                            onClick={() => handleViewClick(blog)}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "row",
                              }}
                            >
                              <div
                                style={{ marginRight: "30px", flexShrink: 0 }}
                              >
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
                                  fontSize: "13px",
                                }}
                              >
                                {/* Thẻ p */}
                                <h4 style={{ margin: 0 }}>
                                  {blog.personalDetail.name}
                                </h4>
                              </div>
                            </div>

                            <div style={{ flex: 1 }}>
                              <h3>{blog.title}</h3>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <p>
                                  <EnvironmentOutlined />{" "}
                                  {blog.location ? blog.location.name : ""}
                                </p>
                                <p>
                                  <DollarOutlined /> {blog.salaryMin} -{" "}
                                  {blog.salaryMax} {"Triệu đồng"}
                                </p>
                              </div>
                            </div>
                          </HoverableCard>
                        </Col>
                      ))}
                    </Row>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
          <div style={categoriesListContainer}>
            <Carousel autoplay dots={true} arrows={true} autoplaySpeed={5000}>
              {groupedCategories.map((categoryGroup, index) => (
                <div key={index}>
                  <Row gutter={16}>
                    {categoryGroup.map((category) => (
                      <Col span={4} key={category.id}>
                        <Link
                          to={{
                            pathname: `/${category.slug}`,
                          }}
                        >
                          <HoverableCard>
                            <strong>{category.name}</strong>
                            <p>
                              Số tin tuyển dụng:{" "}
                              {category.blogIncludedPersonalDetailDTOs.length}
                            </p>
                          </HoverableCard>
                        </Link>
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
            </Carousel>
          </div>
          <div style={newestBlogsContainer}>
            <Card
              title={
                <span style={{ color: "#100b64" }}>NHÀ TUYỂN DỤNG NỔI BẬT</span>
              }
            >
              <Carousel autoplay dots={true} arrows={true} autoplaySpeed={5000}>
                {groupedOutStandingRecruitments.map(
                  (recruitmentGroup, index) => (
                    <div key={index}>
                      <Row gutter={16}>
                        {recruitmentGroup.map((recruitment) => (
                          <Col span={4} key={recruitment.id}>
                            <Link
                              to={{
                                pathname: `/companies/${recruitment.slug}`,
                              }}
                            >
                              <HoverableCard style={{height: "216px"}}>
                                <Image
                                   style={{
                                    width: "80px",
                                    height: "60px",
                                    objectFit: "cover",
                                  }}
                                  src={`http://localhost:8080/api/files/${recruitment.avatar}`}
                                  alt={recruitment.name}
                                />
                                <div>
                                  <strong>{recruitment.name}</strong>
                                  <p>
                                    Số tin tuyển dụng: {recruitment.blogsCount}
                                  </p>
                                </div>
                              </HoverableCard>
                            </Link>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )
                )}
              </Carousel>
            </Card>
          </div>
          <div style={newestBlogsContainer}>
            <Card
              title={<span style={{ color: "#100b64" }}>VIỆC LÀM MỚI ĐANG TUYỂN</span>}
            >
              <Row gutter={16}>
                {currentNewBlogs.map((blog) => (
                  <Col span={6} key={blog.id}>
                    <HoverableCard
                      style={{ display: "flex", height: "216px" }}
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
                              height: "60px",
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
                        <h3>{blog.title}</h3>
                        <p>{blog.name}</p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <p>
                            <EnvironmentOutlined />{" "}
                            {blog.location ? blog.location.name : ""}
                          </p>
                          <p>
                            <DollarOutlined /> {blog.salaryMin} -{" "}
                            {blog.salaryMax} {"Triệu đồng"}
                          </p>
                        </div>
                      </div>
                    </HoverableCard>
                  </Col>
                ))}
              </Row>
            </Card>
            <Pagination
              current={currentNewestPage}
              total={newestBlogs.length}
              pageSize={pageSize}
              onChange={handleNewestBlogsChangePage}
            />
          </div>
          <div style={newestBlogsContainer}>
            <Card
              title={<span style={{ color: "#100b64" }}>CÔNG VIỆC LƯƠNG CAO</span>}
            >
              <Row gutter={16}>
                {currentHighSalaryBlogs.map((blog) => (
                  <Col span={6} key={blog.id}>
                    <HoverableCard
                      style={{ display: "flex", height: "216px" }}
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
                              height: "60px",
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
                        <h3>{blog.title}</h3>
                        <p>{blog.name}</p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <p>
                            <EnvironmentOutlined />{" "}
                            {blog.location ? blog.location.name : ""}
                          </p>
                          <p>
                            <DollarOutlined /> {blog.salaryMin} -{" "}
                            {blog.salaryMax} {"Triệu đồng"}
                          </p>
                        </div>
                      </div>
                    </HoverableCard>
                  </Col>
                ))}
              </Row>
            </Card>
            <Pagination
              current={currentHighSalaryPage}
              total={highSalaryBlogs.length}
              pageSize={pageSize}
              onChange={handleHighSalaryBlogsChangePage}
            />
          </div>
        </div>

        <Footer></Footer>
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
