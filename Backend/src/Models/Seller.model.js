import mongoose from 'mongoose';
import bcrypt from "bcryptjs"

const SellerSchema = new mongoose.Schema(
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
  mobileNo: { 
    type: String, 
    required: true 
  },
  country: { 
    type: String 
  },
  state: { 
    type: String 
  },
  skills: [{ type: String }], 
  password: { 
    type: String, 
    required: true 
  },
  role: {
     type: String, 
     default: 'seller' 
    }
}, { timestamps: true });


SellerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// methods confirm password
SellerSchema.methods.matchPassword = async function(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export const Seller  = mongoose.model('Seller', SellerSchema);
