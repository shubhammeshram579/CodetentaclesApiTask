import express from 'express';
import { body} from 'express-validator';
import auth from '../Middlewares/Auth.js';
import upload from '../Middlewares/Multer.js';
// router function 
import { LoginSellers,CreateProduct,Productslist, DeleteProduct} from "../Controllers/Seller.controler.js"

const router = express.Router();

// login 
router.post('/login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
], LoginSellers);


// product 
router.post('/products', auth('seller'), upload.array('images', 10),CreateProduct);
router.get('/products', auth('seller'), Productslist);
router.delete('/products/:id', auth('seller'),DeleteProduct);


export default  router;
