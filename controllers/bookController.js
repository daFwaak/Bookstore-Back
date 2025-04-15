import Book from '../models/Books.js';
import mongoose from 'mongoose';
import { uploadOnCloudnary } from '../utils/cloudinary.js';

export const getAllBooks = async (req, res) => {
  try {
    const { keyword, category, priceRange } = req.query;
    let filters = {};

    if (keyword) {
      filters.title = { $regex: keyword, $options: 'i' };
    }

    if (category && category !== 'All') {
      filters.category = category;
    }

    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split(',').map(Number);
      filters.price = { $gte: minPrice, $lte: maxPrice };
    }

    const books = await Book.find(filters);
    return res.status(200).json(books);
  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
};

export const getBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    return res.status(200).json(book);
  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
};


export const addBook = async (req, res) => {
  const { title, author, description, price, category, stock } = req.body;

  try {
    
    console.log('Incoming book data:', req.body);
    console.log('Uploaded file:', req.file);


    if (!title || !author || !price || !category) {
      return res.status(400).json({ message: 'Missing required fields: title, author, price, or category' });
    }

    let imageUrl = '';

    if (req.file?.path) {
      const cloudinaryResult = await uploadOnCloudnary(req.file.path);
      if (cloudinaryResult?.secure_url) {
        imageUrl = cloudinaryResult.secure_url;
      } else {
        return res.status(400).json({ message: 'Image upload failed' });
      }
    }

    const newBook = await Book.create({
      title,
      author,
      description,
      price,
      category,
      stock,
      image: imageUrl,
    });

    console.log('Book added:', newBook._id);

    return res.status(201).json({
      message: 'Book successfully added',
      book: newBook,
    });
  } catch (err) {
    console.error('Error in addBook:', err.message);
    return res.status(400).json({ message: `Error: ${err.message}` });
  }
};

export const updateBook = async (req, res) => {
  const { title, author, description, price, category, stock } = req.body;
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid book ID' });

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (req.file) {
      const cloudinaryResult = await uploadOnCloudnary(req.file.path);
      if (cloudinaryResult && cloudinaryResult.url) {
        book.image = cloudinaryResult.url;
      }
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.price = price || book.price;
    book.category = category || book.category;
    book.stock = stock || book.stock;

    await book.save();
    return res.status(200).json({ message: 'Book updated successfully' });
  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
};

export const removeBook = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid book ID' });

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    await Book.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
};
