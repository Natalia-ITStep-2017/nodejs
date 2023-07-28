import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const {DB_HOST, PORT} = process.env

mongoose.connect(DB_HOST)
  .then(() =>{
    console.log('Database connection successful')
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`)
    })
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1)})

// 34KVifgbWDtb2fZZ Natalia

// const [field, value] = Object.entries(error.keyValue)[0]
// error.message = `Object wiwth ${field} ${value} is already exist` 