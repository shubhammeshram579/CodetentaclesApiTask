import mongoose from 'mongoose';
import bcrypt from "bcryptjs"

const AdminSchema = new mongoose.Schema(
  {
  name: {
    type: String,
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    default: 'admin' 
  }
}, { timestamps: true });



AdminSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// Method to compare password
AdminSchema.methods.matchPassword = async function(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export const Admin = mongoose.model('Admin', AdminSchema);
