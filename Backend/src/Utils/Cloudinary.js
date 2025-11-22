import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";



// configration env file path
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


export default cloudinary;
