import mongoose from 'mongoose';

// brand scham under array format
const BrandSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  detail: { 
    type: String 
  },
  image: { 
    type: String 
  },
  price: { 
    type: Number, 
    required: true 
  }
}, { _id: false });



// product schema
const ProductSchema = new mongoose.Schema(
  {
  productName: { 
    type: String, 
    required: true },
  productDescription: { 
    type: String 
  },
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Seller', 
    required: true 
  },
  brands: [BrandSchema]
}, { timestamps: true });

export const Product  = mongoose.model('Product', ProductSchema);
