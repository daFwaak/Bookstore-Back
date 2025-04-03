import mongoose from 'mongoose';

// Define the schema for an order item
const orderItemSchema = new mongoose.Schema({
  bookId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  }
});

// Define the schema for an order
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  books: [orderItemSchema], 
  totalAmount: {
    type: Number,
    required: true
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;