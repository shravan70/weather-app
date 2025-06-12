// /pages/HomePage.tsx
import React, { useState } from 'react';
import WeatherCard from '../components/weathercard';

const API_KEY = '6c712cd9f0a9402797e53549251206';

const HomePage: React.FC = () => {
  const [cityInput, setCityInput] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [weatherData, setWeatherData] = useState<{ [city: string]: any }>({});
  const [error, setError] = useState('');

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const city = cityInput.trim();

    if (!city || cities.includes(city)) {
      setError('City is empty or already added');
      return;
    }

    if (cities.length >= 5) {
      setError('You can only have up to 5 favorite cities');
      return;
    }

    try {
      const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`);
      const data = await res.json();

      if (data.error) {
        setError('City not found');
        return;
      }

      setCities([...cities, city]);
      setWeatherData((prev) => ({ ...prev, [city]: data.current }));
      setCityInput('');
    } catch (err) {
      setError('Failed to fetch weather data');
    }
  };

  const handleRemoveCity = (city: string) => {
    setCities(cities.filter((c) => c !== city));
    const updatedData = { ...weatherData };
    delete updatedData[city];
    setWeatherData(updatedData);
  };

  return (
    <div>
      <h2>Welcome to the Weather Dashboard</h2>
      <form onSubmit={handleAddCity}>
        <input
          type="text"
          placeholder="Enter city name"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
        />
        <button type="submit">Add City</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {cities.map((city) => (
          <WeatherCard
            key={city}
            city={city}
            weather={weatherData[city]}
            onRemove={() => handleRemoveCity(city)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;

