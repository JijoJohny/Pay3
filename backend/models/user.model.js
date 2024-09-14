const { type } =require("express/lib/response");
const mongoose = require("mongoose");

const userSchema =new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    fullName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minLength:6,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId, 
            ref:"User",
            default :[]
        }
    ],
    following:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    profileImg:{
        type:String,
        default:"",
    },
    coverImg:{
        type:String,
        default:"",
    },
    bio:{
        type:String,
        default:"",
    },
    link:{
        type:String,
        default:"",
    },
    retweetedPosts: [{ // Array to track retweeted posts
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
},
{timestamps:true}
);

const User = mongoose.model("User",userSchema);
module.exports = User;