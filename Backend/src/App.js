import express from "express"
import connectDB from "./db/db.js"
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import adminRoutes from './Routers/Admin.router.js';
import sellerRoutes from './Routers/Seller.router.js';
import errorHandler from './Utils/ErrorHandler.js';


dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' }));


const PORT = process.env.PORT || 5000;
connectDB()

app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);


app.get("/", (req,res) => {
    res.send("hellow")
})

// error handeler
app.use(errorHandler);



app.listen( PORT ,() => console.log(`server runing on ${PORT}`));