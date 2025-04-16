import Cart from '../models/Cart.js';

export const getCart = async (req, res) => {
  const userId = req.user.userId;

  try {
    let cart = await Cart.findOne({ userId }).populate("items.bookId");

    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }

    const totalAmount = cart.items.reduce((sum, { bookId, quantity }) => 
      sum + (bookId?.price || 0) * quantity, 0);

    return res.status(200).json({ ...cart.toObject(), totalAmount });
  } catch (err) {
    return res.status(500).json({ message: `Error fetching cart: ${err.message}` });
  }
};

export const addToCart = async (req, res) => {
  const userId = req.user.userId;
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Items array is required and cannot be empty." });
  }

  try {
    let cart = await Cart.findOne({ userId }) || new Cart({ userId, items: [] });

    items.forEach(newItem => {
      const existingItem = cart.items.find(item => item.bookId.equals(newItem.bookId));
      if (existingItem) existingItem.quantity += newItem.quantity;
      else cart.items.push(newItem);
    });

    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const removeFromCart = async (req, res) => {
  const userId = req.user.userId;
  const { bookId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not found' });

    cart.items.splice(itemIndex, 1);
    await cart.save();
    return res.status(200).json(await Cart.findOne({ userId }).populate("items.bookId"));
  } catch (err) {
    return res.status(500).json({ message: `Error removing item from cart: ${err.message}` });
  }
};

export const updateCart = async (req, res) => {
  const userId = req.user.userId;
  const { bookId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item.bookId.toString() === bookId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    item.quantity = quantity;
    await cart.save();
    return res.status(200).json(await Cart.findOne({ userId }).populate("items.bookId"));
  } catch (err) {
    return res.status(500).json({ message: `Error updating item in cart: ${err.message}` });
  }
};
