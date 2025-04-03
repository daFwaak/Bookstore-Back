import User from "../models/User.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";


export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const isExist = await User.findOne({ email: email });
    if (!isExist) return res.status(401).json({ message: 'invalid credential' });

    const pass = bcrypt.compareSync(password, isExist.password);
    if (!pass) return res.status(401).json({ message: 'invalid credential' });

    const token = jwt.sign({
      userId: isExist._id,
      role: isExist.role
    }, process.env.SECRET);


    return res.status(201).json({
      message: 'login successfully',
      data: {
        token,
        userId: isExist._id,
        role: isExist.role
      }
    });
  } catch (err) {
    return res.status(400).json({
      message: `${err}`
    })

  }
}


export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const isExist = await User.findOne({ email: email });
    if (isExist) return res.status(409).json({ message: 'user already exist' });

    const hashPass = bcrypt.hashSync(password, 10);
    await User.create({
      username,
      email,
      password: hashPass
    });

    return res.status(201).json({ message: 'registered successfully' });
  } catch (err) {
    return res.status(400).json({
      message: `${err}`
    })

  }

}




export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'please provide valid id' });
    const isExist = await User.findById(id).select('-password');
    if (!isExist) return res.status(404).json({ message: 'user not found' });
    return res.status(200).json(isExist);
  } catch (err) {
    return res.status(400).json({
      message: `${err}`
    })

  }

}

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  try {

    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'please provide valid id' });

    const isExist = await User.findById(id);

    if (!isExist) return res.status(404).json({ message: 'user not found' });

    isExist.username = username || isExist.username;
    isExist.email = email || isExist.email;
    await isExist.save();
    return res.status(200).json({ message: 'successfully updated' });
  } catch (err) {
    return res.status(400).json({
      message: `${err}`
    })

  }

}