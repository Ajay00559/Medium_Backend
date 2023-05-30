const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = new mongoose.Schema(
    {
        name: {
            type: String,
            minLength: [4, "name must have atleast 4 characters"],
            required: [true, "name is required"],
        },
        username: {
            type: String,
            unique:true,
            minLength: [4, "username must have atleast 4 characters"],
            // required: [true, "username is required"],
        },
        email: {
            type: String,
            require: [true, "email is required"],
            validate: [validator.isEmail, "email is invalid"],
        },
        password: {
            type: String,
            select:false,
            minLength: [6, "password must have atleast 4 characters"],
            required: [true, "password field must not empty"],
            match: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
        },
        bio:{
            type:String,
            maxLength: [80, "bio must have almost 80 characters"],

        },
        about:{
            type:String,
            maxLength: [130, "about must have almost 130 characters"],

        },
        avatar: {
            type: Object,
            default: {
                public_id: "",
                url: "",
            },
        },
        lists:[{type:mongoose.Schema.Types.ObjectId,ref:"blog"}],
        stories:[{type:mongoose.Schema.Types.ObjectId, ref:"blog"}],
        passwordResetToken:{
            type:Number,
            default:0,
        },
    },
    { timestamps: true }
);

userModel.pre("save", async function () {
    if(!this.isModified("password")){
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
    
});

userModel.methods.comparepassword = function (userpassword) {
    return bcrypt.compareSync(userpassword, this.password);
};

userModel.methods.gettoken = function () {
    return jwt.sign({ id: this._id }, "SECRETKEYJWT", { expiresIn: "1h" });
};


const user = mongoose.model("user", userModel);

module.exports = user;