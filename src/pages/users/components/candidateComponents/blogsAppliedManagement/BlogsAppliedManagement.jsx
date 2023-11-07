import { Button, Modal, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import {
  request,
  loadAppliedByUsernameApplied,
  loadPersonalDetail,
  loadPersonalDetailByUsername,
  loadUserByUsername,
  loadBlogById,
} from "../../../../../helpers/axios_helper";

import ViewBlog from "./ViewBlog";

import { useAuth } from "../../../../../contexts/AuthContext";
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
          setApplied(data);
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
  const loadBlogByBlogId = (blogId) => {
    loadBlogById(blogId)
      .then((data) => {
        setBlog(data);
        setBlogOwner(data.userId);

        // Sau khi lấy dữ liệu blog, gọi hàm để lấy thông tin của chủ blog
        loadBlogOwnerDetail(data.userId);
      })
      .catch((error) => {
        console.error(
          "Error loading loadFavoriteBlogsDTOByPersonalDetailId:",
          error
        );
      });
  };
  const handleViewClick = (record) => {
    if (floading) {
      return;
    }
    console.log("blogId", record.id);
    setSelectedBlogId(record.id);

    // Gọi hàm để lấy thông tin blog dựa trên ID
    loadBlogByBlogId(record.id);
    setIsViewModalVisible(true);
  };

  const [numPage, setNumpages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPage }) {
    setNumpages(numPage);
    setPageNumber(1);
  }
  return (
    <>
      <Table
        dataSource={applied}
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
                color={status === 0 ? "green" : status === 1 ? "blue" : "red"}
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
            dataIndex: "appliedAt",
            key: "appliedAt",
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
        visible={isViewModalVisible && isBlogOwnerDetailLoaded}
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
            blogOwnerDetail={blogOwnerDetail}
            handleViewClick={handleViewClick}
          />
        )}
      </Modal>
    </>
  );
}
