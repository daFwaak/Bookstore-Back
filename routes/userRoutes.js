import express from 'express';
import { getUser, loginUser, registerUser, updateUser } from '../controllers/userController.js';
import { loginSchema, registerSchema, validate } from '../utils/validators.js';
import { authCheck } from '../middlewares/authCheck.js';



const router = express.Router();



router.route('/login')
.post(validate.body(loginSchema), loginUser);

router.route('/register')
.post(validate.body(registerSchema), registerUser);

router.route('/:id')
.get(authCheck, getUser).patch(authCheck, updateUser);

export default router;





