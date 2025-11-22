import express from 'express';
import { body } from 'express-validator';
import auth from '../Middlewares/Auth.js';

import {AdminLogin ,CreateSeller ,SellerList} from "../Controllers/Admin.controler.js"

const router = express.Router();

// admin login 
router.post("/login",[
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
], AdminLogin)

// create sellers
router.post("/createSellers", auth('admin'), [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('mobileNo').notEmpty().withMessage('Mobile No required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be >= 6 chars'),
  // skills may be array
],CreateSeller)

// get all selles
router.get("/sellerList", auth('admin'), SellerList)


export default router;
