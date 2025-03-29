import React, { useState, useEffect } from 'react';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [recentCities, setRecentCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [backgroundStyle, setBackgroundStyle] = useState({}); 

  useEffect(() => {
    updateBackgroundStyle(); 
  }, []);

  const fetchWeather = async () => {
    setErrorMessage('');
    setWeatherData(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2d5e92a6b16bd4fc2c6f11f02beae075&units=metric`
      );
      const data = await response.json();

      if (response.ok) {
        setWeatherData({
          city: data.name,
          temperature: data.main.temp,
          windSpeed: data.wind.speed,
          humidity: data.main.humidity,
          weather: data.weather[0].description,
        });
        updateRecentCities(city);
        setErrorMessage('');
      } else {
        setErrorMessage('City not found. Please check the city name and try again.');
      }
    } catch (error) {
      setErrorMessage('Failed to fetch weather data. Please try again later.');
      console.error('Error fetching weather data:', error);
    }

    setIsLoading(false);
  };

  const updateRecentCities = (city) => {
    setRecentCities((prev) => {
      const updatedCities = [city, ...prev.filter(c => c !== city)];
      return updatedCities.slice(0, 5);
    });
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const updateBackgroundStyle = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      // Morning (6 AM to 12 PM)
      setBackgroundStyle(styles.morningBody);
    } else if (hour >= 12 && hour < 18) {
      // Afternoon (12 PM to 6 PM)
      setBackgroundStyle(styles.afternoonBody);
    } else {
      // Evening/Night (6 PM to 6 AM)
      setBackgroundStyle(styles.nightBody);
    }
  };

  return (
    <div style={{ ...backgroundStyle, ...isDarkMode ? styles.darkBody : styles.lightBody }}>
      <div style={styles.container}>
        <div style={isDarkMode ? styles.darkWeatherDashboard : styles.lightWeatherDashboard}>
          <h1 style={styles.heading}>Weather Dashboard</h1>

          <button onClick={toggleTheme} style={styles.themeButton}>
            Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
          </button>

          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search your city here"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={isDarkMode ? styles.darkInput : styles.lightInput}
            />
            <button onClick={fetchWeather} style={styles.button}>
              Search
            </button>
          </div>

          {isLoading && <div style={styles.loader}></div>}

          {errorMessage && <div style={styles.error}>{errorMessage}</div>}

          {weatherData && (
            <div style={isDarkMode ? styles.darkWeatherInfo : styles.lightWeatherInfo}>
              <h2 style={styles.weatherHeading}>Weather in {weatherData.city}</h2>
              <div style={styles.weatherDetails}>
                <div style={styles.detail}>
                  <i className="fas fa-thermometer-half" style={styles.icon}></i>
                  <h3>Temperature</h3>
                  <span>{weatherData.temperature} °C</span>
                </div>
                <div style={styles.detail}>
                  <i className="fas fa-wind" style={styles.icon}></i>
                  <h3>Wind Speed</h3>
                  <span>{weatherData.windSpeed} m/s</span>
                </div>
                <div style={styles.detail}>
                  <i className="fas fa-tint" style={styles.icon}></i>
                  <h3>Humidity</h3>
                  <span>{weatherData.humidity} %</span>
                </div>
                <div style={styles.detail}>
                  <i className="fas fa-cloud" style={styles.icon}></i>
                  <h3>Weather</h3>
                  <span>{weatherData.weather}</span>
                </div>
              </div>

              <button onClick={fetchWeather} style={styles.refreshButton}>
                Refresh
              </button>
            </div>
          )}

          {recentCities.length > 0 && (
            <div style={styles.recentSearches}>
              <h4>Recent Searches:</h4>
              <ul>
                {recentCities.map((city, index) => (
                  <li key={index}>{city}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  lightBody: {
    fontFamily: "'Poppins', sans-serif",
  },
  darkBody: {
    background: 'linear-gradient(to bottom, #2B2B2B, #1C1C1C)',
    fontFamily: "'Poppins', sans-serif",
  },
  morningBody: {
    background: 'linear-gradient(to bottom, #ADD8E6, #BFD7ED)', 
  },
  afternoonBody: {
    background: 'linear-gradient(to bottom, #FFD700, #FFA500)', 
  },
  nightBody: {
    background: 'linear-gradient(to bottom, #1C1C1C, #00008B)', 
  },
  container: {
    width: '90%',
    maxWidth: '1200px',
    margin: '20px auto',
    textAlign: 'center',
  },
  lightWeatherDashboard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  },
  darkWeatherDashboard: {
    backgroundColor: '#2D2D2D',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
  },
  heading: {
    fontSize: '2.5rem',
    color: '#1C3D5A',
    marginBottom: '20px',
  },
  themeButton: {
    padding: '10px 20px',
    borderRadius: '30px',
    border: 'none',
    backgroundColor: '#5086C1',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
    marginBottom: '20px',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  lightInput: {
    padding: '10px',
    width: '300px',
    borderRadius: '30px',
    border: '1px solid #5086C1',
    outline: 'none',
    fontSize: '1rem',
    backgroundColor: '#E3F2FD',
    color: '#1C3D5A',
    marginRight: '10px',
  },
  darkInput: {
    padding: '10px',
    width: '300px',
    borderRadius: '30px',
    border: '1px solid #5086C1',
    outline: 'none',
    fontSize: '1rem',
    backgroundColor: '#3B3B3B',
    color: '#FFFFFF',
    marginRight: '10px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '30px',
    border: 'none',
    backgroundColor: '#5086C1',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  },
  loader: {
    border: '6px solid #f3f3f3',
    borderRadius: '50%',
    borderTop: '6px solid #3498db',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: '20px auto',
  },
  weatherDetails: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '20px',
    width: '100%',
  },
  detail: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    fontSize: '2rem',
    marginBottom: '10px',
  },
  refreshButton: {
    padding: '10px 20px',
    borderRadius: '30px',
    border: 'none',
    backgroundColor: '#5086C1',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '20px',
  },
  recentSearches: {
    marginTop: '30px',
  },
  error: {
    color: 'red',
    marginTop: '20px',
  },
};

export default App;

