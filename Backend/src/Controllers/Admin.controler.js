import {ApiError} from "../Utils/apiErrors.js"
import {ApiResponse} from "../Utils/apiResponse.js"
import {validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import {Admin} from '../Models/Admin.model.js';
import {Seller} from '../Models/Seller.model.js';




// admin login 
const AdminLogin = async (req,res,next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

       const { email, password } = req.body;

       const admin = await Admin.findOne({ email });

       if(!admin){
            throw new ApiError(401, "Invalid credentials")
        }
       
        const match = await admin.matchPassword(password);

        if(!match){
            throw new ApiError(401, "Invalid credentials")
        }
       
        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
       
        return res
        .status(200)
        .json(
            new ApiResponse(200, { token, role: admin.role } , "success")
        )
    } catch (error) {
        throw new ApiError(500, error.message)
    }

}



// CREATE SELLER (admin-only)
const CreateSeller  = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  try {
    const { name, email, mobileNo, country, state, skills, password } = req.body;

    const exists = await Seller.findOne({ email });

    if(exists){
        throw new ApiError(409, "Seller with this email already exists")
    }

    const seller = new Seller({
        name,
        email, 
        mobileNo, 
        country, 
        state,
        skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
        password
    });


    await seller.save();
    const out = seller.toObject();
    delete out.password;


    return res.status(201).json(
        new ApiResponse(200,{seller: out},"Seller registered succesfully")
    )
  } catch (err) {
    throw new ApiError(500, err.message)
  }
};


const SellerList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const [total, sellers] = await Promise.all([
      Seller.countDocuments(),
      Seller.find().select('-password').skip(skip).limit(limit).sort({ createdAt: -1 })
    ]);


     return res.status(201).json(
        new ApiResponse(200,{
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            sellers},
            "Seller registered succesfully")
    )

  } catch (err) {
    console.error(err);
    throw new ApiError(500, err.message)
  }
};


export {
    AdminLogin,
    CreateSeller,
    SellerList
}
