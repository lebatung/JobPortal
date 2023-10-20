// ForbiddenPage.js
import React from 'react';

import { useNavigate } from 'react-router-dom';

function ForbiddenPage() {
  
  const navigate = useNavigate();

  const handleButtonClick = () => {
    // Sử dụng navigate để điều hướng đến một trang khác
    navigate('/');
  };
  return (
    <div>
      <h1>FORBIDDEN</h1>
      <p>Bạn không có quyền truy cập vào trang này.</p>
      <button onClick={handleButtonClick}>Điều hướng đến trang khác</button>
    </div>
  );
}

export default ForbiddenPage;
