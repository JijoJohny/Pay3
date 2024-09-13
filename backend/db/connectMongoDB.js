const mongoose = require("mongoose");

const connectMongoDB =async () =>{
    try{
        const conn =await mongoose.connect("mongodb+srv://jijojohny13:FxnJfQqV0WfLlrqA@cluster0.li1ki.mongodb.net/Pay3?retryWrites=true&w=majority&appName=Cluster0")
        console.log(`Mongo DB Connected: ${conn.connection.host}`);
    }catch (error) {
        console.error(`Error Connection to MongoDB :${error.message}`);
        process.exit(1);
    }
};

module.exports = connectMongoDB;