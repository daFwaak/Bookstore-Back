import Cart from '../models/Cart.js';

export const getCart = async (req, res) => {
  const userId = req.user.userId;

  try {
    console.log(`Fetching cart for user: ${userId}`);

    let cart = await Cart.findOne({ userId }).populate("items.bookId");

    if (!cart) {
      console.log("No cart found. Creating new cart.");
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }

    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + (item.bookId?.price || 0) * item.quantity;
    }, 0);

    console.log("Cart found:", JSON.stringify(cart, null, 2));
    return res.status(200).json({ ...cart.toObject(), totalAmount });
  } catch (err) {
    console.error("Error fetching cart:", err);
    return res.status(500).json({ message: `Error fetching cart: ${err.message}` });
  }
};

export const addToCart = async (req, res) => {
  console.log("Received request body:", JSON.stringify(req.body, null, 2)); 

  try {
    const userId = req.user.userId; 
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items array is required and cannot be empty." });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    for (const newItem of items) {
      const existingItem = cart.items.find(item => item.bookId.equals(newItem.bookId));
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        cart.items.push(newItem);
      }
    }

    await cart.save();
    console.log("Updated Cart:", JSON.stringify(cart, null, 2)); 

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error in addToCart:", error); 
    res.status(500).json({ message: "Server error", error });
  }
};

export const removeFromCart = async (req, res) => {
  const userId = req.userId;
  const { bookId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate("items.bookId");
    return res.status(200).json(updatedCart);
  } catch (err) {
    return res.status(500).json({ message: `Error removing item from cart: ${err.message}` });
  }
};

export const updateCart = async (req, res) => {
  const userId = req.userId;
  const { bookId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.bookId.toString() === bookId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate("items.bookId");
    return res.status(200).json(updatedCart);
  } catch (err) {
    return res.status(500).json({ message: `Error updating item in cart: ${err.message}` });
  }
};
