const bcryptjs = require('bcryptjs'); // Remove if not used
const  cloudinary  = require('cloudinary').v2;
const User = require('../models/user.model.js');
const Notification = require('../models/notification.model.js'); // Ensure this import is correct
const bcrypt = require('bcryptjs'); // Consider removing if not used

// Get user profile by username
const getUserProfile = async (req, res) => {
    const { username } = req.params;

    try {
        // Find the user by username, excluding the password field
        const user = await User.findOne({ username }).select('-password');

        // Check if user is found
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with user profile
        res.status(200).json(user);

    } catch (error) {
        console.error('Error in Get User Profile:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Follow or unfollow a user
const followUnfollowUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Ensure that req.user is available
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Fetch user details
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        // Check if current user and the user to modify exist
        if (!userToModify || !currentUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prevent self-follow/unfollow
        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: 'Cannot follow or unfollow yourself' });
        }

        // Check if current user is already following the user
        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // Unfollow user
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ message: 'User unfollowed successfully' });
        } else {
            // Follow user
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

            // Optionally send notification to the user
            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id,
            });

            await newNotification.save(); // Adjust if `dispatchEvent` is not a valid method

            res.status(200).json({ message: 'User followed successfully' });
        }

    } catch (error) {
        console.error('Error in follow and unfollow user:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get suggested users
const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        const usersFollowedByMe = await User.findById(userId).select("following");

        const users = await User.aggregate([
            { $match: { _id: { $ne: userId } } },
            { $sample: { size: 10 } }
        ]);

        const filteredUsers = users.filter(user => !usersFollowedByMe.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0, 4);

        suggestedUsers.forEach(user => user.password = null); // Do not expose password

        res.status(200).json(suggestedUsers);

    } catch (error) {
        console.error('Error in Suggested Users:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update user details
const updateUser = async (req, res) => {
    const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if ((newPassword && !currentPassword) || (!newPassword && currentPassword)) {
            return res.status(400).json({ error: 'Please enter both current and new password' });
        }

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid current password' });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters' });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        // Handle Cloudinary image upload and deletion
        if (profileImg) {
            if (user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadedResponse.secure_url;
        }
        if (coverImg) {
            if (user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadedResponse.secure_url;
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();

        user.password = null; // Do not expose password

        res.status(200).json(user);

    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { updateUser, getUserProfile, followUnfollowUser, getSuggestedUsers };
