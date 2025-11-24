import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();


const connectDB =  async () => {
    try {
        // const connectionInstande = await mongoose.connect(process.env.MONGO_URI)
        const connectionInstande = await mongoose.connect(process.env.MONGO_URI_CLOUD)
        console.log(`mongoDb connected ${connectionInstande.connection.host}`)

    } catch (error) {
        console.log("somting mongodb error",error);
        process.exit(1)
                
    }
}


export default connectDB