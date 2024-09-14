const express = require('express');
const { protectRoute } = require('../middleware/protectRoute');
const {createPost,getAllTweets,getPostsByUsername,reTweet} = require('../controllers/post.controllers.js')

const router = express.Router();

router.post("/create",protectRoute,createPost)
router.get('/tweets', getAllTweets)
router.get('/tweets/:username', getPostsByUsername)
router.post("/:postId/retweet",protectRoute,reTweet)
// router.post("/comment",protectRoute,commentOnPost)
// router.delete("/delete",protectRoute,deletePost)


module.exports = router;