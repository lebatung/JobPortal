import React, { useEffect, useState } from "react";

import {
  loadFavoriteBlogsDTOByPersonalDetailId,
  loadPersonalDetailByUsername,
  loadPersonalDetail,
  request,
} from "../../../../../helpers/axios_helper";

import ViewBlog from "./ViewBlog"

import { useAuth } from "../../../../../contexts/AuthContext";
import { Button, Modal, Space, Table } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

export default function FavoritesManagement() {
  const { username } = useAuth();
  const [blogOwner, setBlogOwner] = useState(""); 
  const [personalDetailId, setPersonalDetailId] = useState("");
  const [favoriteBlogsList, setFavoriteBlogsList] = useState([]);
  const [floading, setFloading] = useState(false);

  const [isFavConfirmModalVisible, setIsFavConfirmModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [companyDetail, setCompanyDetail] = useState([]);

  const [selectedFavoriteId, setSelectedFavoriteId] = useState("");

  const loadFavoriteBlogs = () => {
    loadFavoriteBlogsDTOByPersonalDetailId(personalDetailId)
      .then((data) => {
        setFavoriteBlogsList(data);
        setBlogOwner(data.blog.userId);
        console.log("blogOwner", blogOwner);
      })
      .catch((error) => {
        console.error("Error loading loadFavoriteBlogsDTOByPersonalDetailId:", error);
      });
  };

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
  }, [username]);
  useEffect(() => {
    console.log("personaldetailID", personalDetailId);
    // loadPersonalDetail(personalDetailId)
    //     .then((data) => {
    //       setFavoriteBlogsList(data);
    //       console.log(data);
    //     })
    //     .catch((error) => {
    //       console.error(
    //         "Error loading loadPersonalDetail:",
    //         error
    //       );
    //     });
    if (personalDetailId) {
      loadFavoriteBlogsDTOByPersonalDetailId(personalDetailId)
        .then((data) => {
          setFavoriteBlogsList(data);
          console.log(data);
        })
        .catch((error) => {
          console.error(
            "Error loading loadFavoriteBlogsByPersonalDetailId:",
            error
          );
        });
    }
  }, [personalDetailId]);


  const handleViewClick = (blog) => {
    if (floading) {
      return;
    }
    console.log("blogId", blog.id);
    setSelectedBlogId(blog.id);

    console.log("blogOwner", blog.userId);
    setBlogOwner(blog.userId);

    setIsViewModalVisible(true);
  };
  
  const handleUnFavoriteClick = (favoriteId) => {
    //console.log(favoriteId);
    setSelectedFavoriteId(favoriteId);
    setIsFavConfirmModalVisible(true);
  };
  const handleUnFavorite = () => {
    console.log(selectedFavoriteId);
    request("DELETE", `http://localhost:8080/api/favorites/${selectedFavoriteId}`)
      .then((response) => {
        console.log("Removed", selectedFavoriteId);
        
        loadFavoriteBlogs();
      })
      .catch((error) => {
        console.error("Error removal favorite:", error);
      });
      setIsFavConfirmModalVisible(false);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "rowNumber",
      key: "rowNumber",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Title",
      dataIndex: ["blog", "title"],
      key: "title",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleViewClick(record.blog)}>
            View
          </Button>
          {favoriteBlogsList.some(
            (favorite) => favorite.blog.id === record.blog.id
          ) ? (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                const favoriteItem = favoriteBlogsList.find(
                  (fav) => fav.blog.id === record.blog.id
                );
                if (favoriteItem) {
                  const favoriteId = favoriteItem.id;
                  handleUnFavoriteClick(favoriteId);
                }
              }}
              style={{
                marginRight: 8,
                color: "#ff1800",
              }}
            >
              <HeartFilled />
              Đã lưu tin
            </Button>
          ) : (
            null
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={favoriteBlogsList} />
      <Modal
        title={"Confirm Deleting"}
        visible={isFavConfirmModalVisible}
        onOk={handleUnFavorite}
        onCancel={() => setIsFavConfirmModalVisible(false)}
      >
        Are you sure you want to {"unfavorite"} this blog?
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
            blogOwner={blogOwner}
            favoriteBlogsList={favoriteBlogsList}
            handleViewClick={handleViewClick}
            handleUnFavoriteClick={handleUnFavoriteClick}
          />
        )}
      </Modal>
    </>
  );
}
