import fs from 'fs';
import mongoose from "mongoose";
import Book from "../models/Books.js";

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({});
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
    await Book.create({
      title,
      author,
      description,
      price,  
      category,
      stock,
      image: req.imagePath
    });
    return res.status(200).json({ message: 'Successfully added book' });
  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
};

export const updateBook = async (req, res) => {
  const { title, author, description, price, category, stock } = req.body;
  const { id } = req.params;
  try {
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid book ID' });

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.price = price || book.price;  
    book.category = category || book.category;
    book.stock = stock || book.stock;

    if (req.imagePath) {
      fs.unlink(`./uploads${book.image}`, async (err) => {
        if (err) return res.status(400).json({ message: `${err}` });
        book.image = req.imagePath;
        await book.save();
        return res.status(200).json({ message: 'Book updated successfully' });
      });
    } else {
      await book.save();
      return res.status(200).json({ message: 'Book updated successfully' });
    }

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
    fs.unlink(`./uploads${book.image}`, (err) => {
      if (err) return res.status(400).json({ message: `${err}` });
      return res.status(200).json({ message: 'Book deleted successfully' });
    });

  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
};
