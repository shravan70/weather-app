import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth';       
import cityRoutes from './routes/cities';     
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/weather';


app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/cities', cityRoutes); 

app.get('/', (req, res) => {
  res.send('🌦️ Weather App Server is running!');
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server started at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
  });
