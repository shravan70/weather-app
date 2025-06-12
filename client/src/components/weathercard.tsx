import React from 'react';

interface Props {
  city: string;
  weather: any;
  onRemove: () => void;
}

const WeatherCard: React.FC<Props> = ({ city, weather, onRemove }) => {
  
  if (!weather || !weather.condition) {
    return (
      <div style={{ border: '1px solid #ccc', padding: '12px', margin: '10px', width: '300px' }}>
        <h3>{city}</h3>
        <p>Loading weather data...</p>
        <button onClick={onRemove}>Remove</button>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '12px', margin: '10px', width: '300px' }}>
      <h3>{city}</h3>
      <img src={weather.condition.icon} alt={weather.condition.text} />
      <p>{weather.condition.text}</p>
      <p>Temperature: {weather.temp_c}°C</p>
      <p>Humidity: {weather.humidity}%</p>
      <p>Precipitation: {weather.precip_mm} mm</p>
      <button onClick={onRemove}>Remove</button>
    </div>
  );
};

export default WeatherCard;
