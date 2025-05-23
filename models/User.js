import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    min: [6, 'Must be at least 6 character'],
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
  }


}, { timestamps: true });



const User = mongoose.model('User', userSchema);

export default User;