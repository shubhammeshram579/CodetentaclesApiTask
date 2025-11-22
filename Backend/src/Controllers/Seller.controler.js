import {ApiError} from "../Utils/apiErrors.js"
import {ApiResponse} from "../Utils/apiResponse.js"
import {validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import {Seller} from '../Models/Seller.model.js';
import {Product} from '../Models/Product.model.js';
import cloudinary from "../Utils/Cloudinary.js"



const LoginSellers = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });

     if(!seller){
        throw new ApiError(401, "Invalid credentials")
    }


    const match = await seller.matchPassword(password);

     if(!match){
        throw new ApiError(401, "Invalid credentials")
    }

    const token = jwt.sign({ id: seller._id, role: seller.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

     return res
        .status(200)
        .json(
            new ApiResponse(200, { token, role: seller.role } , "success")
    )
  } catch (err) {
    console.error(err);
    throw new ApiError(500, err.message)
  }
};



// Helper: upload a buffer to cloudinary (promise)
const uploadBufferToCloudinary = (buffer, folder = 'codetentacle_products') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};


const CreateProduct = async (req, res) => {
  try {
    // validate body fields
    const { productName, productDescription } = req.body;
    
    if(!productName){
        throw new ApiError(422, "productName is required")
    }

    // brands might come as JSON string (from form-data)
    let brandsRaw = req.body.brands;
    if(!brandsRaw){
        throw new ApiError(422, "brands is required")
    }

    let brands;
    if (typeof brandsRaw === 'string') {
      try { brands = JSON.parse(brandsRaw); } 
      catch (err) { return res.status(422).json({ message: 'brands must be valid JSON' }); }
    } else {
      brands = brandsRaw;
    }

    if (!Array.isArray(brands) || brands.length === 0) {
        throw new ApiError(422, "brands must be a non-empty array")
    }

    // images files from multer (in memory)
    const files = req.files || [];

    // If images provided, map each brand to corresponding image by index
    const uploadedBrands = [];
    for (let i = 0; i < brands.length; i++) {
      const b = brands[i];
      if (!b.name || !b.price) return res.status(422).json({ message: `brand at index ${i} must have name and price` });

      const brandObj = {
        name: b.name,
        detail: b.detail || '',
        price: Number(b.price)
      };

      if (files[i]) {
        // upload files[i].buffer to cloudinary
        try {
          const result = await uploadBufferToCloudinary(files[i].buffer);
          brandObj.image = result.secure_url;
        } catch (err) {
          console.error('Cloudinary upload error:', err);
          return res.status(500).json({ message: 'Image upload failed' });
        }
      } else {
        // no image for this brand — optional, allow empty string or null
        brandObj.image = b.image || '';
      }

      uploadedBrands.push(brandObj);
    }

    const product = new Product({
      productName,
      productDescription,
      seller: req.user.id,
      brands: uploadedBrands
    });
    await product.save();


    return res
        .status(201)
        .json(new ApiResponse(200, { product } , "Product created")
    )
  } catch (err) {
    console.error(err);
    throw new ApiError(500, err.message)
  }
};


const Productslist = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const [total, products] = await Promise.all([
      Product.countDocuments({ seller: req.user.id }),
      Product.find({ seller: req.user.id }).skip(skip).limit(limit).sort({ createdAt: -1 })
    ]);

    return res.status(201).json(
        new ApiResponse(200,{
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        products},
        "products get succefuly")
    )
  } catch (err) {
    console.error(err);
    throw new ApiError(500, err.message)
  }
};



const DeleteProduct = async (req, res) => {
  try {
    const {id} = req.params;
    // const currentUser = req.user.id;

    if(!id){
        throw new ApiError(404, "product id not found")
    }

    const product = await Product.findByIdAndDelete(id);

    return res
        .status(201)
        .json(new ApiResponse(200 ,{product}, "Product deleted")
    )
  } catch (err) {
    console.error(err);
    throw new ApiError(500, err.message)
  }
};

export {
    LoginSellers,
    CreateProduct,
    Productslist,
    DeleteProduct
}