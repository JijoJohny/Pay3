const express =require("express");
const { getMe,signup,login,logout} =require('../controllers/auth.controller.js');
const { protectRoute } = require('../middleware/protectRoute.js');
const router = express.Router();

router.get("/me",protectRoute,getMe);//auth check

router.post("/signup",signup);

router.post("/login", login);

router.post("/logout", logout);

module.exports= router;