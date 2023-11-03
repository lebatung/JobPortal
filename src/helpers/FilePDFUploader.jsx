import React, { useState } from "react";
import axios from "axios";

const FilePDFUploader = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    setFiles(selectedFiles);
    //console.log(files);
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

      setFiles([]); // Xóa danh sách tệp sau khi tải lên thành công

      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }

      console.log("Upload successful:", response.data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    
    </div>
  );
};

export default FilePDFUploader;
