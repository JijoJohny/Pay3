const jwt =require('jsonwebtoken');
require('dotenv').config(); 
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
}
module.exports.generateTokenAndSetCookie=(userId,res) =>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'15d'
    })
    
    res.cookie("jwt",token,{
        maxAge : 15*24*60*60*1000,
        httpOnly: true,
        sameSite:"strict",
        secure:process.env.NODE_ENV !=="development",

    });
};

//module.exports = {generateTokenAndSetCookie};