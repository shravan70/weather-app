import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  Box,
} from '@mui/material';

interface Props {
  city: string;
  weather: any;
  onRemove: () => void;
}

const WeatherCard: React.FC<Props> = ({ city, weather, onRemove }) => {
  if (!weather || !weather.condition) {
    return (
      <Card
        sx={{
          width: 300,
          m: 2,
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
          border: '1px solid #444',
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {city}
          </Typography>
          <Typography variant="body2">Loading weather data...</Typography>
          <Button
            onClick={onRemove}
            variant="outlined"
            color="error"
            sx={{ mt: 2 }}
          >
            Remove
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        width: 300,
        m: 2,
        backgroundColor: '#ffffff',
        color: '#333',
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
          {city}
        </Typography>

        <Box display="flex" justifyContent="center" my={1}>
          <CardMedia
            component="img"
            image={weather.condition.icon}
            alt={weather.condition.text}
            sx={{ width: 64, height: 64 }}
          />
        </Box>

        <Typography align="center" variant="subtitle1" gutterBottom>
          {weather.condition.text}
        </Typography>

        <Typography align="center" variant="body2">
          🌡 Temperature: <strong>{weather.temp_c}°C</strong>
        </Typography>

        <Typography align="center" variant="body2">
          💧 Humidity: <strong>{weather.humidity}%</strong>
        </Typography>

        <Typography align="center" variant="body2">
          ☔ Precipitation: <strong>{weather.precip_mm} mm</strong>
        </Typography>

        <Box display="flex" justifyContent="center" mt={2}>
          <Button onClick={onRemove} variant="contained" color="error">
            Remove
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
