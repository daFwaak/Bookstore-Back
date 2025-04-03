import express from 'express';
import { addToCart, getCart, removeFromCart, updateCart } from '../controllers/cartController.js';  
import { authCheck } from '../middlewares/authCheck.js';

const router = express.Router();

router.route('/')
  .get(authCheck, getCart)  
  .post(authCheck, addToCart);  


router.route('/:bookId')
  .patch(authCheck, updateCart);  


router.route('/:bookId')
  .delete(authCheck, removeFromCart);  

export default router;
