// models/post.model.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
    },
    img: {
        type: String,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [
        {
            text: {
                type: String,
                required: true
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
        }
    ],
    retweetOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: null // Points to the original post being retweeted
    },
    retweetCount: {
        type: Number,
        default: 0 // Initialize retweet count to 0
    },
}, { timestamps: true });



const Post = mongoose.model('Post', postSchema);


module.exports = Post;
