import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input} from 'antd';

import CityDropdown from './NavbarComponents/CityDropdown'; 

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm, location);
  };

  const cities = ['Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hue', 'Can Tho'];

  const handleSelectedCities = (selectedCities) => {
    console.log('Selected cities:', selectedCities);
  };



  const searchBarContainer = {
    paddingTop: "35px",
    display: "flex",
    width: "80%",
    alignItem: "center",
  };
  return (
    <div style={searchBarContainer} >
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search jobs..."
      />
      {/* <Input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location..."
      /> */}
      <CityDropdown cities={cities} onSelectCities={handleSelectedCities} />
      <Button icon={<SearchOutlined />}>Tìm kiếm</Button>
    </div>
  );
}

export default SearchBar;