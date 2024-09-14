// controllers/post.controllers.js
const cloudinary = require('cloudinary').v2;
const Post = require('../models/post.model.js');
const User = require('../models/user.model.js');
//const Tweet = require('../models/post.model.js');

const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        // Validate the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure that at least one of text or img is provided
        if (!text && !img) {
            return res.status(400).json({ message: 'Please enter text or image' });
        }

        // Handle image upload
        if (img) {
            try {
                const uploadedResponse = await cloudinary.uploader.upload(img);
                img = uploadedResponse.secure_url;
            } catch (uploadError) {
                console.error('Error uploading image to Cloudinary:', uploadError.message);
                return res.status(500).json({ error: 'Error uploading image' });
            }
        }

        // Create and save the new post
        const newPost = new Post({
            user: userId,
            text,
            img,
        });

        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {
        console.error('Error in createPost Controller:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const getAllTweets = async (req, res) => {
    try {
        const tweets = await Post.find().populate('user', 'username');

        res.status(200).json(tweets);

    } catch (error) {
        console.error('Error in getAllTweets Controller:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const getPostsByUsername = async (req, res) => {
    try {
        const { username } = req.params; // Get username from query params

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find all posts by this user
        const posts = await Post.find({ user: user._id }).populate('user', 'username');
        res.status(200).json(posts);

    } catch (error) {
        console.error('Error in getPostsByUsername Controller:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
module.exports ={
    createPost,
    getAllTweets,
    getPostsByUsername
}