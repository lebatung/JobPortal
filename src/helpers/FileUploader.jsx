import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const FileUploader = ({ onUploadSuccess }) => { 
  const [avatarUrl, setAvatarUrl] = useState(''); 

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length !== 1) {
      console.log('Chỉ được phép chọn một tệp duy nhất.');
      return;
    }

    const file = acceptedFiles[0];

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/files/uploadAvatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAvatarUrl(response.data);

      onUploadSuccess(response.data);

      console.log('Upload successful:', response.data);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const dropzoneStyle = {
    border: '2px dashed #ccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
  };

  const activeStyle = {
    backgroundColor: '#f5f5f5',
    border: '2px dashed #aaa',
  };

  return (
    <div {...getRootProps()} style={{ ...dropzoneStyle, ...(isDragActive ? activeStyle : {}) }}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Thả tệp vào đây...</p>
      ) : (
        <p>Kéo và thả tệp hoặc nhấp để chọn</p>
      )}

      {/* Hiển thị hình ảnh avatar sau khi tải lên thành công */}
      
    </div>
  );
};

export default FileUploader;
