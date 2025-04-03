import express from 'express';
import productRoutes from './routes/bookRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import 'dotenv/config';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import cors from 'cors';
const app = express();

mongoose.connect(process.env.MONGO_URI).then((val) => {
  app.listen(5555, () => {
    console.log('Database connected and listening at 5555');
  });
}).catch((err) => {
  console.log(err);
});

app.use(cors({
  origin: ['https://bookstore-front-eta.vercel.app/'],
}));

app.use(express.json());
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },
  abortOnLimit: true
}));


app.use(express.static('uploads'));
app.get('/', (req, res) => {
  return res.status(200).json([11, 22, 44, 55]);
});


app.use('/api/books', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);





