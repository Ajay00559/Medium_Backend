const express=require("express");
const router= express.Router();
const {
    homepage,
    signup,
    signin,
    signout,
    sendmail,
    forgetpassword,
    upload,
    createblog,
    blogs,
    showstories,
    listblog,
    currentuser,
}= require('../controllers/indexController');
const { isLoggedIn } = require("../../utils/auth");

router.get("/", isLoggedIn, homepage )

 

//post /signup - createUser
router.post("/signup", signup)

//post /signin - loginUser
router.post("/signin", signin)

//get /signout - logoutUser
router.get("/signout", signout)

//get /send-mail -  send-mail to User-email
router.post("/send-mail", sendmail)

//get /forget-password -  forget-password  
router.post("/forget-password", forgetpassword)

// get /create-blog - create blog
router.post("/create-blog", isLoggedIn, createblog);

router.post('/upload',isLoggedIn,upload)
// get /show-stories - show all user's blogs  
router.get("/show-stories", isLoggedIn, showstories);

// get /blogs - show all blogs
router.get("/blogs", blogs);

// get /save/:blogid - save the blog in list of the user
router.get("/list/:blogid", isLoggedIn, listblog);

// get loaduser 
router.get("/loaduser",isLoggedIn, currentuser);


module.exports = router;