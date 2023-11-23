import React, { useState } from 'react';
import { Button, Input } from "antd";

function SearchComponents({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState();

  const handleSearch = () => {
    // Thực hiện tìm kiếm dựa trên searchTerm và gọi hàm onSearch để truyền kết quả lên cấp cao hơn
    onSearch(searchTerm);
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Nếu người dùng nhấn phím "Enter", thực hiện tìm kiếm
      handleSearch();
    }
  };
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Input
        type="text"
        placeholder="Tìm kiếm..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{ width: 200, marginRight: 10, border: '0.5px solid grey', borderRadius: '5px', }}
        
      />
      <Button type='primary' onClick={handleSearch}>Tìm kiếm</Button>
    </div>
  );
}

export default SearchComponents;
