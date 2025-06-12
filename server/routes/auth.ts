import { Router, Request, Response, NextFunction } from 'express';
import { MongoClient } from 'mongodb';

const router = Router();

interface LoginRequestBody {
  username: string;
  password: string;
}

const client = new MongoClient(process.env.MONGO_URI!);
const db = client.db('weather');
const users = db.collection('users');

router.post(
  '/login',
  async (
    req: Request<{}, {}, LoginRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { username, password } = req.body;

    try {
      const user = await users.findOne({ username, password });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      next(error); // Proper async error forwarding
    }
  }
);

export default router;
