import mongoose from 'mongoose';
import connectDB from "../db/db.js";
import dotenv from "dotenv"
import {Admin} from "../Models/Admin.model.js"




dotenv.config();

connectDB();
const run = async () => {
  await connectDB();
  const exists = await Admin.findOne({ email: 'admin@demo.com' });
  if (exists) {
    console.log('Admin already exists');
    process.exit(0);
  }
  const admin = new Admin({ name: 'Admin Demo', email: 'admin@demo.com', password: 'admin123' });
  await admin.save();
  console.log('Admin created: admin@demo.com / admin123');
  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
