const jwt = require("jsonwebtoken");
const User=require('../backend/models/userModel')

exports.sendToken = (user, req, res, statuscode) => {
    
    const token = user.gettoken();

    res.cookie("token", token, {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        // expires: new Date(Date.now() +  10* 1000),
        httpOnly: true,
        // secure: true
    });

    res.json({ message: "user logged in", token ,user});
};

exports.isLoggedIn= async (req,res,next)=>{
    try {
        const token = req.cookies.token;
        // console.log(token)
        const {id}= jwt.verify(token,"SECRETKEYJWT");
          const user= await User.findById(id).select("+password").exec()
        //   console.log(req.user)
          req.user=user;
          next()
    } catch (error) {

        if(error.name==="JsonWebTokenError"){

            res.status(500).json({message:"you need to login"})
        }else if(error.name==="TokenExpiredError"){
            res.status(500).json({message:"session timeout login again"})

        }else{
            res.status(500).json({error})

        }
    }
    // console.log(token) 
}