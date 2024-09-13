const express = require("express");
const { protectRoute } = require('../middleware/protectRoute.js');
const router =express.Router();
const { getSuggestedUsers , followUnfollowUser , getUserProfile , updateUser} =require('../controllers/user.controller.js')


router.get('/profile/:username', protectRoute, getUserProfile)
router.get("/suggested",protectRoute,getSuggestedUsers)
router.post("/follow/:id",protectRoute,followUnfollowUser)
router.post("/update",protectRoute,updateUser)

module.exports = router;
