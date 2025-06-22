// User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },

  dailyAchievements: [{ date: Date }],          
  trophyCount: { type: Number, default: 0 }, 
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
