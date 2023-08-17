
import { User } from '../models/index.js'
import { httpError, sendEmail } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from "path"
import fs from "fs/promises";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from 'nanoid';
import 'dotenv/config';

const { JWT_SECRET, BASE_URL } = process.env;

const avatarPath = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  var avatarURL = gravatar.url('emerleite@gmail.com', { s: '200', r: 'pg', d: '404' });
  const user = await User.findOne({ email });
  if (user) {
    throw httpError(409, 'Email in use')
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const result = await User.create({ ...req.body, avatarURL, password: hashPassword, verificationToken })

  const verifyEmail = {
    to: email,
    subject: "Contacts registration",
    html: `<a href="${BASE_URL}/users/verify/${verificationToken}" target="_blank">Click here to verify your email</a>`
  }

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: result.email,
      subscription: result.subscription,
      avatarURL: result.avatarURL
    }
  })
}

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw httpError(404, 'User not found')
  }

  if (user.verify) {
    throw httpError(404, "Verification has already been passed")
  }

  await User.findByIdAndUpdate(user._id, { verificationToken: null, verify: true });

  res.json({
     message: 'Verification successful'
  })
}

const resendEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(404, 'User not found')
  }
  if (!user.verify) {
    throw httpError(404, "Verification has already been passed")
  }
  const verifyEmail = {
    to: email,
    subject: "Contacts registration",
    html: `<a href="${BASE_URL}/users/verify/${user.verificationToken}" target="_blank">Click here to verify your email</a>`
  }

  await sendEmail(verifyEmail);
  res.json({
    message: "Verification email sent"
 })
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(401, 'Email or password is wrong')
  }

  if(!user.verify) {
    throw httpError(401, 'Your email is not verified')
  }

  const compareResult = await bcrypt.compare(password, user.password);

  if (!compareResult) {
    throw httpError(401, 'Email or password is wrong')
  }
  const payload = {
    id: user._id,
  }
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '4h' });
  await User.findByIdAndUpdate(user._id, { token })
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL
    }
  })
}

const getUser = (req, res) => {
  const { email, subscription, avatarURL } = req.user;
  res.json({
    email,
    subscription,
    avatarURL
  })
}

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });
  res.status(204).json();
}

const updateUserStatus = async (req, res) => {
  const { _id } = req.user;
  const { email, subscription, avatarURL } = await User.findByIdAndUpdate(_id, req.body, { new: true });
  res.json({ email, subscription, avatarURL });
}

const updateUserAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempPath, filename } = req.file;

  try {
    const image = await Jimp.read(tempPath);
    await image.resize(250, 250).write(tempPath);
  }
  catch {
    httpError(400, 'File cannot be upload')
  };

  const newPath = path.join(avatarPath, filename);

  await fs.rename(tempPath, newPath);
  const avatar = path.join("avatars", filename);
  const { avatarURL } = await User.findByIdAndUpdate(_id, { avatarURL: avatar }, { new: true });
  res.json({ avatarURL });
}



export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getUser: ctrlWrapper(getUser),
  logout: ctrlWrapper(logout),
  updateUserStatus: ctrlWrapper(updateUserStatus),
  updateUserAvatar: ctrlWrapper(updateUserAvatar),
  verify: ctrlWrapper(verify),
  resendEmail: ctrlWrapper(resendEmail),
}
