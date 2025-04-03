import Joi from 'joi';
import validator from 'express-joi-validation'



export const validate = validator.createValidator({});

const authSchema = {
  email: Joi.string().email().required(),
  password: Joi.string().required()
};

export const loginSchema = Joi.object({
  ...authSchema
});

export const registerSchema = Joi.object({
  username: Joi.string().min(6).required(),
  ...authSchema
});

export const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().valid('Fiction', 'Mystery & Thriller', 'Romance', 'non-fiction', 'other').required(),
  stock: Joi.number().required(),
});






export const cartSchema = Joi.object({
  userId: Joi.string().required(),
  items: Joi.array().items(
    Joi.object({
      bookId: Joi.string().required(),
      title: Joi.string().required(),
      quantity: Joi.number().required()
    })
  ).required(),
});



