import React, { useState, useEffect } from 'react';
import '../../styles/Weather.css';

function Weather() {
  const [weatherRecords, setWeatherRecords] = useState(() => {
    const savedRecords = localStorage.getItem('weatherRecords');
    return savedRecords ? JSON.parse(savedRecords) : [];
  });
  const [error, setError] = useState(null);

  // Save to localStorage whenever weatherRecords changes
  useEffect(() => {
    localStorage.setItem('weatherRecords', JSON.stringify(weatherRecords));
  }, [weatherRecords]);

  const fetchWeatherData = async () => {
    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Jyväskylä,fi&units=metric&appid=${apiKey}`);
      const data = await response.json();
      console.log('Weather API Response:', data);
      
      // Add timestamp to the data
      const newRecord = {
        ...data,
        fetchTime: new Date().toISOString()
      };
      
      // Add new record to the beginning of the array
      setWeatherRecords(prevRecords => [newRecord, ...prevRecords]);
      setError(null);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(`Failed to fetch weather data: ${err.message}`);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDateTime = (date, lastUpdate) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    const lastUpdateDate = new Date(lastUpdate * 1000);
    const lastUpdateHours = lastUpdateDate.getHours().toString().padStart(2, '0');
    const lastUpdateMinutes = lastUpdateDate.getMinutes().toString().padStart(2, '0');
    
    return `${day}.${month}.${year} klo ${hours}:${minutes} (${lastUpdateHours}:${lastUpdateMinutes})`;
  };

  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: 'minmax(200px, 1fr) minmax(400px, 2fr) minmax(200px, 1fr)',
      gap: '2rem',
      padding: '2rem',
      maxWidth: '1400px',
      margin: '0 auto',
      alignSelf: 'start'
    }}>
      {/* Left Column - Weather Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{
          backgroundColor: '#1a365d',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
              onClick={fetchWeatherData}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                backgroundColor: '#4A90E2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Fetch Data
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Center */}
      <div style={{ 
        backgroundColor: '#1a365d',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        color: 'white',
        alignSelf: 'start'
      }}>
        {weatherRecords.length > 0 && <h2 style={{ marginTop: 0 }}>Current Weather</h2>}
        {error && (
          <div style={{ 
            color: '#ff6b6b',
            padding: '1rem',
            backgroundColor: '#4a5568',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}
        {weatherRecords.map((weatherData, index) => (
          <div key={weatherData.fetchTime} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem',
            marginBottom: index < weatherRecords.length - 1 ? '2rem' : '0',
            paddingBottom: index < weatherRecords.length - 1 ? '2rem' : '0',
            borderBottom: index < weatherRecords.length - 1 ? '1px solid #4a5568' : 'none'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '1.2rem',
              color: '#a0aec0'
            }}>
              <span>{formatDateTime(new Date(weatherData.fetchTime), weatherData.dt)}</span>
            </div>

            {/* Temperature and Weather */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.5rem',
              backgroundColor: '#4a5568',
              borderRadius: '8px'
            }}>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>
                  {Math.round(weatherData.main.temp)}°C
                </div>
                <div style={{ color: '#a0aec0' }}>
                  Feels like: {Math.round(weatherData.main.feels_like)}°C
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', textTransform: 'capitalize' }}>
                  {weatherData.weather[0].description}
                </div>
                <div style={{ color: '#a0aec0' }}>
                  Humidity: {weatherData.main.humidity}%
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#4a5568',
              borderRadius: '8px'
            }}>
              <div>
                <div style={{ color: '#a0aec0' }}>Wind Speed</div>
                <div>{weatherData.wind.speed} m/s</div>
              </div>
              <div>
                <div style={{ color: '#a0aec0' }}>Pressure</div>
                <div>{weatherData.main.pressure} hPa</div>
              </div>
              <div>
                <div style={{ color: '#a0aec0' }}>Visibility</div>
                <div>{weatherData.visibility / 1000} km</div>
              </div>
              <div>
                <div style={{ color: '#a0aec0' }}>Cloud Cover</div>
                <div>{weatherData.clouds.all}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Panel */}
      <div style={{
        backgroundColor: '#1a365d',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        alignSelf: 'start',
        color: 'white'
      }}>
        {weatherRecords.length > 0 && <h2 style={{ marginTop: 0 }}>Location</h2>}
        {weatherRecords.length > 0 && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {/* Location and Time */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#4a5568',
              borderRadius: '8px'
            }}>
              <div>
                <h3 style={{ margin: 0 }}>{weatherRecords[0].name}</h3>
                <div style={{ color: '#a0aec0' }}>
                  {weatherRecords[0].sys.country}
                </div>
              </div>
              <div>
                <div style={{ color: '#a0aec0' }}>Sunrise</div>
                <div>{formatTime(weatherRecords[0].sys.sunrise)}</div>
              </div>
              <div>
                <div style={{ color: '#a0aec0' }}>Sunset</div>
                <div>{formatTime(weatherRecords[0].sys.sunset)}</div>
              </div>
            </div>

            {/* Temperature Range */}
            <div style={{ 
              padding: '1rem',
              backgroundColor: '#4a5568',
              borderRadius: '8px'
            }}>
              <div style={{ color: '#a0aec0' }}>Temperature Range</div>
              <div>Min: {Math.round(weatherRecords[0].main.temp_min)}°C</div>
              <div>Max: {Math.round(weatherRecords[0].main.temp_max)}°C</div>
            </div>

            {/* Coordinates */}
            <div style={{ 
              padding: '1rem',
              backgroundColor: '#4a5568',
              borderRadius: '8px'
            }}>
              <div style={{ color: '#a0aec0' }}>Coordinates</div>
              <div>Lat: {weatherRecords[0].coord.lat}°</div>
              <div>Lon: {weatherRecords[0].coord.lon}°</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Weather; 