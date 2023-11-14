import React, { useEffect, useState } from "react";
import { Button, Divider, Typography } from "antd";
import axios from "axios";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { request } from "../../../helpers/axios_helper";
import { useAuth } from "../../../contexts/AuthContext";
const { Paragraph } = Typography;

export default function Apply(props) {
  const appliedBlogId = props.appliedBlogId;

  const [files, setFiles] = useState([]);
  const [filesData, setFilesData] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    setFiles(selectedFiles);
  };

  const { username } = useAuth();

  // Storing Interaction between user_id and blog_id
  const { isAuthenticated, userId } = useAuth();
  const saveUserInteraction = async (appliedBlogId) => {
    try {
      if (isAuthenticated) {
        const interactionData = {
          userId: userId,
          blogId: appliedBlogId,
          interactionType: "APPLY",
        };

        const response = await request(
          "POST",
          "/api/user-interactions/create",
          interactionData
        );
        console.log(response.data);
        console.log("APPLY INTERACTION", interactionData);
      } else {
        console.log("User is not authenticated. Please log in.");
      }
    } catch (error) {
      console.error("Error saving user interaction:", error);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      console.log("Vui lòng chọn ít nhất một tệp.");
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const response = await axios.post("/api/files/uploadPdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Tạo requestData dựa trên giá trị mới nhất của filesData
      const requestData = {
        userApplied: username,
        blogId: appliedBlogId,
        cvId: null,
        filesData: response.data,
      };
      setFilesData(response.data);
      console.log("requestData", requestData);

      const result = await request("POST", "/api/apply/create", requestData);

      console.log("Apply result:", result.data);
      toast.success("Nộp hồ sơ ứng tuyển thành công!");
    } catch (error) {
      console.error("Upload failed:", error);
    }

    saveUserInteraction(appliedBlogId);
  };

  const bodyContainer = {
    margin: "0",
  };
  return (
    <>
      <div style={bodyContainer}>
        <Divider orientation="left"></Divider>
        <Paragraph style={{ margin: "20px" }}>
          <strong>Tải lên các tệp.</strong>
        </Paragraph>
        <Paragraph style={{ margin: "20px" }}>
          <input type="file" multiple onChange={handleFileChange} />
        </Paragraph>
        <Divider orientation="left"></Divider>
        <Paragraph style={{ textAlign: "right" }}>
          <Button 
          style={{ marginTop: "20px" }} 
          onClick={handleUpload}

          >
            Xác nhận
          </Button>
        </Paragraph>
      </div>
    </>
  );
}
