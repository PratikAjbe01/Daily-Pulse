// User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
imageUrl: {
    type: String,
    validate: {
      validator: function (url) {
        return /\.(png|jpg|jpeg)$/i.test(url);
      },
      message: 'Only .png, .jpg, and .jpeg files are allowed',
    },
  },
  dailyAchievements: [{ date: Date }],          
  trophyCount: { type: Number, default: 0 }, 
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
