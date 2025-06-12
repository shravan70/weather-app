import React, { useEffect, useState } from 'react';
import WeatherCard from '../components/weathercard';
import {
  Typography,
  TextField,
  Container,
  Button,
  Box,
} from '@mui/material';

const API_KEY = '6c712cd9f0a9402797e53549251206';

const HomePage: React.FC = () => {
  const [cityInput, setCityInput] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [weatherData, setWeatherData] = useState<{ [city: string]: any }>({});
  const [error, setError] = useState('');

  const username = localStorage.getItem('username');

  const fetchWeather = async (city: string) => {
    const res = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.current;
  };

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

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    let city = cityInput.trim();

    if (!username) {
      setError('User not logged in');
      return;
    }

    if (!city) {
      setError('City is empty');
      return;
    }

    city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

    if (cities.map((c) => c.toLowerCase()).includes(city.toLowerCase())) {
      setError('City already added');
      return;
    }

    if (cities.length >= 5) {
      setError('You can only have up to 5 favorite cities');
      return;
    }

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
  <Box
    sx={{
      width: '100vw',
      height: '100vh',
      bgcolor: '#121212',
      color: '#ffffff',
      overflowY: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      p: 2,
      boxSizing: 'border-box',
    }}
  >
    <Container
      maxWidth={false} 
      sx={{
        width: '100%',
        maxWidth: '1200px', 
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        textAlign="center"
        sx={{ mt: 2 }}
      >
        Welcome to the Weather Dashboard{username ? `, ${username}` : ''}
      </Typography>

      
      <Box component="form" onSubmit={handleAddCity} sx={{ mt: 4, width: '100%' }}>  
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <TextField
            label="Enter City Name"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            variant="outlined"
            fullWidth
            sx={{
              maxWidth: 350,
              input: { color: '#ffffff' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#ccc' },
                '&:hover fieldset': { borderColor: '#fff' },
                '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
              },
              '& .MuiInputLabel-root': { color: 'lightgray' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#00bcd4' },
            }}
          />
          <Button
            type="submit"
            sx={{
              height: '56px',
              px: 3,
              bgcolor: '#2b62e3',
              color:'#ffffff'
            }}
          >
            Add City
          </Button>
        </Box>

        {error && (
          <Typography variant="body2" color="error" mt={2} textAlign="center">
            {error}
          </Typography>
        )}
      </Box>

      
      <Box
        sx={{
          mt: 6,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {cities.length === 0 ? (
          <Typography variant="h6" sx={{ color: '#cccccc', mt: 4, textAlign: 'center' }}>
            No favorite cities added yet. Add a city above to view weather details.
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 3,
              width: '100%',
              mt: 2,
            }}
          >
            {cities.map((city) => (
              <WeatherCard
                key={city}
                city={city}
                weather={weatherData[city]}
                onRemove={() => handleRemoveCity(city)}
              />
            ))}
          </Box>
        )}
      </Box>
    </Container>
  </Box>
);
}

export default HomePage;
