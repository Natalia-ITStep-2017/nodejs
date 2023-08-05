
import {User} from '../models/index.js'
import { httpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
const {JWT_SECRET} = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw httpError(409, 'Email in use')
  }
  const hashPassword = await bcrypt.hash(password, 10)
  const result = await User.create({ ...req.body, password: hashPassword })

  res.status(201).json({
    user: {
      email: result.email,
      subscription: result.subscription
    }
  })
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(401, 'Email or password is wrong')
  }

  const compareResult = await bcrypt.compare(password, user.password);

  if (!compareResult){
    throw httpError(401, 'Email or password is wrong')
  }
  const payload = {
    id: user._id,
  }
  const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '4h'});
await User.findByIdAndUpdate(user._id, {token})
  res.json({
    token,
    user: {
    email: user.email,
    subscription: user.subscription
  }
  })
}

const getUser = (req, res) => {
  const {email, subscription} = req.user;
  res.json({
    email, 
    subscription
  })
}

const logout = async (req, res) => {
  const {_id} = req.user;
  await User.findByIdAndUpdate(_id, {token:''});
  res.status(204).json();
}

const updateUserStatus = async (req, res) => {
  const {_id} = req.user;
  const {email, subscription} = await User.findByIdAndUpdate(_id, req.body, {new:true});
  res.json({email, subscription});
}


export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getUser: ctrlWrapper(getUser),
  logout: ctrlWrapper(logout),
  updateUserStatus: ctrlWrapper(updateUserStatus),
}
