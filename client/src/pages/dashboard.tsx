import React, { useEffect, useState } from 'react';
import WeatherCard from '../components/weathercard';

const API_KEY = '6c712cd9f0a9402797e53549251206';

const HomePage: React.FC = () => {
  const [cityInput, setCityInput] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [weatherData, setWeatherData] = useState<{ [city: string]: any }>({});
  const [error, setError] = useState('');

  const username = localStorage.getItem('username'); // Gets username from login

  // Fetch current weather for a city
  const fetchWeather = async (city: string) => {
    const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`);
    const data = await res.json();

    if (data.error) throw new Error(data.error.message);
    return data.current;
  };

  // Load cities from MongoDB on page load
  useEffect(() => {
    const loadCitiesFromMongo = async () => {
      if (!username) return;

      try {
        const res = await fetch(`http://localhost:5000/api/cities/${username}`);
        const data = await res.json();

        setCities(data.cities || []);

        for (const city of data.cities) {
          try {
            const weather = await fetchWeather(city);
            setWeatherData((prev) => ({ ...prev, [city]: weather }));
          } catch (err: any) {
            console.error(`Failed to fetch weather for ${city}:`, err.message);
          }
        }
      } catch (err: any) {
        console.error('Failed to load cities:', err.message);
        setError('Failed to load saved cities from database');
      }
    };

    loadCitiesFromMongo();
  }, [username]);

  // Add new city
  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    let city = cityInput.trim();

    if (!username) {
      setError('User not logged in');
      return;
    }

    if (!city || cities.includes(city)) {
      setError('City is empty or already added');
      return;
    }

    if (cities.length >= 5) {
      setError('You can only have up to 5 favorite cities');
      return;
    }

    // Capitalize city for uniformity
    city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

    try {
      const res = await fetch('http://localhost:5000/api/cities/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, city }),
      });

      const result = await res.json();
      if (!res.ok || result.error) {
        setError(result.error || 'Could not save city');
        return;
      }

      const weather = await fetchWeather(city);
      setCities(result.cities);
      setWeatherData((prev) => ({ ...prev, [city]: weather }));
      setCityInput('');
    } catch (err: any) {
      console.error('Add city error:', err.message);
      setError('Unexpected error while adding city');
    }
  };

  // Remove city
  const handleRemoveCity = async (city: string) => {
    if (!username) return;

    try {
      const res = await fetch('http://localhost:5000/api/cities/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, city }),
      });

      const result = await res.json();
      if (!res.ok || result.error) {
        setError(result.error || 'Failed to remove city');
        return;
      }

      setCities(result.cities);
      const updatedData = { ...weatherData };
      delete updatedData[city];
      setWeatherData(updatedData);
    } catch (err: any) {
      console.error('Remove city error:', err.message);
      setError('Unexpected error while removing city');
    }
  };

  return (
    <div>
      <h2>Welcome to the Weather Dashboard{username ? `, ${username}` : ''}</h2>

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

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
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
