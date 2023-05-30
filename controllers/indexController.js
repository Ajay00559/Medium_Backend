const User = require("../models/userModel");
const Blog = require('../models/blogModel')
const { sendToken } = require("../../utils/auth");
const nodemailer=require("nodemailer")
const formidable = require("formidable");
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: "dzthrbefr",
    api_key: "874246161491724",
    api_secret: "OBY9_xgZ8RY0FXXktN0-hMhwPvs",
    secure: true,
});

exports.homepage = (req, res, next) => {
    res.send("This is homepage..."+req.id);
    // res.json({})
};


exports.currentuser = (req, res) => {
    res.status(200).json({ user: req.user });
};
exports.signup = async (req, res, next) => {
    try {
        let user = await User.findOne({ email: req.body.email }).exec();
        if (user) {
            return res.status(501).json({ message: "user already exists" });
        }
        const newUser = new User(req.body);
        user = await newUser.save();
        console.log(user)
        // sendToken(user, req, res, 200);
    } catch (error) {
        res.status(501).json({ message: error.message });
    }
    // res.json({})
};

exports.signin = async (req, res, next) => {
    try {
        
        const { email, password } = req.body;
        console.log(req.body)
        let user = await User.findOne({ email : email }).select("+password").exec();
        console.log(user)
 
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const matchpassword = user.comparepassword(password);

        if (!matchpassword) {
            return res.status(500).json({ message: "wrong credientials" });
        }

        sendToken(user, req, res, 200);
    } catch (error) {
        res.status(501).json({ message: error.message });
    }
    // res.json({})
};

exports.signout = (req, res, next) => {
    res.clearCookie("token");
    console.log('cokkies cleared')
    res.status(200).json({ message: "logged out" });
};

exports.sendmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(404).json({ message: "user not found." });
        }
        const pageurl =
            req.protocol +
            "://" +
            req.get("host") +
            "/forget-password/" +
            user._id;
        // res.status(200).json({ message: pageurl });

        const transport = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: "patelajay00559@gmail.com",
                pass: "itxifzdnequruotj",
            },
        });

        const mailOptions = {
            from: "Medium Pvt. Ltd.<patelajay00559@gmail.com>",
            to: req.body.email,
            subject: "Password Reset Link",
            text: "Do not share this link to anyone.",
            html: `<a href=${pageurl}>Password Reset Link</a>`,
        };

        transport.sendMail(mailOptions, async (err, info) => {
            if (err) return res.status(500).json({ message: err });
            // console.log(info);
            await User.findByIdAndUpdate(user._id, { passwordResetToken: 1 });
            res.status(200).json({
                message: "Email sent! check inbox/spam",
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.forgetpassword=async (req,res,next)=>{
    try {
        
        const user= await User.findById(req.params.id).select("+password").exec();
       if(user.passwordResetToken===1){
           user.passwordResetToken=0;
           user.password = req.body.password;
           await user.save()
           res.status(200).json({message:"password changed"})
       }else{
        res.status(500).json({message:"link expired try again"})

       }
    } catch (error) {
        res.status(500).json({message:error})
    }


}

exports.upload = async (req, res) => {
    try {
        const form = formidable();
        form.parse(req, async (err, fields, files) => {
            if (err) return res.status(500).json({ message: err });
            const user = await User.findById(req.user._id).exec();
            if (files) {
                console.log(files)
                const { public_id, secure_url } =
                    await cloudinary.v2.uploader.upload(files.image.filepath, {
                        folder: "R8",
                        width: 1920,
                        crop: "scale",
                    });
                user.avatar = { public_id, url: secure_url };
                await user.save();

                res.status(200).json({ message: "Image Uploaded successfully" });
                console.log('imageuploaded')
            } else {
                res.status(500).json({ message: "No file uploaded" });
            }
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.createblog = async (req, res) => {
    try {
        const blog = new Blog({ ...req.body, author: req.user._id });
        await req.user.stories.push(blog._id);
        await blog.save();
        await req.user.save();
        res.status(201).json({ message: "blog posted" });
        console.log('blog posted')
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error)
    }
};


exports.blogs = async (req, res) => {
    try {
        const blogs = await Blog.find().exec();
        console.log("hi",blogs)
        res.status(200).json({ blogs:blogs });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

exports.showstories = async (req, res) => {
    try {
        const { stories } = await User.findById(req.user._id)
            .populate("stories")
            .exec();
        console.log(stories);
        res.status(201).json({ message: "user blogs", stories });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

exports.listblog = async (req, res) => {
    try {
        const { blogid } = req.params;
        if (!req.user.lists.includes(blogid)) {
            req.user.lists.push(blogid);
            await req.user.save();
            res.status(200).json({ message: "blog saved to user list" });
        } else {
            const blogIndex = req.user.lists.findIndex(
                (blog) => blog._id === blogid
            );
            req.user.lists.splice(blogIndex, 1);
            await req.user.save();
            res.status(200).json({ message: "blog unsaved from user list" });
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

exports.currentuser = (req, res) => {
    res.status(200).json({ user: req.user });
};