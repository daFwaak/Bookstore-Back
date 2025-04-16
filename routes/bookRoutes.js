import express from 'express';
import {
  addBook,
  getAllBooks,
  getBook,
  updateBook,
  removeBook
} from '../controllers/bookController.js';
import { adminCheck, authCheck } from '../middlewares/authCheck.js';
import { upload } from '../middlewares/multer.js';
import { bookSchema, validate } from '../utils/validators.js';


const router = express.Router();

router.route('/')
  .get(getAllBooks)
  .post(
    authCheck,
    adminCheck,
    upload.single('image'), 
    addBook
  );

router.route('/:id')
  .get(getBook)
  .patch(
    authCheck,
    adminCheck,
    upload.single('image'),
    updateBook
  )
  .delete(
    authCheck,
    adminCheck,
    removeBook
  );

export default router;
