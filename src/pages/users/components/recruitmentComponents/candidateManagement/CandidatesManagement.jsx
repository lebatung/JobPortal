import React, { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import { format } from "date-fns";
import SearchComponent from "../SearchComponent";
import {
  Button,
  Col,
  Collapse,
  Descriptions,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { useAuth } from "../../../../../contexts/AuthContext";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import {
  request,
  loadUserByUsername,
  loadBlogsByUserId,
  loadAppliesByBlogId,
  loadBlogsByUserIdNEnable,
} from "../../../../../helpers/axios_helper";
import { CaretRightOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Panel } = Collapse;
export default function CandidatesManagement() {
  const { username, userId } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [applyData, setApplyData] = useState({});
  const [appliesCount, setAppliesCount] = useState({});

  const [blogExpandedRowKeys, setBlogExpandedRowKeys] = useState({});
  const [visible, setVisible] = useState(false);
  const [isProcessvisible, setIsProcessVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfSrc, setPdfSrc] = useState(null);
  const [selectedApplyId, setSelectedApplyId] = useState("");

  const [selectedOption, setSelectedOption] = useState("");
  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [user, setUser] = useState({
    id: "",
    personalDetailId: "",
  });
  const [recipientUsername, setRecipientUsername] = useState("");
  const [recipientId, setRecipientId] = useState({
    id: "",
  });

  const [filterOption, setFilterOption] = useState(null);

  const columns = [
    {
      title: "STT",
      dataIndex: "rowNumber",
      key: "rowNumber",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tin tuyển dụng",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "ứng viên",
      dataIndex: "id",
      key: "appliesCount",
      render: (text, record) => {
        const count = appliesCount[record.id] || 0;
        return count;
      },
    },
  ];

  const [searchResults, setSearchResults] = useState([]);
  // const performSearch = (searchTerm) => {
  //   const filteredUsers = blogs.filter((blog) =>
  //     blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setSearchResults(filteredUsers);
  // };
  const performSearch = (searchTerm) => {
    if (!filterOption) {
      // Nếu không có lọc, thực hiện tìm kiếm bình thường
      const filteredUsers = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredUsers);
    } else {
      // Nếu có lọc, sử dụng phương thức handleFilter để lọc dữ liệu
      handleFilter();
    }
  };

  const handleExpand = (record) => {
    const currentExpandedRowKeys = blogExpandedRowKeys[record.id] || [];
    if (!currentExpandedRowKeys.includes(record.id)) {
      currentExpandedRowKeys.push(record.id);
    }
    setBlogExpandedRowKeys({
      ...blogExpandedRowKeys,
      [record.id]: currentExpandedRowKeys,
    });
  };

  const handleCollapse = (record) => {
    const currentExpandedRowKeys = blogExpandedRowKeys[record.id] || [];
    const updatedExpandedRowKeys = currentExpandedRowKeys.filter(
      (key) => key !== record.id
    );
    setBlogExpandedRowKeys({
      ...blogExpandedRowKeys,
      [record.id]: updatedExpandedRowKeys,
    });
  };

  const loadAppliesForBlog = (blogId) => {
    loadAppliesByBlogId(blogId)
      .then((data) => {
        setApplyData((prevData) => ({
          ...prevData,
          [blogId]: data,
        }));
      })
      .catch((error) => {
        console.error("Error loading applies:", error);
      });
  };

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
    setIsProcessVisible(false);
  };

  useEffect(() => {
    loadUserByUsername(username)
      .then((data) => {
        setUser(data);
        //console.log(user.id);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });
    loadUserByUsername(recipientUsername)
      .then((data) => {
        setRecipientId(data);
        //console.log(data.id);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });

    loadBlogsByUserIdNEnable(userId)
      .then((data) => {
        setBlogs(data);
      })
      .catch((error) => {
        console.error("Error loading users:", error);
      });
  }, [user.id, username, recipientUsername]);
  useEffect(() => {
    blogs.forEach((blog) => {
      loadAppliesByBlogId(blog.id)
        .then((data) => {
          // Đảo ngược mảng trả về từ hàm loadAppliesByBlogId
          const reversedData = [...data].reverse();

          setApplyData((prevData) => ({
            ...prevData,
            [blog.id]: reversedData,
          }));

          setAppliesCount((prevCount) => ({
            ...prevCount,
            [blog.id]: reversedData.length,
          }));
        })
        .catch((error) => {
          console.error("Error loading applies:", error);
        });
    });
  }, [blogs]);

  const handleFilter = () => {
    if (filterOption === "all") {
      // Hiển thị tất cả blogs
      setSearchResults(blogs);
    } else if (filterOption === "hasCandidates") {
      const filteredBlogs = blogs.filter((blog) => appliesCount[blog.id] > 0);
      setSearchResults(filteredBlogs);
    } else if (filterOption === "noCandidates") {
      const filteredBlogs = blogs.filter(
        (blog) => !appliesCount[blog.id] || appliesCount[blog.id] === 0
      );
      setSearchResults(filteredBlogs);
    } else {
      // Nếu không có lọc, hiển thị tất cả blogs
      setSearchResults([]);
    }
  };

  const [numPages, setNumpages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumpages(numPages);
    setPageNumber(1);
  }

  const handleProcess = (record) => {
    console.log(record.id);
    setSelectedApplyId(record.id);
    setIsProcessVisible(true);
    setRecipientUsername(record.userApplied);
  };

  const handleConfirm = () => {
    // console.log("selectedApplyId", selectedApplyId);
    // console.log("selectedOption",selectedOption);
    // console.log("messageTitle",messageTitle);
    // console.log("messageContent",messageContent);
    // Tạo form data chứa selectedApplyId và selectedOption

    if (!messageTitle || !messageContent) {
      toast.error("Vui lòng nhập tiêu đề và nội dung tin nhắn phản hồi!");
      console.log("Vui lòng nhập tiêu đề và nội dung!");
      return;
    }

    const formDataApply = {
      id: selectedApplyId,
      status: selectedOption,
    };
    console.log(formDataApply);

    const formDataMessage = {
      userId: user.id,
      recipientId: recipientId.id,
      conversationName: messageTitle,
      messageContent: messageContent,
    };
    console.log(formDataMessage);

    request(
      "put",
      "http://localhost:8080/api/apply/changeStatus",
      formDataApply
    )
      .then((response) => {
        const formDataMessage = new FormData();
        formDataMessage.append("userId", user.id);
        formDataMessage.append("conversationName", messageTitle);
        formDataMessage.append("messageContent", messageContent);
        formDataMessage.append("recipientId", recipientId.id);
        return request(
          "post",
          "http://localhost:8080/api/messages/create",
          formDataMessage
        );
      })
      .then((response) => {
        toast.success("Phản hồi đến người dùng thành công!");
        setIsProcessVisible(true);
      })
      .catch((error) => {
        toast.error("Phản hồi thất bại!");
      });
  };
  return (
    <>
      <ToastContainer />
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
        <SearchComponent onSearch={performSearch} />
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
              <Option value="all">Tất cả</Option>
              <Option value="hasCandidates">Có ứng viên ứng tuyển</Option>
              <Option value="noCandidates">Không có ứng viên ứng tuyển</Option>
            </Select>
            <Button type="primary" onClick={handleFilter}>
              Lọc
            </Button>
          </div>
        </div>
      </div>
      <Table
        dataSource={searchResults.length > 0 ? searchResults : blogs}
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <Collapse
              bordered={false}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined
                  rotate={
                    blogExpandedRowKeys[record.id]?.includes(record.id) ? 90 : 0
                  }
                />
              )}
            >
              <Panel header="Danh sách ứng viên" key={record.id}>
                {applyData[record.id] ? (
                  <Table
                    dataSource={applyData[record.id]}
                    pagination={false}
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
                        title: "Trạng thái",
                        dataIndex: "status",
                        key: "status",
                        render: (status) => (
                          <Tag
                            color={
                              status === 0
                                ? "green"
                                : status === 1
                                ? "blue"
                                : "red"
                            }
                          >
                            {status === 0
                              ? "Ứng tuyển"
                              : status === 1
                              ? "Phỏng vấn"
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
                                <Button
                                  type="link"
                                  onClick={() => handleViewPDF(file)}
                                >
                                  View PDF
                                </Button>

                                <a
                                  href={`http://localhost:8080/api/files/loadPDF/${file}`}
                                  download="file.pdf"
                                >
                                  <Button type="link">Download</Button>
                                </a>
                              </li>
                            ))}
                          </ul>
                        ),
                      },
                      {
                        title: "Xử lí",
                        dataIndex: "process",
                        key: "process",
                        render: (text, record) => (
                          <Button
                            type="primary"
                            onClick={() => handleProcess(record)}
                          >
                            Xử lí
                          </Button>
                        ),
                      },
                    ]}
                  />
                ) : (
                  <p>Chưa có danh sách ứng viên</p>
                )}
              </Panel>
            </Collapse>
          ),
        }}
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
              {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
              ))}
            </Document>
          )
        )}
      </Modal>
      <Modal
        title={
          <span style={{ fontSize: "20px" }}>Phản hồi người ứng tuyển</span>
        }
        visible={isProcessvisible}
        onCancel={handleCloseModal}
        footer={[
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button key="back" onClick={() => setIsProcessVisible(false)}>
              Đóng
            </Button>
            <div>
              <Button key="confirm" type="primary" onClick={handleConfirm}>
                Xác nhận
              </Button>
            </div>
          </div>,
        ]}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Descriptions column={1}>
              <Descriptions.Item
                label="Trạng thái ứng tuyển"
                labelStyle={{ color: "black" }}
              >
                <Select
                  value={selectedOption}
                  style={{ width: "100%" }}
                  onChange={(value) => setSelectedOption(value)}
                >
                  <Option value={1}>Phỏng vấn</Option>
                  <Option value={2}>Từ chối</Option>
                </Select>
              </Descriptions.Item>
            </Descriptions>
            <Descriptions title="Message" column={1}>
              <Descriptions.Item
                label="Tiêu đề"
                labelStyle={{ color: "black" }}
                labelCol={{ span: 8 }}
              >
                <Input
                  placeholder="Message Title"
                  value={messageTitle}
                  onChange={(e) => setMessageTitle(e.target.value)}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label="Nội dung"
                labelStyle={{ color: "black" }}
                labelCol={{ span: 8 }}
              >
                <Input.TextArea
                  placeholder="Message Content"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                />
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Modal>
    </>
  );
}
