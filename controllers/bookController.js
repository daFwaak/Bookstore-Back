import Book from '../models/Books.js';
import mongoose from 'mongoose';
import { uploadOnCloudnary } from '../utils/cloudinary.js';

export const getAllBooks = async (req, res) => {
  try {
    const { keyword, category, priceRange } = req.query;
    const filters = {};

    if (keyword) filters.title = { $regex: keyword, $options: 'i' };
    if (category && category !== 'All') filters.category = category;
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split(',').map(Number);
      filters.price = { $gte: minPrice, $lte: maxPrice };
    }

    const books = await Book.find(filters);
    return res.status(200).json(books);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    return res.status(200).json(book);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const addBook = async (req, res) => {
  const { title, author, description, price, category, stock } = req.body;

  if (!title || !author || !price || !category) {
    return res.status(400).json({ message: 'Missing required fields: title, author, price, or category' });
  }

  try {
    let imageUrl = '';
    if (req.file?.path) {
      const cloudinaryResult = await uploadOnCloudnary(req.file.path);
      imageUrl = cloudinaryResult?.secure_url || '';
      if (!imageUrl) return res.status(400).json({ message: 'Image upload failed' });
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

    return res.status(201).json({
      message: 'Book successfully added',
      book: newBook,
    });
  } catch (err) {
    return res.status(400).json({ message: `Error: ${err.message}` });
  }
};

export const updateBook = async (req, res) => {
  const { title, author, description, price, category, stock } = req.body;
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid book ID' });

  try {
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (req.file?.path) {
      const cloudinaryResult = await uploadOnCloudnary(req.file.path);
      book.image = cloudinaryResult?.secure_url || book.image;
      if (!book.image) return res.status(400).json({ message: 'Image upload failed' });
    }

    Object.assign(book, {
      title: title || book.title,
      author: author || book.author,
      description: description || book.description,
      price: price || book.price,
      category: category || book.category,
      stock: stock || book.stock,
    });

    await book.save();
    return res.status(200).json({ message: 'Book updated successfully', book });
  } catch (err) {
    return res.status(400).json({ message: `Error: ${err.message}` });
  }
};

export const removeBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid book ID' });

  try {
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    await Book.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
