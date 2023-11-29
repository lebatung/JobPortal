import { Button, Card, Col, Modal, Row, Select, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import { format } from 'date-fns';
import {
  request,
  loadAppliedByUsernameApplied,
  loadPersonalDetail,
  loadPersonalDetailByUsername,
  loadUserByUsername,
  loadBlogById,
  loadApplyListByUsernameStatus,
} from "../../../../../helpers/axios_helper";

import ViewBlog from "./ViewBlog";

import { useAuth } from "../../../../../contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import SearchComponents from "../../recruitmentComponents/SearchComponent";
import Icon from "@ant-design/icons/lib/components/Icon";
export default function BlogsAppliedManagement() {
  const { username } = useAuth();

  const [loading, setLoading] = useState(false);
  const [floading, setFloading] = useState(false);
  const [blogOwner, setBlogOwner] = useState("");
  const [pdfSrc, setPdfSrc] = useState(null);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [personalDetailId, setPersonalDetailId] = useState("");
  const [blogOwnerDetail, setBlogOwnerDetail] = useState([]);
  const [blog, setBlog] = useState("");
  const [user, setUser] = useState({
    id: "",
  });
  const [isBlogOwnerDetailLoaded, setIsBlogOwnerDetailLoaded] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);

  const [applied, setApplied] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [appliedCandidate, setAppliedCandidate] = useState([]);
  const [InterviewingCandidate, setInterviewingCandidate] = useState([]);
  const [rejectedCandidate, setRejectedCandidate] = useState([]);

  const [appliesCount, setAppliesCount] = useState({});

  const cardData = [
    {
      status: "Đã ứng tuyển",
      iconType: "pause-circle",
      imageSrc: `http://localhost:8080/api/files/appliedRaw.png`,
      data: appliedCandidate.length,
      textColor: "#2D898B",
    },
    {
      status: "Đã phản hồi",
      iconType: "clock-circle",
      imageSrc: `http://localhost:8080/api/files/interviewing.jpg`,
      data: InterviewingCandidate.length,
      textColor: "#C1DFF0",
    },
    {
      status: "Từ chối",
      iconType: "clock-circle",
      imageSrc: `http://localhost:8080/api/files/rejected.png`,
      data: rejectedCandidate.length,
      textColor: "#C1DFF0",
    },
  ];

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
      loadAppliedByUsernameApplied(username)
        .then((data) => {
          setApplied(data.reverse());
          //console.log(data);
        })
        .catch((error) => {
          console.error(
            "Error loading loadFavoriteBlogsByPersonalDetailId:",
            error
          );
        });
      loadUserByUsername(username)
        .then((data) => {
          setUser(data.id);
          //console.log(data);
        })
        .catch((error) => {
          console.error(
            "Error loading loadFavoriteBlogsByPersonalDetailId:",
            error
          );
        });
      loadApplyListByUsernameStatus(username)
        .then((data) => {
          setAppliedCandidate(data.applied);
          setInterviewingCandidate(data.interviewing);
          setRejectedCandidate(data.rejected);
          console.log(data);
        })
        .catch((error) => {
          console.error("Error loading loadPersonalDetail:", error);
        });
    }
  }, [username]);

  useEffect(() => {
    console.log("blogOwner", blogOwner);
    if (blogOwner) {
      loadPersonalDetail(blogOwner)
        .then((data) => {
          setBlogOwnerDetail(data);
          setIsBlogOwnerDetailLoaded(true);
          console.log(data);
        })
        .catch((error) => {
          console.error("Error loading loadPersonalDetail:", error);
        });
    }
  }, [blogOwner]);

  const handleViewPDF = (file) => {
    console.log("file", file);
    const pdfURL = `http://localhost:8080/api/files/loadPDF/${file}`;
    console.log("pdfURL", pdfURL);
    setLoading(true);
    setPdfSrc(pdfURL);
    setLoading(false);
    setVisible(true);
  };

  const handleCloseModal = () => {
    setVisible(false);
    setPdfSrc(null);
  };

  const loadBlogOwnerDetail = (blogOwnerId) => {
    loadPersonalDetail(blogOwnerId)
      .then((data) => {
        setBlogOwnerDetail(data);
        setIsBlogOwnerDetailLoaded(true);
        //console.log(data);
      })
      .catch((error) => {
        console.error("Error loading loadPersonalDetail:", error);
      });
  };

  const handleViewClick = (record) => {
    if (floading) {
      return;
    }
    console.log(
      "blogIncludedPersonalDetailDTO",
      record.blogIncludedPersonalDetailDTO
    );
    setSelectedBlogId(record.blogIncludedPersonalDetailDTO);

    setIsViewModalVisible(true);
  };
  const { Option } = Select;
  const [numPage, setNumpages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const [filterOption, setFilterOption] = useState(null);

  function onDocumentLoadSuccess({ numPage }) {
    setNumpages(numPage);
    setPageNumber(1);
  }

  const performSearch = (searchTerm) => {
    if (!filterOption) {
      // Nếu không có lọc, thực hiện tìm kiếm bình thường
      const filteredUsers = applied.filter((blog) =>
        applied.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredUsers);
    } else {
      // Nếu có lọc, sử dụng phương thức handleFilter để lọc dữ liệu
      handleFilter();
    }
  };
  const [showNoResults, setShowNoResults] = useState(false);
  const handleFilter = () => {
    if (filterOption !== null) {
      const filteredApplied = applied.filter(
        (apply) => apply.status === filterOption
      );
      setSearchResults(filteredApplied);
      setShowNoResults(filteredApplied.length === 0);
    } else {
      setSearchResults(applied);
      setShowNoResults(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Row gutter={1}>
          {cardData.map((data, index) => (
            <Col span={8} key={index}>
              <Card
                style={{
                  margin: "5px",
                  borderRadius: "5px",
                  border: "1px solid grey",
                  height: "135px",
                  width: "270px",
                }}
              >
                <Row>
                  <Col span={12}>
                    <div style={{ flex: 1 }}>
                      <img
                        src={data.imageSrc}
                        alt={data.status}
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: "center", marginLeft: "10px" }}>
                      <Icon
                        type={data.iconType}
                        style={{ fontSize: "24px", marginRight: "8px" }}
                      />
                      <h3 style={{ display: "inline" }}>{data.status}</h3>
                      <h4>{data.data}</h4>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <div
        style={{
          marginBottom: 10,
          marginTop: 5,
          marginLeft: 5,
          marginRight: 5,
          display: "flex",
          alignItems: "center",
        }}
      >
        <SearchComponents onSearch={performSearch} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "350px",
          }}
        >
          <div>
            <Select
              value={filterOption}
              style={{
                width: 200,
                marginRight: 10,
                border: "1px solid grey",
                borderRadius: "5px",
              }}
              onChange={(value) => setFilterOption(value)}
              placeholder="Chọn loại tin tuyển dụng"
            >
              <Option value={null}>Tất cả</Option>
              <Option value={0}>Đã ứng tuyển</Option>
              <Option value={1}>Đã phản hồi</Option>
              <Option value={2}>Từ chối</Option>
            </Select>
            <Button type="primary" onClick={handleFilter}>
              Lọc
            </Button>
          </div>
        </div>
      </div>
      <Table
        dataSource={
          showNoResults
            ? []
            : searchResults.length > 0
            ? searchResults
            : applied
        }
        locale={{
          emptyText: showNoResults ? "Không có kết quả" : "Không có dữ liệu",
        }}
        columns={[
          {
            title: "STT",
            dataIndex: "rowNumber",
            key: "rowNumber",
            render: (text, record, index) => index + 1,
          },
          {
            title: "Thời điểm ứng tuyển",
            dataIndex: "appliedAt",
            key: "appliedAt",
            render: (text) => {
              // Định dạng lại ngày tháng
              const formattedDate = text
                ? format(new Date(text), "dd/MM/yyyy HH:mm:ss")
                : "Chưa cập nhật";

              return <span>{formattedDate}</span>;
            },
          },
          {
            title: "Vị trí công việc",
            dataIndex: "blogIncludedPersonalDetailDTO.title",
            key: "position",
            render: (text, record) => (
              <span>
                {record.blogIncludedPersonalDetailDTO &&
                record.blogIncludedPersonalDetailDTO.title
                  ? record.blogIncludedPersonalDetailDTO.title
                  : "N/A"}
              </span>
            ),
          },
          {
            title: "Tên công ty",
            dataIndex: "blogIncludedPersonalDetailDTO.personalDetail.name",
            key: "companyName",
            render: (text, record) => (
              <span>
                {record.blogIncludedPersonalDetailDTO &&
                record.blogIncludedPersonalDetailDTO.personalDetail
                  ? record.blogIncludedPersonalDetailDTO.personalDetail.name
                  : "N/A"}
              </span>
            ),
          },

          {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => (
              <Tag
                color={status === 0 ? "green" : status === 1 ? "blue" : "red"}
              >
                {status === 0
                  ? "Đã ứng tuyển"
                  : status === 1
                  ? "Đã phản hồi"
                  : "Từ chối"}
              </Tag>
            ),
          },
          {
            title: "Tệp dính kèm",
            dataIndex: "filesData",
            key: "filesData",
            render: (filesData) => (
              <ul>
                {filesData.map((file, index) => (
                  <li key={index}>
                    {file}
                    <Button type="link" onClick={() => handleViewPDF(file)}>
                      View PDF
                    </Button>
                  </li>
                ))}
              </ul>
            ),
          },
          {
            title: "Xem tin tuyển dụng",
            dataIndex: "ViewBlog",
            key: "ViewBlog",
            render: (text, record) => (
              <Button
                type="primary"
                onClick={() => handleViewClick(record)} // Gọi hàm handleViewBlog khi nút được nhấn
              >
                View
              </Button>
            ),
          },
        ]}
      />
      <Modal
        visible={visible}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
      >
        {loading ? (
          <p>Loading...</p>
        ) : (
          pdfSrc && (
            <Document file={pdfSrc} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} />
            </Document>
          )
        )}
      </Modal>
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
        {selectedBlogId && (
          <ViewBlog
            selectedBlogId={selectedBlogId}
            handleViewClick={handleViewClick}
          />
        )}
      </Modal>
    </>
  );
}
