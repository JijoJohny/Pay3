import mongoose from "mongoose";

const connectMongoDB =async () =>{
    try{
        const conn =await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongo DB Connected: ${conn.connection.host}`);
    }catch (error) {
        console.error(`Error Connection to MongoDB :${erorr.message}`);
        process.exit(1);
    }
};

export default connectMongoDB;