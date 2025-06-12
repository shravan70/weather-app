import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  usename: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model('users', userSchema);
