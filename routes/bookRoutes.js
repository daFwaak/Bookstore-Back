import express from 'express';
import { addBook, getAllBooks, getBook, updateBook, removeBook } from '../controllers/bookController.js';
import { fileCheck, updateFileCheck } from '../middlewares/fileCheck.js';
import { bookSchema, validate } from '../utils/validators.js';
import { adminCheck, authCheck } from '../middlewares/authCheck.js';


const router = express.Router();



router.route('/').get(getAllBooks).post(authCheck, adminCheck, validate.body(bookSchema), fileCheck, addBook);

router.route('/:id').get(getBook).patch(authCheck, adminCheck, updateFileCheck, updateBook).delete(authCheck, adminCheck, removeBook);





export default router;



