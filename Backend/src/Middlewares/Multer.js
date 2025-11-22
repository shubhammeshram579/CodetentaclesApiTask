import multer from "multer"
import dotenv from "dotenv";
dotenv.config();

const storage = multer.memoryStorage(); // keep files in memory, upload to cloudinary
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit per file
});

export default upload;
