import mongoose from "mongoose";


const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Fiction', 'Mystery & Thriller', 'Romance', 'non-fiction', 'other'],
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
export default Book;