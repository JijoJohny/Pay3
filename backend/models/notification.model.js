const { type } = require('express/lib/response');
const mongoose =require('mongoose');
const notificationSchema = new mongoose.Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    type:{
        type:String,
        required:true,
        enum:['follow','like','retweet']
    },
    read:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

const  Notification = mongoose.model('Notification',notificationSchema);

module.exports =Notification;
