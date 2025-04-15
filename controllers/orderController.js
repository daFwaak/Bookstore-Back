import Order from "../models/Order.js"
import mongoose from "mongoose";



export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort('createdAt: -1');
    return res.status(200).json(orders);
  } catch (err) {

    return res.status(400).json({ message: `${err}` });

  }
}


export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'please provide valid id' });

    const order = await Order.findById(id).populate('books.bookId');
    console.log(order); // Log the populated order object

    return res.status(200).json(order);
  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
};



export const getOrderByUser = async (req, res) => {

  try {
    const userOrders = await Order.find({ userId: req.userId }).select('_id totalAmount').sort('createdAt: -1');
    return res.status(200).json(userOrders);
  } catch (error) {

    return res.status(400).json({ message: `${err}` });

  }

}

export const createOrder = async (req, res) => {
  const { books, totalAmount } = req.body;

  try {

    await Order.create({
      userId: req.userId,
      books,
      totalAmount
    });

    return res.status(201).json({ message: 'order created successfully' });

  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
}