import express from 'express';
import { createOrder, getOrderById, getOrderByUser, getOrders } from '../controllers/orderController.js';
import { adminCheck, authCheck } from '../middlewares/authCheck.js';

const router = express.Router();


router.route('/')
  .get(authCheck, adminCheck, getOrders) 
  .post(authCheck, createOrder); 


router.route('/users/:id')
  .get(authCheck, getOrderByUser); 


router.route('/:id')
  .get(getOrderById); 

export default router;
