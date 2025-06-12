import express from 'express';
import User from '../models/user';

const router = express.Router();

// GET /api/cities/:username — Get all saved cities
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ cities: user.cities });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/cities/add — Add a city to user's list
router.post('/add', async (req, res) => {
  try {
    const { username, city } = req.body;

    console.log('📥 Incoming request:', { username, city });

    if (!username || !city) {
      console.log('❌ Missing username or city');
      return res.status(400).json({ error: 'Missing username or city' });
    }

    const user = await User.findOne({ username });

    if (!user) {
      console.log(`❌ User not found: ${username}`);
      return res.status(404).json({ error: 'User not found' });
    }

    if (!Array.isArray(user.cities)) {
      console.log('⚠️ User does not have a cities array. Fixing...');
      user.cities = [];
    }

    if (user.cities.includes(city)) {
      return res.status(400).json({ error: 'City already added' });
    }

    if (user.cities.length >= 5) {
      return res.status(400).json({ error: 'Max 5 cities reached' });
    }

    user.cities.push(city);
    await user.save();

    console.log('City added:', user.cities);
    res.status(200).json({ cities: user.cities });
  } catch (error: any) {
    console.error('Server error in /api/cities/add:', error); // 
    res.status(500).json({ error: 'Server error' });
  }
});


// Remove a city from user's list
router.post('/remove', async (req, res) => {
  try {
    const { username, city } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.cities = user.cities.filter((c) => c !== city);
    await user.save();

    res.status(200).json({ cities: user.cities });
  } catch (error) {
    console.error('Error removing city:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
