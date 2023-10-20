import React, { useState } from 'react';

function CityDropdownInput({ cities }) {
  const [selectedCities, setSelectedCities] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleCityCheckboxChange = (event) => {
    const cityName = event.target.value;
    if (event.target.checked) {
      setSelectedCities([...selectedCities, cityName]);
    } else {
      setSelectedCities(selectedCities.filter(city => city !== cityName));
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleDropdownSelect = () => {
    setInputValue(selectedCities.join(', '));
  };

  return (
    <div>
      <div>
        {cities.map(city => (
          <label key={city}>
            <input
              type="checkbox"
              value={city}
              checked={selectedCities.includes(city)}
              onChange={handleCityCheckboxChange}
            />
            {city}
          </label>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Selected cities"
        />
        <button onClick={handleDropdownSelect}>Select</button>
      </div>
    </div>
  );
}

export default CityDropdownInput;
