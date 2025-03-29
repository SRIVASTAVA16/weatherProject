import React, { useState } from 'react';
import axios from 'axios';

const Search = ({ setWeatherData, setError, updateRecentCities }) => {
  const [city, setCity] = useState('');

  const apiKey = '2d5e92a6b16bd4fc2c6f11f02beae075'; // My API key

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeatherData(response.data);
      updateRecentCities(city); 
      setError(null); 
    } catch (err) {
      setError('Failed to fetch weather data');
      setWeatherData(null);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default Search;
