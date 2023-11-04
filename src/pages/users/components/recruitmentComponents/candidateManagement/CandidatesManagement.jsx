import React, { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

import SearchComponent from "../SearchComponent";
import { Button, Collapse, Modal, Space, Table, Tag } from "antd";
import { useAuth } from "../../../../../contexts/AuthContext";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import {
  request,
  loadUserByUsername,
  loadBlogsByUserId,
  loadAppliesByBlogId,
} from "../../../../../helpers/axios_helper";
import { CaretRightOutlined } from "@ant-design/icons";

const { Panel } = Collapse;
export default function CandidatesManagement() {
  const { username } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [applyData, setApplyData] = useState({});
  const [appliesCount, setAppliesCount] = useState({});

  const [blogExpandedRowKeys, setBlogExpandedRowKeys] = useState({});
  const [visible, setVisible] = useState(false);
  const [isProcessvisible, setIsProcessVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfSrc, setPdfSrc] = useState(null);
  const [selectedApplyId, setSelectedApplyId] = useState("");
  const [user, setUser] = useState({
    id: "",
    personalDetailId: "",
  });
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
  const performSearch = (searchTerm) => {
    const filteredUsers = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredUsers);
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

    loadBlogsByUserId(user.id)
      .then((data) => {
        setBlogs(data);
      })
      .catch((error) => {
        console.error("Error loading users:", error);
      });
  }, [user.id, username]);
  useEffect(() => {
    blogs.forEach((blog) => {
      loadAppliesByBlogId(blog.id)
        .then((data) => {
          setApplyData((prevData) => ({
            ...prevData,
            [blog.id]: data,
          }));
          
          setAppliesCount((prevCount) => ({
            ...prevCount,
            [blog.id]: data.length,
          }));
        })
        .catch((error) => {
          console.error("Error loading applies:", error);
        });
    });
  }, [blogs]);

  const [numPage, setNumpages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPage }) {
    setNumpages(numPage);
    setPageNumber(1);
  }

  const handleProcess = (record) =>{
    console.log(record.id);
    setSelectedApplyId(record.id)
    setIsProcessVisible(true);
  };
  return (
    <>
      <ToastContainer />
      <div
        style={{
          marginBottom: 10,
          marginTop: 10,
          marginLeft: 5,
          marginRight: 5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SearchComponent onSearch={performSearch} />
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
                              ? "Applied"
                              : status === 1
                              ? "Interviewing"
                              : "Rejected"}
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
                          <Button type="primary" onClick={() => handleProcess(record)}>
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
              <Page pageNumber={pageNumber} />
            </Document>
          )
        )}
      </Modal>
      <Modal
        visible={isProcessvisible}
        onCancel={handleCloseModal}
        footer={[
          <div style={{  display: "flex", justifyContent: "space-between",}}>
            <Button key="back" onClick={() => setIsProcessVisible(false)}>
            Close
          </Button>
          </div>
          
        ]}
      >
        hihi
      </Modal>
    </>
  );
}
