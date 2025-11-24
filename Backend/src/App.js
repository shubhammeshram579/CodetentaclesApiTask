import express from "express"
import connectDB from "./db/db.js"
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import expressSession from "express-session"
import MongoStore from "connect-mongo"
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

app.use(
  expressSession({
    secret: process.env.ACCESS_TOKEN_SECRET || "yourSecretKey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL_CLOUD || "mongodb://localhost:27017/yourDatabaseName",
      collectionName: "sessions", // Optional: Customize the collection name
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: false, // Set to true if using HTTPS
    },
  })
);




app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);


app.get("/", (req,res) => {
    res.send("hellow")
})

// error handeler
app.use(errorHandler);



app.listen( PORT ,() => console.log(`server runing on ${PORT}`));